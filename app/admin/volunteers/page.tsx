'use client'

import { useState, useEffect } from 'react'
import { Search, Ban, CheckCircle, ShieldAlert, MapPin, Truck } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

interface Volunteer {
  id: string; // Document ID
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  license: string;
  deliveriesCompleted: number;
  blocked?: boolean; // Optional, defaults to false if not set
}

export default function VolunteerDirectory() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'volunteer'))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Volunteer[]
        setVolunteers(data)
      } catch (err) {
        console.error('Error fetching volunteers:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVolunteers()
  }, [])

  const toggleBlockStatus = async (id: string, currentStatus: boolean) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, blocked: !currentStatus } : v))
    try {
      await updateDoc(doc(db, 'users', id), { blocked: !currentStatus })
    } catch (err) {
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, blocked: currentStatus } : v))
      alert("Failed to update block status.")
    }
  }

  const filtered = volunteers.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Volunteer Directory</h1>
        <p className="text-gray-500 mt-1">Manage volunteer details, locations, and access status</p>
      </div>

      <div className="flex bg-white border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md items-center">
        <Search className="text-gray-400 mr-2" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Volunteer Info</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Location / License</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Deliveries</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-900 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr> : 
             filtered.map((vol) => (
              <tr key={vol.id} className={vol.blocked ? 'bg-red-50/50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{vol.name}</div>
                  <div className="text-sm text-gray-500">{vol.email}</div>
                  <div className="text-sm text-gray-500">{vol.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin size={14}/> {vol.location || 'N/A'}</div>
                  <div className="text-xs text-gray-400 mt-1">Lic: {vol.license || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-2 mt-3">
                  <Truck size={16} className="text-blue-500" />
                  {vol.deliveriesCompleted || 0} completed
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${vol.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {vol.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => toggleBlockStatus(vol.id, !!vol.blocked)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm transition ${vol.blocked ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-red-200 text-red-700 hover:bg-red-50'}`}>
                    {vol.blocked ? <><CheckCircle size={14}/> Unblock</> : <><Ban size={14}/> Block</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}