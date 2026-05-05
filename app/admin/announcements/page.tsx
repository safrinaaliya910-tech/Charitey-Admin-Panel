'use client'

import { useState } from 'react'
import { Megaphone, Plus, Edit2, Trash2, Eye } from 'lucide-react'
import Modal from '@/components/admin/Modal'
import ConfirmationDialog from '@/components/admin/ConfirmationDialog'

const announcements = [
  { id: 1, title: 'Welcome to Charitey', content: 'Welcome to our new charity platform. Start making a difference today!', target: 'all', status: 'active', created: '2024-01-15', views: 1250 },
  { id: 2, title: 'NGO Verification Update', content: 'All NGOs must now provide registration IDs for verification.', target: 'ngo', status: 'active', created: '2024-01-18', views: 890 },
  { id: 3, title: 'Volunteer Opportunities Available', content: 'New volunteer assignments available. Check the volunteers page!', target: 'volunteer', status: 'active', created: '2024-01-19', views: 450 },
  { id: 4, title: 'Donation Match Campaign', content: 'Donations are being matched 1:1 this week only!', target: 'donor', status: 'draft', created: '2024-01-20', views: 0 },
]

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTarget, setFilterTarget] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const filtered = announcements.filter((ann) => {
    const matchSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ann.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTarget = filterTarget === 'all' || ann.target === filterTarget
    const matchStatus = filterStatus === 'all' || ann.status === filterStatus
    return matchSearch && matchTarget && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2B1B1F]">Announcements</h1>
          <p className="text-gray-500 mt-1">Create and manage platform announcements • Total: {announcements.length}</p>
        </div>
        <button
          onClick={() => {
            setSelectedAnnouncement(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#8E4F5A] transition font-medium"
        >
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
          value={filterTarget}
          onChange={(e) => setFilterTarget(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Users</option>
          <option value="all">All Users</option>
          <option value="ngo">NGOs Only</option>
          <option value="donor">Donors Only</option>
          <option value="volunteer">Volunteers Only</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((ann) => (
                <tr key={ann.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ann.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ann.target === 'all' ? 'All Users' : ann.target.charAt(0).toUpperCase() + ann.target.slice(1)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      ann.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ann.status.charAt(0).toUpperCase() + ann.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                    <Eye size={16} className="text-gray-400" />
                    {ann.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ann.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAnnouncement(ann)
                          setShowModal(true)
                        }}
                        className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAnnouncement(ann)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-2 hover:bg-red-100 rounded transition text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAnnouncement?.title || 'Announcement'}
        size="lg"
      >
        {selectedAnnouncement && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Content</p>
              <p className="text-gray-900">{selectedAnnouncement.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Target Audience</p>
                <p className="text-gray-900">{selectedAnnouncement.target === 'all' ? 'All Users' : selectedAnnouncement.target.charAt(0).toUpperCase() + selectedAnnouncement.target.slice(1)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedAnnouncement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Views</p>
                <p className="text-gray-900">{selectedAnnouncement.views.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Created</p>
                <p className="text-gray-900">{selectedAnnouncement.created}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
            <input
              type="text"
              defaultValue={selectedAnnouncement?.title || ''}
              placeholder="Announcement title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Content</label>
            <textarea
              defaultValue={selectedAnnouncement?.content || ''}
              placeholder="Announcement content..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Target Audience</label>
            <select
              defaultValue={selectedAnnouncement?.target || 'all'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            >
              <option value="all">All Users</option>
              <option value="ngo">NGOs Only</option>
              <option value="donor">Donors Only</option>
              <option value="volunteer">Volunteers Only</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#8E4F5A] transition font-medium">
              {selectedAnnouncement ? 'Save Changes' : 'Create Announcement'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          console.log('Announcement deleted')
          setShowConfirm(false)
        }}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  )
}
