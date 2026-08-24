'use client'

import { useEffect, useState } from 'react'
import { 
  Eye, Trash2, Unlock, AlertTriangle, CheckCircle2, 
  Loader2, X, Search 
} from 'lucide-react'
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase' // ← make sure this path is correct

interface Notification {
  id: string
  receiverId: string
  senderId: string
  senderName: string
  type: string
  title: string
  message: string
  relatedItemId: string
  createdAt: Date
  isRead: boolean
}

interface DonationDetails {
  donorId: string
  donorName: string
  donorPhone: string
  assignedVolunteerId: string
  paymentReference?: string
  deliveryFee?: number
  status: string
  itemName?: string
}

interface VolunteerDetails {
  name: string
  phone: string
  upiId?: string
}

const typeColors: Record<string, string> = {
  payment_dispute: 'bg-orange-100 text-orange-800',
  payment_verified: 'bg-emerald-100 text-emerald-800',
  payment_rejected: 'bg-red-100 text-red-800',
  new_message: 'bg-blue-100 text-blue-800',
  volunteer_accepted: 'bg-green-100 text-green-800',
  volunteer_expired: 'bg-yellow-100 text-yellow-800',
  donation: 'bg-pink-100 text-pink-800',
  system: 'bg-purple-100 text-purple-800',
  warning: 'bg-red-100 text-red-800',
}

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRead, setFilterRead] = useState('all')
  const [unlockingId, setUnlockingId] = useState<string | null>(null)
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)

  const [donationCache, setDonationCache] = useState<Record<string, DonationDetails>>({})
  const [volunteerCache, setVolunteerCache] = useState<Record<string, VolunteerDetails>>({})

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Notification[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          receiverId: data.receiverId || '',
          senderId: data.senderId || '',
          senderName: data.senderName || 'Unknown',
          type: data.type || 'system',
          title: data.title || '',
          message: data.message || '',
          relatedItemId: data.relatedItemId || '',
          createdAt: data.createdAt?.toDate?.() || new Date(),
          isRead: data.isRead ?? false,
        }
      })
      setNotifications(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadDisputeDetails = async (donationId: string, volunteerId: string) => {
    try {
      if (!donationCache[donationId]) {
        const donSnap = await getDoc(doc(db, 'donations', donationId))
        if (donSnap.exists()) {
          const d = donSnap.data()
          setDonationCache((prev) => ({
            ...prev,
            [donationId]: {
              donorId: d.donorId || '',
              donorName: d.donorName || 'Unknown Donor',
              donorPhone: d.donorPhone || '',
              assignedVolunteerId: d.assignedVolunteerId || volunteerId,
              paymentReference: d.paymentReference || 'Not provided',
              deliveryFee: d.deliveryFee,
              status: d.status || '',
              itemName: d.items || d.itemName || 'Delivery Item',
            },
          }))
        }
      }

      if (!volunteerCache[volunteerId]) {
        const volSnap = await getDoc(doc(db, 'users', volunteerId))
        if (volSnap.exists()) {
          const v = volSnap.data()
          setVolunteerCache((prev) => ({
            ...prev,
            [volunteerId]: {
              name: v.name || 'Volunteer',
              phone: v.phone || '',
              upiId: v.upiId || '',
            },
          }))
        }
      }
    } catch (err) {
      console.error('Error loading details:', err)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true })
    } catch (err) {
      console.error(err)
    }
  }

  const deleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    try {
      await deleteDoc(doc(db, 'notifications', id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete notification')
    }
  }

  const unlockDonorPhone = async (notif: Notification) => {
    if (!notif.relatedItemId) return
    if (!confirm('Unlock the donor phone? This will mark the payment as completed.')) return

    setUnlockingId(notif.id)
    try {
      await updateDoc(doc(db, 'donations', notif.relatedItemId), {
        status: 'fully_completed',
        paymentStatus: 'paid',
        unlockedByAdmin: true,
        unlockedAt: Timestamp.now(),
      })

      await updateDoc(doc(db, 'notifications', notif.id), { isRead: true })
      alert('Donor phone unlocked successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to unlock. Please try again.')
    } finally {
      setUnlockingId(null)
    }
  }

  const openDetails = async (notif: Notification) => {
    setSelectedNotif(notif)
    if (!notif.isRead) markAsRead(notif.id)

    if (notif.type === 'payment_dispute' && notif.relatedItemId) {
      await loadDisputeDetails(notif.relatedItemId, notif.senderId)
    }
  }

  // Filtering logic
  const filtered = notifications.filter((notif) => {
    const search = searchTerm.toLowerCase()
    const matchSearch =
      notif.senderName.toLowerCase().includes(search) ||
      notif.title.toLowerCase().includes(search) ||
      notif.message.toLowerCase().includes(search)

    const matchType = filterType === 'all' || notif.type === filterType
    const matchRead =
      filterRead === 'all' ||
      (filterRead === 'unread' ? !notif.isRead : notif.isRead)

    return matchSearch && matchType && matchRead
  })

  // Put payment disputes at the top
  const sorted = [...filtered].sort((a, b) => {
    if (a.type === 'payment_dispute' && b.type !== 'payment_dispute') return -1
    if (a.type !== 'payment_dispute' && b.type === 'payment_dispute') return 1
    return 0
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#B76E79]" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
        <p className="text-gray-500 mt-1">
          Total: {notifications.length} notifications
          {notifications.filter((n) => n.type === 'payment_dispute' && !n.isRead).length > 0 && (
            <span className="ml-3 text-orange-600 font-semibold">
              • {notifications.filter((n) => n.type === 'payment_dispute' && !n.isRead).length} Payment Dispute(s) pending
            </span>
          )}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by sender, title or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Types</option>
          <option value="payment_dispute">Payment Dispute</option>
          <option value="new_message">New Message</option>
          <option value="volunteer_accepted">Volunteer Accepted</option>
          <option value="volunteer_expired">Volunteer Expired</option>
          <option value="payment_verified">Payment Verified</option>
          <option value="system">System</option>
        </select>

        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {sorted.map((notif) => {
          const isDispute = notif.type === 'payment_dispute'
          const donation = donationCache[notif.relatedItemId]
          const volunteer = volunteerCache[notif.senderId]

          return (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition ${
                isDispute
                  ? 'bg-orange-50 border-orange-300 shadow-sm'
                  : notif.isRead
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        typeColors[notif.type] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {notif.type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    {!notif.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{notif.message}</p>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>
                      <span className="font-medium">From:</span> {notif.senderName}
                    </span>
                    <span>{notif.createdAt.toLocaleString()}</span>
                  </div>

                  {/* Dispute details (always expanded for disputes) */}
                  {isDispute && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-3 text-orange-700 font-semibold">
                        <AlertTriangle size={18} />
                        Payment Dispute – Action Required
                      </div>

                      {donation ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Donor</p>
                            <p className="font-medium">{donation.donorName}</p>
                            <p className="text-gray-600">{donation.donorPhone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Volunteer</p>
                            <p className="font-medium">{volunteer?.name || notif.senderName}</p>
                            <p className="text-gray-600">{volunteer?.phone || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Reference ID</p>
                            <p className="font-mono font-bold text-orange-700 text-base">
                              {donation.paymentReference}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Amount</p>
                            <p className="font-medium">
                              ₹{donation.deliveryFee?.toFixed(0) || '—'}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-gray-500 text-xs">Donation ID</p>
                            <p className="font-mono text-xs">{notif.relatedItemId}</p>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => loadDisputeDetails(notif.relatedItemId, notif.senderId)}
                          className="text-sm text-orange-600 underline"
                        >
                          Load full details
                        </button>
                      )}

                      {donation?.status === 'admin_verification_pending' && (
                        <div className="mt-4">
                          <button
                            onClick={() => unlockDonorPhone(notif)}
                            disabled={unlockingId === notif.id}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-60"
                          >
                            {unlockingId === notif.id ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Unlocking...
                              </>
                            ) : (
                              <>
                                <Unlock size={16} />
                                Unlock Donor Phone
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {donation?.status === 'fully_completed' && (
                        <div className="mt-3 flex items-center gap-2 text-green-700 font-medium">
                          <CheckCircle2 size={18} />
                          Already unlocked
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openDetails(notif)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
                    title="View details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No notifications found</p>
        </div>
      )}

      <div className="text-sm text-gray-500 border-t pt-4">
        Showing {sorted.length} of {notifications.length} notifications
      </div>

      {/* Details Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{selectedNotif.title}</h2>
              <button
                onClick={() => setSelectedNotif(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    typeColors[selectedNotif.type] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedNotif.type.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 whitespace-pre-line">{selectedNotif.message}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">From</p>
                  <p className="font-medium">{selectedNotif.senderName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="font-medium">{selectedNotif.createdAt.toLocaleString()}</p>
                </div>
                {selectedNotif.relatedItemId && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Related ID</p>
                    <p className="font-mono text-xs">{selectedNotif.relatedItemId}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  deleteNotification(selectedNotif.id)
                  setSelectedNotif(null)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}