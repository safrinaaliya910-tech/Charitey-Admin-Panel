'use client'

import { useState, useEffect } from 'react'
import { Package, MapPin, ArrowRight } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

interface VolunteerRequest {
  id: string;
  requestId: string;
  donorName: string;
  ngoName: string;
  itemName: string;
  quantity: string;
  status: string;
  donorId?: string;
  ngoId?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
}

export default function VolunteerRequests() {
  const [requests, setRequests] = useState<VolunteerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequestsAndLocations = async () => {
      try {
        // 1. Fetch all users to create a location reference map
        const usersSnap = await getDocs(collection(db, 'users'))
        const usersMap: Record<string, any> = {}
        
        usersSnap.docs.forEach(doc => {
          const userData = doc.data()
          usersMap[doc.id] = userData
          // Fallback matching by name strings if IDs aren't fully linked
          if (userData.name) usersMap[userData.name.toLowerCase()] = userData
          if (userData.ngoName) usersMap[userData.ngoName.toLowerCase()] = userData
        })

        // 2. Fetch pending volunteer requests
        const q = query(collection(db, 'volunteer_requests'), where('status', '==', 'pending'))
        const snapshot = await getDocs(q)
        
        const data = snapshot.docs.map(doc => {
          const reqData = doc.data()
          
          // Cross-reference data to pull correct location profiles
          const donorProfile = usersMap[reqData.donorId] || usersMap[reqData.donorName?.toLowerCase()]
          const ngoProfile = usersMap[reqData.ngoId] || usersMap[reqData.ngoName?.toLowerCase()]

          return {
            id: doc.id,
            ...reqData,
            // Fallback chain: request field -> user profile location -> explicit default string
            pickupLocation: reqData.pickupLocation || donorProfile?.location || 'Location pending',
            deliveryLocation: reqData.deliveryLocation || ngoProfile?.location || 'Location pending'
          }
        }) as VolunteerRequest[]

        setRequests(data)
      } catch (err) {
        console.error('Error fetching requests and profiles:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequestsAndLocations()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Pending Requests</h1>
        <p className="text-gray-500 mt-1">Open donation deliveries waiting for volunteer acceptance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-500 animate-pulse">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {req.status}
                </span>
                <span className="text-xs text-gray-400">ID: {req.requestId?.substring(0, 6)}...</span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package size={18} className="text-[#B56F76]" />
                  {req.itemName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Quantity: <span className="font-semibold text-gray-700">{req.quantity}</span>
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From (Donor)</p>
                  <p className="font-semibold text-gray-800">{req.donorName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {req.pickupLocation}
                  </p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight size={16} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">To (NGO)</p>
                  <p className="font-semibold text-gray-800">{req.ngoName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {req.deliveryLocation}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}