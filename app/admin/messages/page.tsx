'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, AlertCircle } from 'lucide-react'
import { collection, collectionGroup, getDocs, onSnapshot, query } from 'firebase/firestore'
import { auth, db } from "@/lib/firebase";

export default function MessagesMonitoring() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterReported, setFilterReported] = useState('all')
  
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: any = null;

    const initializeChatMonitor = async () => {
      try {
        // 1. Fetch all users for our primary Name Dictionary
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersMap: Record<string, any> = {};
        usersSnap.docs.forEach(doc => {
          usersMap[doc.id] = doc.data();
        });

        // 2. Fetch all chats for our backup Name Dictionary
        const chatsSnap = await getDocs(collection(db, 'chats'));
        const chatsMap: Record<string, any> = {};
        chatsSnap.docs.forEach(doc => {
          chatsMap[doc.id] = doc.data();
        });

        // 3. Listen to ALL messages everywhere in real-time
        const q = query(collectionGroup(db, 'messages'));

        unsubscribe = onSnapshot(q, (snapshot) => {
          const allMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              chatId: doc.ref.parent.parent?.id || 'unknown',
              message: data.message || data.text || '',
              senderId: data.senderId,
              receiverId: data.receiverId,
              timestamp: data.timestamp ? data.timestamp.toMillis() : 0,
            }
          });

          // Sort messages globally by time
          allMessages.sort((a, b) => a.timestamp - b.timestamp);

          // 4. Group messages into their Conversations
          const chatGroups: Record<string, any[]> = {};
          allMessages.forEach(msg => {
            if (!chatGroups[msg.chatId]) chatGroups[msg.chatId] = [];
            chatGroups[msg.chatId].push(msg);
          });

          // 5. Format the final UI list with Bulletproof Name Lookups
          const formattedConvos = Object.keys(chatGroups).map(chatId => {
            const msgs = chatGroups[chatId];
            const lastMsg = msgs[msgs.length - 1];
            const chatDoc = chatsMap[chatId] || {}; // Backup data!

            // 🛡️ THE FIX: A super smart function to find the real name no matter what
            const getRealName = (uid: string) => {
               if (usersMap[uid]) {
                  // Check all possible fields your app might use
                  return usersMap[uid].name || usersMap[uid].ngoName || usersMap[uid].displayName;
               }
               // Fallback: Check if the chat document saved their name
               if (uid === chatDoc.donorId) return chatDoc.donorName;
               if (uid === chatDoc.ngoId) return chatDoc.ngoName;
               
               return 'Unknown User'; // Absolute last resort
            };

            const senderName = getRealName(lastMsg.senderId);
            const receiverName = getRealName(lastMsg.receiverId);

            // Safer way to figure out who is the NGO for coloring the bubbles
            const ngoId = chatDoc.ngoId || chatId.split('_')[1];

            const finalMsgs = msgs.map(m => ({
              ...m,
              senderName: getRealName(m.senderId),
              isNgo: m.senderId === ngoId || usersMap[m.senderId]?.role === 'ngo'
            }));

            return {
              id: chatId,
              participants: [senderName, receiverName],
              lastMessage: lastMsg.message,
              lastTime: lastMsg.timestamp,
              reported: chatDoc.isReported || false,
              messages: finalMsgs
            }
          });

          // Sort conversations (Newest at top)
          formattedConvos.sort((a, b) => b.lastTime - a.lastTime);
          
          setConversations(formattedConvos);
          
          setSelectedConversation((prev: any) => {
            if (!prev && formattedConvos.length > 0) return formattedConvos[0];
            if (prev) return formattedConvos.find(c => c.id === prev.id) || formattedConvos[0];
            return null;
          });
          
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error setting up chat monitor:", error);
        setIsLoading(false);
      }
    };

    initializeChatMonitor();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const formatTime = (ts: number) => {
    if (!ts) return '';
    const date = new Date(ts);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
        <p className="text-gray-500 mt-1">Live, privacy-friendly chat monitoring - View active & reported chats</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search conversations by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
  aria-label="Filter Reported Chats"
  title="Filter Reported Chats"
  value={filterReported}
  onChange={(e) => setFilterReported(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-medium"
>
          <option value="all">All Chats</option>
          <option value="reported">Reported Chats</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
               <div className="p-8 text-center text-[#B76E79] font-bold animate-pulse">Loading Live Chats...</div>
            ) : filtered.length === 0 ? (
               <div className="p-8 text-center text-gray-500">No active conversations found.</div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                    selectedConversation?.id === conv.id ? 'bg-rose-50 border-l-4 border-l-[#B76E79]' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {conv.participants.join(' & ')}
                      </p>
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

        {/* Right Column */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col border border-gray-200 h-[600px]">
          {selectedConversation ? (
            <>
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedConversation.participants.join(' & ')}
                    </h2>
                  </div>
                  <MessageCircle size={28} className="text-[#B76E79] opacity-20" />
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/50">
                {selectedConversation.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.isNgo ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-5 py-3 rounded-2xl shadow-sm ${
                        msg.isNgo
                          ? 'bg-[#B76E79] text-white rounded-tr-none'
                          : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
                      }`}
                    >
                      <p className={`text-xs font-bold mb-1 ${msg.isNgo ? 'text-rose-200' : 'text-[#B76E79]'}`}>
                        {msg.senderName} {msg.isNgo ? '(NGO)' : '(Donor)'}
                      </p>
                      <p className={`text-sm leading-relaxed ${msg.isNgo ? 'text-white' : 'text-gray-800'}`}>
                        {msg.message}
                      </p>
                      <p className={`text-right text-[10px] mt-2 font-medium ${msg.isNgo ? 'text-rose-200' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">🛡️ Read-only Administrative Monitoring</p>
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