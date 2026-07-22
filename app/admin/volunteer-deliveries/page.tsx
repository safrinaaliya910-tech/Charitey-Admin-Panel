'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { CheckCircle2, Clock, User } from 'lucide-react'

interface DeliveryTracker {
  id: string;
  assignedVolunteer: string;
  donorName: string;
  ngoName: string;
  itemName: string;
  quantity: string;
  status: string; // "accepted" or "completed"
  createdAt: any;
}

export default function VolunteerDeliveries() {
  const [deliveries, setDeliveries] = useState<DeliveryTracker[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        // Fetch requests that are either accepted or completed
        const q = query(collection(db, 'volunteer_requests'), where('status', 'in', ['accepted', 'completed']))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DeliveryTracker[]
        
        // Sort by newest first (assuming createdAt is a firestore timestamp)
        data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
        setDeliveries(data)
      } catch (err) {
        console.error('Error fetching deliveries:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDeliveries()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Delivery Tracking</h1>
        <p className="text-gray-500 mt-1">Track accepted and successfully completed volunteer deliveries.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Item & Quantity</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Assigned Volunteer</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Route (Donor → NGO)</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? <tr><td colSpan={4} className="p-6 text-center text-gray-500">Loading tracking data...</td></tr> :
             deliveries.length === 0 ? <tr><td colSpan={4} className="p-6 text-center text-gray-500">No active or completed deliveries found.</td></tr> :
             deliveries.map((del) => (
              <tr key={del.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{del.itemName}</div>
                  <div className="text-sm text-gray-500 mt-1">{del.quantity}</div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{del.assignedVolunteer || 'Unknown'}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-800"><span className="text-gray-400">From:</span> {del.donorName}</div>
                  <div className="text-sm text-gray-800 mt-1"><span className="text-gray-400">To:</span> {del.ngoName}</div>
                </td>

                <td className="px-6 py-4">
                  {del.status.toLowerCase() === 'completed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      <Clock size={14} /> In Transit (Accepted)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}