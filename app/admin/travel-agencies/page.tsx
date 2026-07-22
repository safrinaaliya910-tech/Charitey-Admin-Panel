'use client'

import { useState, useEffect } from 'react'
import { Search, Ban, CheckCircle, ShieldAlert, Star } from 'lucide-react'
// IMPORTANT: Update this import path to point to your actual Firebase config file
import { db } from '@/lib/firebase' 
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

// Define the Volunteer type based on your Firestore structure
interface Volunteer {
  id: string; // The document ID (uid)
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  blocked: boolean;
  availability?: boolean;
  rating?: number;
  totalDeliveries?: number;
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch volunteers from Firestore
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true)
        const q = query(collection(db, 'users'), where('role', '==', 'volunteer'))
        const snapshot = await getDocs(q)
        
        const volunteersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Volunteer[]

        setVolunteers(volunteersData)
      } catch (err) {
        console.error('Error fetching volunteers:', err)
        setError('Failed to load volunteers. Please check your connection.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVolunteers()
  }, [])

  // Handle blocking/unblocking a volunteer
  const toggleBlockStatus = async (volunteerId: string, currentBlockedStatus: boolean) => {
    // Optimistic UI update for immediate feedback
    setVolunteers(prev => 
      prev.map(v => v.id === volunteerId ? { ...v, blocked: !currentBlockedStatus } : v)
    )

    try {
      const userRef = doc(db, 'users', volunteerId)
      await updateDoc(userRef, {
        blocked: !currentBlockedStatus
      })
    } catch (err) {
      console.error('Error updating block status:', err)
      // Revert if it fails
      setVolunteers(prev => 
        prev.map(v => v.id === volunteerId ? { ...v, blocked: currentBlockedStatus } : v)
      )
      alert("Failed to update status. Please try again.")
    }
  }

  // Filter based on search term
  const filtered = volunteers.filter((volunteer) => {
    const search = searchTerm.toLowerCase()
    return (
      (volunteer.name?.toLowerCase().includes(search)) ||
      (volunteer.email?.toLowerCase().includes(search)) ||
      (volunteer.phone?.includes(search))
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Volunteers</h1>
        <p className="text-gray-500 mt-1">Manage delivery partners and their access to the platform</p>
      </div>

      {/* Search */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <ShieldAlert size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Volunteer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact Info</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stats</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Account</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading volunteers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No volunteers found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((volunteer) => (
                  <tr key={volunteer.id} className={`hover:bg-gray-50 transition ${volunteer.blocked ? 'bg-red-50/50' : ''}`}>
                    
                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {volunteer.name || 'N/A'}
                    </td>
                    
                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{volunteer.email}</div>
                      <div className="text-xs text-gray-500 mt-1">{volunteer.phone || 'No phone'}</div>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{volunteer.rating || 0}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {volunteer.totalDeliveries || 0} deliveries
                      </div>
                    </td>

                    {/* Availability Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {volunteer.availability ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                          Busy / Offline
                        </span>
                      )}
                    </td>

                    {/* Blocked Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {volunteer.blocked ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleBlockStatus(volunteer.id, volunteer.blocked)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md border transition-colors ${
                          volunteer.blocked 
                            ? 'border-green-200 text-green-700 hover:bg-green-50' 
                            : 'border-red-200 text-red-700 hover:bg-red-50'
                        }`}
                      >
                        {volunteer.blocked ? (
                          <>
                            <CheckCircle size={16} />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={16} />
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}