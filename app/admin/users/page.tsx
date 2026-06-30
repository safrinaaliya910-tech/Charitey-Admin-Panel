'use client'

import { useState, useEffect } from 'react'
import { Eye, Trash2, Download, Ban, RotateCcw, CheckCircle } from 'lucide-react'
import Modal from '@/components/admin/Modal'
import ConfirmationDialog from '@/components/admin/ConfirmationDialog'
import { exportUsersCSV } from '@/lib/admin/csv-export'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from "@/lib/firebase"; 
import { logAdminAction } from '@/lib/firebase';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  active: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function UsersManagement() {
  const [usersList, setUsersList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string>('')
  const [userToActOn, setUserToActOn] = useState<any>(null)

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: data.name || data.username || data.userName || 'Unknown User',
          email: data.email || 'No email',
          phone: data.phone || 'No phone',
          role: (data.role || 'donor').toLowerCase(),
          // The logic that defaults missing statuses to pending/active
          status: (data.status || (data.role?.toLowerCase() === 'ngo' ? 'pending' : 'active')).toLowerCase(),
          joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Unknown Date',
          // 👇 NEW: Exactly matching your Firebase fields 👇
          license: data.license || 'Not provided',
          location: data.location || 'Not provided',
        }
      });
      setUsersList(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleActionClick = (user: any, action: string) => {
    setUserToActOn(user);
    setConfirmAction(action);
    setShowConfirm(true);
  }

  // INSIDE executeAction:
const executeAction = async () => {
  if (!userToActOn) return;
  
  let newStatus = '';
  if (confirmAction === 'approve') newStatus = 'approved';
  if (confirmAction === 'reject') newStatus = 'rejected';
  if (confirmAction === 'block') newStatus = 'blocked';
  if (confirmAction === 'unblock') {
    newStatus = userToActOn.role === 'ngo' ? 'approved' : 'active'; 
  }

  try {
    const userRef = doc(db, 'users', userToActOn.id);
    await updateDoc(userRef, { status: newStatus });
    
    // ADD THIS LOG
    await logAdminAction(
      "Admin User", 
      `${confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)} User`, 
      `Changed status of ${userToActOn.name} to ${newStatus}`
    );
    
    setUsersList(prev => prev.map(u => 
      u.id === userToActOn.id ? { ...u, status: newStatus } : u
    ));
  } catch (error) {
    console.error("Error updating user status:", error);
  } finally {
    setShowConfirm(false);
    setUserToActOn(null);
  }
}

  const filtered = usersList.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = filterRole === 'all' || user.role === filterRole.toLowerCase()
    const matchStatus = filterStatus === 'all' || user.status === filterStatus.toLowerCase()
    return matchSearch && matchRole && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2B1B1F]">Users Management</h1>
          <p className="text-gray-500 mt-1">NGOs, Donors, and Volunteers • Total: {usersList.length} users</p>
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

      

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select
  aria-label="Filter by Role"
  title="Filter by Role"
  value={filterRole}
  onChange={(e) => setFilterRole(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
>
  <option value="all">All Roles</option>
  <option value="ngo">NGO</option>
  <option value="donor">Donor</option>
  <option value="volunteer">Volunteer</option>
</select>

<select
  aria-label="Filter by Status"
  title="Filter by Status"
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
              {isLoading ? (
                 <tr><td colSpan={7} className="px-6 py-8 text-center text-[#8E4F5A] font-bold animate-pulse">Loading users from database...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status as keyof typeof statusColors] || statusColors.active}`}>
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

                        {user.role === 'ngo' && user.status === 'pending' && (
                          <>
                            <button onClick={() => handleActionClick(user, 'approve')} className="p-2 hover:bg-green-100 rounded transition text-green-600" title="Approve NGO">
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => handleActionClick(user, 'reject')} className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Reject NGO">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}

                        {(user.status === 'approved' || user.status === 'active') && user.role !== 'admin' && (
                          <button onClick={() => handleActionClick(user, 'block')} className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Block User">
                            <Ban size={18} />
                          </button>
                        )}

                        {(user.status === 'blocked' || user.status === 'rejected') && (
                          <button onClick={() => handleActionClick(user, 'unblock')} className="p-2 hover:bg-blue-100 rounded transition text-blue-600" title="Unblock User">
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && (
          <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
            Showing 1-{filtered.length} of {usersList.length} users
          </div>
        )}
      </div>

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
                <p className="text-gray-900 capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedUser.status as keyof typeof statusColors] || statusColors.active}`}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Joined</p>
                <p className="text-gray-900">{selectedUser.joined}</p>
              </div>
              
              {/* 👇 FIXED: Now looks specifically for 'license' 👇 */}
              {selectedUser.role === 'ngo' && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">License / Registration ID</p>
                  <p className="text-gray-900 font-semibold text-[#B76E79]">{selectedUser.license}</p>
                </div>
              )}
            </div>
            
            {/* 👇 FIXED: Now looks specifically for 'location' 👇 */}
            {selectedUser.role === 'ngo' && (
              <>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900">{selectedUser.location}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setUserToActOn(null);
        }}
        onConfirm={executeAction}
        title="Confirm Action"
        message={`Are you sure you want to ${confirmAction} ${userToActOn?.name}?`}
        confirmText={confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
        isDangerous={confirmAction === 'block' || confirmAction === 'reject'}
      />
    </div>
  )
}