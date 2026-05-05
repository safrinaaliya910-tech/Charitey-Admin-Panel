'use client'

import { useState } from 'react'
import { Eye, CheckCircle, Clock, Ban, RotateCcw } from 'lucide-react'

const volunteers = [
  { id: 1, name: 'Alex Rodriguez', ngo: 'Help Hearts NGO', status: 'available', availability: 'Weekends', joined: '2023-11-01' },
  { id: 2, name: 'Maria Garcia', ngo: 'Clean Water Initiative', status: 'available', availability: 'Evenings', joined: '2023-10-15' },
  { id: 3, name: 'James Wilson', ngo: 'Education for All', status: 'unavailable', availability: 'Weekends', joined: '2023-09-20' },
  { id: 4, name: 'Lisa Chen', ngo: 'Medical Aid Foundation', status: 'blocked', availability: 'N/A', joined: '2023-08-10' },
  { id: 5, name: 'Robert Johnson', ngo: 'Help Hearts NGO', status: 'available', availability: 'Full-time', joined: '2024-01-05' },
  { id: 6, name: 'Angela Davis', ngo: 'Clean Water Initiative', status: 'available', availability: 'Weekday Evenings', joined: '2023-12-15' },
]

const statusColors = {
  available: 'bg-green-100 text-green-800',
  unavailable: 'bg-gray-100 text-gray-800',
  blocked: 'bg-red-100 text-red-800',
}

export default function VolunteersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = volunteers.filter((volunteer) => {
    const matchSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       volunteer.ngo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || volunteer.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Volunteers Management</h1>
        <p className="text-gray-500 mt-1">Manage volunteer availability and NGO delivery support • Total: {volunteers.length} volunteers</p>
      </div>

      {/* Delivery Support Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium">
          <strong>Travel Agency Support:</strong> NGOs without volunteers show &quot;Travel Agency Support - Later Phase / Coming Soon&quot; for delivery coordination.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or NGO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Associated NGO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Availability</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{volunteer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{volunteer.ngo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[volunteer.status as keyof typeof statusColors]}`}>
                      {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{volunteer.availability}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{volunteer.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]" title="View Details">
                        <Eye size={18} />
                      </button>
                      {volunteer.status === 'available' && (
                        <button className="p-2 hover:bg-yellow-100 rounded transition text-yellow-700" title="Mark Unavailable">
                          <Clock size={18} />
                        </button>
                      )}
                      {volunteer.status === 'unavailable' && (
                        <button className="p-2 hover:bg-green-100 rounded transition text-green-600" title="Mark Available">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {volunteer.status !== 'blocked' && (
                        <button className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Block Volunteer">
                          <Ban size={18} />
                        </button>
                      )}
                      {volunteer.status === 'blocked' && (
                        <button className="p-2 hover:bg-blue-100 rounded transition text-blue-600" title="Unblock Volunteer">
                          <RotateCcw size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
          Showing 1-{filtered.length} of {volunteers.length} volunteers
        </div>
      </div>
    </div>
  )
}
