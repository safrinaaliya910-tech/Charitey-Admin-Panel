'use client'

import { useState } from 'react'
import { Eye, CheckCircle, Shield } from 'lucide-react'

const reports = [
  { id: 1, reportedUser: 'John Doe', reportedUserRole: 'Donor', reporter: 'Help Hearts NGO', reporterType: 'NGO', reason: 'Suspicious Activity', status: 'pending', date: '2024-01-20' },
  { id: 2, reportedUser: 'Sarah Smith', reportedUserRole: 'Volunteer', reporter: 'Clean Water Initiative', reporterType: 'NGO', reason: 'Inappropriate Behavior', status: 'pending', date: '2024-01-19' },
  { id: 3, reportedUser: 'Michael Johnson', reportedUserRole: 'Donor', reporter: 'Education for All', reporterType: 'NGO', reason: 'Harassment', status: 'reviewed', date: '2024-01-15' },
  { id: 4, reportedUser: 'Emma Wilson', reportedUserRole: 'NGO', reporter: 'John Smith', reporterType: 'Donor', reason: 'Fake Profile', status: 'resolved', date: '2024-01-10' },
  { id: 5, reportedUser: 'David Lee', reportedUserRole: 'Volunteer', reporter: 'Medical Aid Foundation', reporterType: 'NGO', reason: 'Non-compliance', status: 'reviewed', date: '2024-01-08' },
]

const statusColors = {
  pending: 'bg-red-100 text-red-800',
  reviewed: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
}

export default function ReportsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = reports.filter((report) => {
    const matchSearch = report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || report.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Reports & Complaints</h1>
        <p className="text-gray-500 mt-1">User Reports • Total: {reports.length} reports</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by reported user or reason..."
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
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reported User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reporter</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reporter Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{report.reportedUser}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.reportedUserRole}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.reporter}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.reporterType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[report.status as keyof typeof statusColors]}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]" title="View Details">
                        <Eye size={18} />
                      </button>
                      {report.status === 'pending' && (
                        <button className="p-2 hover:bg-blue-100 rounded transition text-blue-600" title="Mark as Reviewed">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Block User">
                        <Shield size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
          Showing 1-{filtered.length} of {reports.length} reports
        </div>
      </div>
    </div>
  )
}
