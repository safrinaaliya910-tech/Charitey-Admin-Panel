'use client'

import { useState } from 'react'
import { Eye, Trash2, CheckCircle } from 'lucide-react'

const posts = [
  { id: 1, ngo: 'Help Hearts NGO', item: 'Medical Supplies', category: 'Healthcare', quantity: 100, description: 'First aid kits and medicines', volunteerNeeded: 'Yes', status: 'active', date: '2024-01-20' },
  { id: 2, ngo: 'Clean Water Initiative', item: 'Food Packets', category: 'Food', quantity: 50, description: 'Dry food ration packs', volunteerNeeded: 'No', status: 'fulfilled', date: '2024-01-18' },
  { id: 3, ngo: 'Education for All', item: 'Books', category: 'Education', quantity: 200, description: 'Textbooks and notebooks', volunteerNeeded: 'Yes', status: 'active', date: '2024-01-15' },
  { id: 4, ngo: 'Clean Water Initiative', item: 'Water Filter Kits', category: 'Sanitation', quantity: 30, description: 'Portable water purifiers', volunteerNeeded: 'Yes', status: 'active', date: '2024-01-19' },
  { id: 5, ngo: 'Medical Aid Foundation', item: 'Clothes', category: 'Clothing', quantity: 150, description: 'Warm winter clothing', volunteerNeeded: 'Yes', status: 'active', date: '2024-01-21' },
  { id: 6, ngo: 'Help Hearts NGO', item: 'School Supplies', category: 'Education', quantity: 500, description: 'Pens, pencils, erasers', volunteerNeeded: 'No', status: 'active', date: '2024-01-17' },
]

const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  fulfilled: 'bg-green-100 text-green-800',
  deleted: 'bg-gray-100 text-gray-800',
  archived: 'bg-gray-100 text-gray-800',
}

const categoryColors: Record<string, string> = {
  Healthcare: 'bg-red-50 text-red-700',
  Food: 'bg-orange-50 text-orange-700',
  Education: 'bg-blue-50 text-blue-700',
  'Water & Sanitation': 'bg-cyan-50 text-cyan-700',
  Emergency: 'bg-pink-50 text-pink-700',
  Clothing: 'bg-purple-50 text-purple-700',
}

export default function PostsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const categories = ['Healthcare', 'Food', 'Education', 'Water & Sanitation', 'Emergency', 'Clothing']

  const filtered = posts.filter((post) => {
    const matchSearch = post.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.ngo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = filterCategory === 'all' || post.category === filterCategory
    const matchStatus = filterStatus === 'all' || post.status === filterStatus
    return matchSearch && matchCategory && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Posts & Requests Management</h1>
        <p className="text-gray-500 mt-1">Item Donation Requests • Total: {posts.length} requests</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by item or NGO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NGO Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Needed Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Volunteer Needed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{post.ngo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{post.item}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className={post.volunteerNeeded === 'Yes' ? 'text-green-600 font-semibold' : 'text-gray-600'}>{post.volunteerNeeded}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[post.status as keyof typeof statusColors]}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]">
                        <Eye size={18} />
                      </button>
                      {post.status !== 'fulfilled' && (
                        <button className="p-2 hover:bg-green-100 rounded transition text-green-600">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="p-2 hover:bg-red-100 rounded transition text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
          Showing 1-{filtered.length} of {posts.length} posts
        </div>
      </div>
    </div>
  )
}
