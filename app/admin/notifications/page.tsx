'use client'

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'

const notifications = [
  { id: 1, recipient: 'John Smith', title: 'Donation Received', body: 'Your donation of $500 has been received', type: 'donation', date: '2024-01-20', read: false },
  { id: 2, recipient: 'Help Hearts NGO', title: 'New Donation Alert', body: 'You received a donation of $1,200', type: 'donation', date: '2024-01-19', read: false },
  { id: 3, recipient: 'Maria Garcia', title: 'Welcome to Volunteers', body: 'You have been registered as a volunteer', type: 'system', date: '2024-01-18', read: true },
  { id: 4, recipient: 'Clean Water Initiative', title: 'Request Fulfilled', body: 'Your request for Water Filters has been fulfilled', type: 'request', date: '2024-01-17', read: true },
  { id: 5, recipient: 'David Wilson', title: 'Approval Confirmation', body: 'Your account has been approved', type: 'approval', date: '2024-01-16', read: false },
  { id: 6, recipient: 'Sarah Johnson', title: 'Account Suspended', body: 'Your account has been suspended due to violations', type: 'warning', date: '2024-01-15', read: true },
]

const typeColors: Record<string, string> = {
  donation: 'bg-pink-100 text-pink-800',
  approval: 'bg-green-100 text-green-800',
  request: 'bg-blue-100 text-blue-800',
  system: 'bg-purple-100 text-purple-800',
  warning: 'bg-red-100 text-red-800',
}

export default function NotificationsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRead, setFilterRead] = useState('all')

  const filtered = notifications.filter((notif) => {
    const matchSearch = notif.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       notif.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === 'all' || notif.type === filterType
    const matchRead = filterRead === 'all' || (filterRead === 'unread' ? !notif.read : notif.read)
    return matchSearch && matchType && matchRead
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
        <p className="text-gray-500 mt-1">Total: {notifications.length} notifications</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by recipient or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-64"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="donation">Donation</option>
          <option value="approval">Approval</option>
          <option value="request">Request</option>
          <option value="system">System</option>
          <option value="warning">Warning</option>
        </select>
        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border transition ${
              notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeColors[notif.type]}`}>
                    {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                  </span>
                  {!notif.read && (
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{notif.body}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-gray-500 text-xs">
                    <span className="font-medium">To:</span> {notif.recipient}
                  </p>
                  <p className="text-gray-500 text-xs">{notif.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 hover:bg-gray-200 rounded transition text-gray-600">
                  <Eye size={18} />
                </button>
                <button className="p-2 hover:bg-red-100 rounded transition text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No notifications found</p>
        </div>
      )}

      <div className="text-sm text-gray-600 border-t border-gray-200 pt-4">
        Showing {filtered.length} of {notifications.length} notifications
      </div>
    </div>
  )
}
