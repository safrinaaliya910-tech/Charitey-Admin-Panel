'use client'

import { useState } from 'react'
import { Eye, ChevronDown, MoreVertical, Check, Clock, CheckCircle2 } from 'lucide-react'

const donations = [
  { id: 1, donor: 'John Smith', ngo: 'Help Hearts NGO', requestItem: 'Medical Supplies', donatedItem: 'First Aid Kits', quantity: 50, volunteerAvailable: 'Yes', chatOpened: 'No', status: 'pending', date: '2024-01-20' },
  { id: 2, donor: 'Sarah Johnson', ngo: 'Clean Water Initiative', requestItem: 'Water Filter Kits', donatedItem: 'Water Purifiers', quantity: 30, volunteerAvailable: 'Yes', chatOpened: 'Yes', status: 'confirmed', date: '2024-01-18' },
  { id: 3, donor: 'Michael Chen', ngo: 'Education for All', requestItem: 'Books', donatedItem: 'School Textbooks', quantity: 200, volunteerAvailable: 'No', chatOpened: 'Yes', status: 'completed', date: '2024-01-15' },
  { id: 4, donor: 'Emma Davis', ngo: 'Medical Aid Foundation', requestItem: 'Clothes', donatedItem: 'Winter Clothing', quantity: 100, volunteerAvailable: 'Yes', chatOpened: 'No', status: 'pending', date: '2024-01-21' },
  { id: 5, donor: 'David Wilson', ngo: 'Help Hearts NGO', requestItem: 'Food Packets', donatedItem: 'Food Packages', quantity: 50, volunteerAvailable: 'No', chatOpened: 'No', status: 'cancelled', date: '2024-01-10' },
  { id: 6, donor: 'Lisa Brown', ngo: 'Clean Water Initiative', requestItem: 'Sanitation Items', donatedItem: 'Hygiene Kits', quantity: 75, volunteerAvailable: 'Yes', chatOpened: 'Yes', status: 'completed', date: '2024-01-08' },
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function DonationsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = donations.filter((donation) => {
    const matchSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       donation.ngo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || donation.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Donations Management</h1>
        <p className="text-gray-500 mt-1">Item-based donations with volunteer delivery tracking • Total: {donations.length} donations</p>
      </div>

      {/* Donation Status Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-700 font-semibold">PENDING</p>
          <p className="text-2xl font-bold text-yellow-800">{donations.filter(d => d.status === 'pending').length}</p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting confirmation</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 font-semibold">CONFIRMED</p>
          <p className="text-2xl font-bold text-blue-800">{donations.filter(d => d.status === 'confirmed').length}</p>
          <p className="text-xs text-blue-600 mt-1">Ready for delivery</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-700 font-semibold">COMPLETED</p>
          <p className="text-2xl font-bold text-green-800">{donations.filter(d => d.status === 'completed').length}</p>
          <p className="text-xs text-green-600 mt-1">Successfully delivered</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 font-semibold">CANCELLED</p>
          <p className="text-2xl font-bold text-red-800">{donations.filter(d => d.status === 'cancelled').length}</p>
          <p className="text-xs text-red-600 mt-1">Cancelled/Declined</p>
        </div>
      </div>

      {/* Volunteer Status Legend */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
        <p className="text-sm text-[#8E4F5A] font-medium mb-2">
          <strong>Volunteer Delivery:</strong>
        </p>
        <ul className="text-sm text-[#8E4F5A] space-y-1 list-disc list-inside">
          <li><span className="font-semibold text-green-600">Yes</span> - NGO has volunteers available for delivery/pickup</li>
          <li><span className="font-semibold text-gray-600">No</span> - NGO using Travel Agency Support (coming soon) or donor/NGO coordination</li>
          <li><span className="font-semibold text-blue-600">Chat: Yes</span> - Donor and NGO have opened communication channel</li>
        </ul>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by donor or NGO..."
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Donor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NGO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Request Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Donated Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Volunteer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Chat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{donation.donor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{donation.ngo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{donation.requestItem}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{donation.donatedItem}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{donation.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={donation.volunteerAvailable === 'Yes' ? 'text-green-600 font-semibold' : 'text-gray-600'}>{donation.volunteerAvailable}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={donation.chatOpened === 'Yes' ? 'text-blue-600 font-semibold' : 'text-gray-600'}>{donation.chatOpened}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[donation.status as keyof typeof statusColors]}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]">
                        <Eye size={18} />
                      </button>
                      {donation.status === 'pending' && (
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]">
                          <option>Update Status</option>
                          <option>Confirm</option>
                          <option>Complete</option>
                          <option>Cancel</option>
                        </select>
                      )}
                      {donation.status === 'confirmed' && (
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition font-medium">
                          Complete
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
          Showing 1-{filtered.length} of {donations.length} donations
        </div>
      </div>
    </div>
  )
}
