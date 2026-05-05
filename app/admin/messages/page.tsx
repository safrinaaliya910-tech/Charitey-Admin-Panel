'use client'

import { useState } from 'react'
import { MessageCircle, AlertCircle } from 'lucide-react'

const conversations = [
  {
    id: 1,
    participants: ['John Smith', 'Sarah Johnson'],
    lastMessage: 'Is the donation ready for pickup?',
    lastTime: '2 hours ago',
    reported: false,
  },
  {
    id: 2,
    participants: ['Maria Garcia', 'Help Hearts NGO'],
    lastMessage: 'Thank you for volunteering with us!',
    lastTime: '5 hours ago',
    reported: false,
  },
  {
    id: 3,
    participants: ['Michael Chen', 'Clean Water Initiative'],
    lastMessage: 'When will the supplies arrive?',
    lastTime: '1 day ago',
    reported: true,
  },
  {
    id: 4,
    participants: ['Emma Davis', 'Medical Aid Foundation'],
    lastMessage: 'Please confirm the donation amount',
    lastTime: '1 day ago',
    reported: false,
  },
  {
    id: 5,
    participants: ['David Wilson', 'Education for All'],
    lastMessage: 'Can you help us with the school project?',
    lastTime: '2 days ago',
    reported: false,
  },
]

const messages = [
  { sender: 'John Smith', content: 'Hi, I want to donate medical supplies', time: '14:30', isOwn: false },
  { sender: 'Sarah Johnson', content: 'That\'s wonderful! Let me check our current needs', time: '14:32', isOwn: true },
  { sender: 'John Smith', content: 'I have about 100 units of bandages and antiseptic', time: '14:33', isOwn: false },
  { sender: 'Sarah Johnson', content: 'Perfect! Is the donation ready for pickup?', time: '14:35', isOwn: true },
  { sender: 'John Smith', content: 'Yes, this weekend would work', time: '14:36', isOwn: false },
]

export default function MessagesMonitoring() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterReported, setFilterReported] = useState('all')
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])

  const filtered = conversations.filter((conv) => {
    const matchSearch = conv.participants.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchReported = filterReported === 'all' || (filterReported === 'reported' ? conv.reported : !conv.reported)
    return matchSearch && matchReported
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Messages Monitoring</h1>
        <p className="text-gray-500 mt-1">Privacy-friendly chat monitoring - View reported chats only (Phase 1)</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
          value={filterReported}
          onChange={(e) => setFilterReported(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Chats</option>
          <option value="reported">Reported Chats</option>
          <option value="unreported">Unreported Chats</option>
        </select>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
                  selectedConversation.id === conv.id ? 'bg-rose-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {conv.participants.join(' & ')}
                    </p>
                    <p className="text-gray-600 text-xs mt-1 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.reported && (
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-2">{conv.lastTime}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          {/* Thread Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedConversation.participants.join(' & ')}
                </h2>
                {selectedConversation.reported && (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">Reported Chat</span>
                  </div>
                )}
              </div>
              <MessageCircle size={24} className="text-[#B76E79]" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-96">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? 'bg-[#B76E79] text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">{msg.sender}</p>
                  <p className={`text-sm ${msg.isOwn ? 'text-rose-100' : 'text-gray-700'}`}>{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-rose-200' : 'text-gray-500'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">Read-only monitoring - No send capabilities</p>
          </div>
        </div>
      </div>
    </div>
  )
}
