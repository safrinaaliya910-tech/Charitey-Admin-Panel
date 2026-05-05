'use client'

import { useState } from 'react'
import { FileText, Filter } from 'lucide-react'

const auditLogs = [
  { id: 1, admin: 'Admin User', action: 'Approved NGO', details: 'Help Hearts NGO (ID: NGO-2024-001)', timestamp: '2024-01-20 14:30', ipAddress: '192.168.1.1' },
  { id: 2, admin: 'Admin User', action: 'Blocked User', details: 'John Doe (Donor)', timestamp: '2024-01-20 13:15', ipAddress: '192.168.1.1' },
  { id: 3, admin: 'Admin User', action: 'Updated Donation Status', details: 'Donation #234 → Completed', timestamp: '2024-01-20 12:45', ipAddress: '192.168.1.2' },
  { id: 4, admin: 'Admin User', action: 'Created Announcement', details: 'New feature announcement', timestamp: '2024-01-19 16:20', ipAddress: '192.168.1.1' },
  { id: 5, admin: 'Admin User', action: 'Rejected NGO', details: 'Medical Aid Foundation (ID: NGO-2024-002)', timestamp: '2024-01-19 11:00', ipAddress: '192.168.1.3' },
  { id: 6, admin: 'Admin User', action: 'Marked Report as Reviewed', details: 'Report #5', timestamp: '2024-01-18 15:30', ipAddress: '192.168.1.1' },
]

const actionColors: Record<string, string> = {
  'Approved NGO': 'text-green-600',
  'Blocked User': 'text-red-600',
  'Rejected NGO': 'text-red-600',
  'Updated Donation Status': 'text-blue-600',
  'Created Announcement': 'text-purple-600',
  'Marked Report as Reviewed': 'text-orange-600',
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  const filtered = auditLogs.filter((log) => {
    const matchSearch = log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchAction = filterAction === 'all' || log.action === filterAction
    return matchSearch && matchAction
  })

  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Audit Logs</h1>
        <p className="text-gray-500 mt-1">Track all admin actions and system changes • Total: {auditLogs.length} logs</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium">
          <strong>Audit Trail:</strong> Complete record of all admin actions with timestamps and IP addresses for security and accountability.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by admin, action, or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Admin</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.admin}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${actionColors[log.action] || 'text-gray-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No logs found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
