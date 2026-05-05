'use client'

import { useState } from 'react'
import { Truck, AlertCircle } from 'lucide-react'

const travelAgencies = [
  { id: 1, name: 'Express Delivery Co', email: 'contact@expressdelivery.com', phone: '+1-555-1001', status: 'coming_soon', joined: '2024-02-01', coverage: 'City-wide' },
  { id: 2, name: 'Quick Transport Services', email: 'info@quicktransport.com', phone: '+1-555-1002', status: 'coming_soon', joined: '2024-02-05', coverage: 'Multi-city' },
]

export default function TravelAgencies() {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = travelAgencies.filter((agency) => {
    return agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agency.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Travel Agencies</h1>
        <p className="text-gray-500 mt-1">Manage delivery partners for NGOs without volunteer support</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Coming Soon</h3>
          <p className="text-sm text-yellow-800 mb-3">
            The Travel Agencies module is currently in development. This will allow NGOs without volunteer networks to coordinate deliveries through partner transportation services.
          </p>
          <div className="space-y-2 text-sm text-yellow-800">
            <p><strong>Planned Features:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Partner agency registration and verification</li>
              <li>Delivery request assignment and tracking</li>
              <li>Cost management and billing integration</li>
              <li>Real-time delivery status updates</li>
              <li>Rating and review system for agencies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search agencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64 opacity-50"
        />
      </div>

      {/* Placeholder Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agency Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50 transition opacity-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{agency.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{agency.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{agency.phone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                      Coming Soon
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{agency.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
        <p className="text-sm text-[#8E4F5A] font-medium">
          <strong>Current Workflow:</strong> NGOs without available volunteers currently coordinate deliveries directly with donors through the chat system. Travel Agency integration will streamline this process in a future release.
        </p>
      </div>
    </div>
  )
}
