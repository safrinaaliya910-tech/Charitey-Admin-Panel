'use client'

import { useState } from 'react'
import { ChevronDown, Eye, Check, Trash2, Download, Ban, RotateCcw, CheckCircle } from 'lucide-react'
import Modal from '@/components/admin/Modal'
import ConfirmationDialog from '@/components/admin/ConfirmationDialog'
import { exportUsersCSV } from '@/lib/admin/csv-export'

const users = [
  { id: 1, name: 'Help Hearts NGO', email: 'contact@helphearts.org', phone: '+1-555-0101', role: 'NGO', status: 'pending', joined: '2024-01-15', registrationId: 'NGO-2024-001', address: '123 Main St, City', description: 'Community health assistance' },
  { id: 2, name: 'Clean Water Initiative', email: 'info@cleanwater.org', phone: '+1-555-0102', role: 'NGO', status: 'approved', joined: '2024-01-10', registrationId: 'NGO-2023-045', address: '456 Water Ave, City', description: 'Water sanitation projects' },
  { id: 3, name: 'Education for All', email: 'contact@educationforall.org', phone: '+1-555-0103', role: 'NGO', status: 'approved', joined: '2023-12-20', registrationId: 'NGO-2023-012', address: '789 School Rd, City', description: 'Education and scholarships' },
  { id: 4, name: 'John Smith', email: 'john@example.com', phone: '+1-555-0201', role: 'Donor', status: 'active', joined: '2024-01-18' },
  { id: 5, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0202', role: 'Donor', status: 'blocked', joined: '2024-01-05' },
  { id: 6, name: 'Michael Chen', email: 'michael@example.com', phone: '+1-555-0203', role: 'Donor', status: 'active', joined: '2024-01-12' },
  { id: 7, name: 'Medical Aid Foundation', email: 'info@medicalaid.org', phone: '+1-555-0104', role: 'NGO', status: 'rejected', joined: '2024-01-20', registrationId: 'NGO-2024-002', address: '321 Medical Way, City', description: 'Emergency medical assistance' },
  { id: 8, name: 'Alex Rodriguez', email: 'alex.rodriguez@email.com', phone: '+1-555-0301', role: 'Volunteer', status: 'active', joined: '2024-01-08' },
  { id: 9, name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '+1-555-0302', role: 'Volunteer', status: 'active', joined: '2023-12-15' },
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  active: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string>('')

  const filtered = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = filterRole === 'all' || user.role === filterRole
    const matchStatus = filterStatus === 'all' || user.status === filterStatus
    return matchSearch && matchRole && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2B1B1F]">Users Management</h1>
          <p className="text-gray-500 mt-1">NGOs, Donors, and Volunteers • Total: {users.length} users</p>
        </div>
        <button
          onClick={() => exportUsersCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          title="Export data as CSV"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* NGO Approval Notice */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
        <p className="text-sm text-[#8E4F5A] font-medium">
          <strong>Note:</strong> Only approved NGOs can post donation requests. Pending NGOs must be approved before they can access the platform.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Roles</option>
          <option value="NGO">NGO</option>
          <option value="Donor">Donor</option>
          <option value="Volunteer">Volunteer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status as keyof typeof statusColors]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => {
                          setSelectedUser(user)
                          setShowModal(true)
                        }}
                        className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {user.role === 'NGO' && user.status === 'pending' && (
                        <>
                          <button className="p-2 hover:bg-green-100 rounded transition text-green-600" title="Approve NGO">
                            <CheckCircle size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Reject NGO">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                      {user.role === 'NGO' && (user.status === 'approved' || user.status === 'rejected') && (
                        <button className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Block NGO">
                          <Ban size={18} />
                        </button>
                      )}
                      {(user.status === 'blocked' || user.status === 'rejected') && (
                        <button className="p-2 hover:bg-blue-100 rounded transition text-blue-600" title="Unblock User">
                          <RotateCcw size={18} />
                        </button>
                      )}
                      {user.role !== 'NGO' && user.status === 'active' && (
                        <button className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Block User">
                          <Ban size={18} />
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
          Showing 1-{filtered.length} of {users.length} users
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={selectedUser?.name || 'User Details'}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Phone</p>
                <p className="text-gray-900">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Role</p>
                <p className="text-gray-900">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedUser.status as keyof typeof statusColors]}`}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Joined</p>
                <p className="text-gray-900">{selectedUser.joined}</p>
              </div>
              {selectedUser.role === 'NGO' && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Registration ID</p>
                  <p className="text-gray-900 font-semibold text-[#B76E79]">{selectedUser.registrationId}</p>
                </div>
              )}
            </div>
            {selectedUser.role === 'NGO' && (
              <>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p className="text-gray-900">{selectedUser.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Description</p>
                  <p className="text-gray-900">{selectedUser.description}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          console.log('Action confirmed:', confirmAction)
          setShowConfirm(false)
        }}
        title="Confirm Action"
        message={`Are you sure you want to ${confirmAction} this user?`}
        confirmText={confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
        isDangerous={confirmAction !== 'approve'}
      />
    </div>
  )
}
