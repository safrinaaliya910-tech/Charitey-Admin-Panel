'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, AlertCircle, Image as ImageIcon, Film, FileText } from 'lucide-react'
import { collection, getDocs, onSnapshot, query, collectionGroup } from 'firebase/firestore'
import { db } from "@/lib/firebase"

export default function MessagesMonitoring() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterReported, setFilterReported] = useState('all')
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [globalUsersMap, setGlobalUsersMap] = useState<Record<string, any>>({})

  useEffect(() => {
    let unsubscribe: any = null

    const initializeChatMonitor = async () => {
      try {
        // 1. Fetch all users for accurate Role and Profile mapping
        const usersSnap = await getDocs(collection(db, 'users'))
        const usersMap: Record<string, any> = {}
        usersSnap.docs.forEach(doc => {
          usersMap[doc.id] = doc.data()
        })
        setGlobalUsersMap(usersMap)

        // 2. Fetch all chats structure for fallback context
        const chatsSnap = await getDocs(collection(db, 'chats'))
        const chatsMap: Record<string, any> = {}
        chatsSnap.docs.forEach(doc => {
          chatsMap[doc.id] = doc.data()
        })

        // 3. Listen to all messages globally across subcollections
        const q = query(collectionGroup(db, 'messages'))
        unsubscribe = onSnapshot(q, (snapshot) => {
          const allMessages = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              chatId: doc.ref.parent.parent?.id || 'unknown',
              message: data.message || data.text || '',
              senderId: data.senderId,
              receiverId: data.receiverId,
              timestamp: data.timestamp ? data.timestamp.toMillis() : 0
            }
          })

          // Sort chronological order
          allMessages.sort((a, b) => a.timestamp - b.timestamp)

          // Group by unique Chat ID
          const chatGroups: Record<string, any[]> = {}
          allMessages.forEach(msg => {
            if (!chatGroups[msg.chatId]) chatGroups[msg.chatId] = []
            chatGroups[msg.chatId].push(msg)
          })

          // 4. Construct formatted UI Chat feeds
          const formattedConvos = Object.keys(chatGroups).map(chatId => {
            const msgs = chatGroups[chatId]
            const lastMsg = msgs[msgs.length - 1]
            const chatDoc = chatsMap[chatId] || {}

            const getRealName = (uid: string) => {
              if (usersMap[uid]) {
                return usersMap[uid].name || usersMap[uid].ngoName || usersMap[uid].displayName || 'User'
              }
              if (uid === chatDoc.donorId) return chatDoc.donorName
              if (uid === chatDoc.ngoId) return chatDoc.ngoName
              return 'Unknown User'
            }

            // Figure out the first sender id in history to use as the left-alignment anchor
            const primaryParticipantId = chatDoc.donorId || msgs[0]?.senderId

            const finalMsgs = msgs.map(m => {
              const userProfile = usersMap[m.senderId]
              let formattedRole = 'User'
              
              if (userProfile?.role === 'ngo') formattedRole = 'NGO'
              else if (userProfile?.role === 'volunteer') formattedRole = 'Volunteer'
              else if (userProfile?.role === 'donor') formattedRole = 'Donor'

              return {
                ...m,
                senderName: getRealName(m.senderId),
                roleLabel: formattedRole,
                // If it equals our anchor ID, it goes to the left side, otherwise right side.
                // This ensures two users are NEVER stacked on the same side together!
                isRightSide: m.senderId !== primaryParticipantId 
              }
            })

            const senderName = getRealName(lastMsg.senderId)
            const receiverName = getRealName(lastMsg.receiverId)

            return {
              id: chatId,
              participants: [senderName, receiverName],
              lastMessage: lastMsg.message,
              lastTime: lastMsg.timestamp,
              reported: chatDoc.isReported || false,
              messages: finalMsgs
            }
          })

          formattedConvos.sort((a, b) => b.lastTime - a.lastTime)
          setConversations(formattedConvos)

          setSelectedConversation((prev: any) => {
            if (!prev && formattedConvos.length > 0) return formattedConvos[0]
            if (prev) return formattedConvos.find(c => c.id === prev.id) || formattedConvos[0]
            return null
          })

          setIsLoading(false)
        })
      } catch (error) {
        console.error("Error setting up chat monitor:", error)
        setIsLoading(false)
      }
    }

    initializeChatMonitor()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const formatTime = (ts: number) => {
    if (!ts) return ""
    const date = new Date(ts)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const renderMessageContent = (text: string, isRightSide: boolean) => {
    if (!text) return null

    if (text.startsWith('[Image]')) {
      const url = text.replace('[Image]', '').trim()
      return url ? (
        <div className="mt-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={url} alt="Shared Media" className="max-w-[250px] rounded-lg shadow-sm border border-gray-200 object-cover" />
          </a>
        </div>
      ) : (
        <span className={`italic flex items-center gap-1 ${isRightSide ? 'text-rose-100' : 'text-gray-500'}`}>
          <ImageIcon size={16} /> Image attached
        </span>
      )
    }

    if (text.startsWith('[Video]')) {
      const url = text.replace('[Video]', '').trim()
      return url ? (
        <div className="mt-2">
          <video controls className="max-w-[250px] rounded-lg shadow-sm border border-gray-200 bg-black">
            <source src={url} />
          </video>
        </div>
      ) : (
        <span className={`italic flex items-center gap-1 ${isRightSide ? 'text-rose-100' : 'text-gray-500'}`}>
          <Film size={16} /> Video attached
        </span>
      )
    }

    if (text.startsWith('[Document]')) {
      const content = text.replace('[Document]', '').trim()
      const urlMatch = content.match(/https?:\/\/[^\s]+/)
      const url = urlMatch ? urlMatch[0] : null
      const filename = url ? content.replace(url, '').trim() : content
      return (
        <a href={url || '#'} target="_blank" rel="noopener noreferrer"
          className={`flex items-center gap-2 mt-2 p-3 rounded-lg border transition ${
            isRightSide ? 'bg-[#a35d67] border-[#8E4F5A] text-white' : 'bg-gray-50 border-gray-200 text-[#8E4F5A]'
          }`}>
          <FileText size={20} className="shrink-0" />
          <span className="text-sm font-medium underline truncate max-w-[200px]">
            {filename || 'Download Document'}
          </span>
        </a>
      )
    }

    return <span>{text}</span>
  }

  const filtered = conversations.filter((conv) => {
    const matchSearch = conv.participants.some((p: string) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchReported = filterReported === 'all' || (filterReported === 'reported' ? conv.reported : !conv.reported)
    return matchSearch && matchReported
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Messages Monitoring</h1>
        <p className="text-gray-500 mt-1">Live, privacy-friendly chat monitoring. View active & reported chats.</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input type="text" placeholder="Search conversations by name..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-[264px]" />
        
        <select aria-label="Filter Reported Chats" title="Filter Reported Chats" value={filterReported}
          onChange={(e) => setFilterReported(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-medium">
          <option value="all">All Chats</option>
          <option value="reported">Reported Chats</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-[#B76E79] font-bold animate-pulse">Loading Live Chats...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No active conversations found.</div>
            ) : (
              filtered.map((conv) => (
                <button key={conv.id} onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                    selectedConversation?.id === conv.id ? 'bg-rose-50 border-l-4 border-l-[#B76E79]' : 'border-l-4 border-l-transparent'
                  }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{conv.participants.join(' & ')}</p>
                      <p className="text-gray-600 text-sm mt-1 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.reported && <AlertCircle size={18} className="text-red-500 flex-shrink-0" />}
                  </div>
                  <p className="text-gray-400 text-xs mt-2 font-medium">{formatTime(conv.lastTime)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column Monitor View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col border border-gray-200 h-[600px]">
          {selectedConversation ? (
            <>
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{selectedConversation.participants.join(' & ')}</h2>
                  <MessageCircle size={28} className="text-[#B76E79] opacity-20" />
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/50">
                {selectedConversation.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.isRightSide ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-5 py-3 rounded-2xl shadow-sm ${
                      msg.isRightSide ? 'bg-[#B76E79] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
                    }`}>
                      <p className={`text-xs font-bold mb-1 ${msg.isRightSide ? 'text-rose-200' : 'text-[#B76E79]'}`}>
                        {msg.senderName} ({msg.roleLabel})
                      </p>
                      <div className={`text-sm leading-relaxed ${msg.isRightSide ? 'text-white' : 'text-gray-800'}`}>
                        {renderMessageContent(msg.message, msg.isRightSide)}
                      </div>
                      <p className={`text-right text-[10px] mt-2 font-medium ${msg.isRightSide ? 'text-rose-200' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Read-only Administrative Monitoring</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <MessageCircle size={48} className="mb-4 opacity-20" />
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}