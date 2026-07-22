'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Lock, UserPlus, AlertCircle, CheckCircle2, ShieldAlert, UserMinus } from 'lucide-react'
import { auth, db, app } from '@/lib/firebase' 
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  signOut,
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from 'firebase/firestore'

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export default function AdminSettings() {
  const router = useRouter()
  
  // Profile States
  const [adminEmail, setAdminEmail] = useState<string>('Loading...')
  const [adminName, setAdminName] = useState<string>('Loading...')
  const [currentUid, setCurrentUid] = useState<string>('')

  // Admin List States
  const [adminsList, setAdminsList] = useState<AdminUser[]>([])
  const [fetchingAdmins, setFetchingAdmins] = useState(true)

  // Security States
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState('')

  // Add Admin States
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')

  // Fetch Admins Function
  const fetchAdmins = async () => {
    setFetchingAdmins(true)
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'admin'))
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unknown',
        email: doc.data().email || 'No email'
      }))
      setAdminsList(list)
    } catch (error) {
      console.error("Error fetching admins:", error)
    } finally {
      setFetchingAdmins(false)
    }
  }

  // Fetch current logged-in admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        setAdminEmail(user.email)
        setCurrentUid(user.uid)
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists() && userDoc.data().name) {
            setAdminName(userDoc.data().name)
          } else {
            setAdminName('Administrator')
          }
        } catch (error) {
          console.error("Error fetching name:", error)
          setAdminName('Administrator')
        }
      }
    })
    
    fetchAdmins() // Fetch the list of all admins

    return () => unsubscribe()
  }, [])

  // 1. Change Password Logic
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')
    setPassLoading(true)

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.")
      setPassLoading(false)
      return
    }

    try {
      const user = auth.currentUser
      if (!user || !user.email) throw new Error("No admin is currently logged in.")

      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      
      setPassSuccess("Password updated successfully!")
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => { setShowPasswordForm(false); setPassSuccess(''); }, 3000)

    } catch (error: any) {
      setPassError(error.message || "Failed to update password.")
    } finally {
      setPassLoading(false)
    }
  }

  // 2. Add New Admin Logic
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminError('')
    setAdminSuccess('')
    setAdminLoading(true)

    try {
      const secondaryApp = getApps().find(a => a.name === 'SecondaryApp') || initializeApp(app.options, 'SecondaryApp')
      const secondaryAuth = getAuth(secondaryApp)

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newAdminEmail, newAdminPassword)
      const newAdminUid = userCredential.user.uid

      await setDoc(doc(db, 'users', newAdminUid), {
        name: newAdminName,
        email: newAdminEmail,
        role: 'admin',
        status: 'active',
        createdAt: serverTimestamp(),
      })

      await secondaryAuth.signOut()

      setAdminSuccess(`Successfully created admin account for ${newAdminName}!`)
      setNewAdminName('')
      setNewAdminEmail('')
      setNewAdminPassword('')
      
      fetchAdmins() // Refresh the list

    } catch (error: any) {
      setAdminError(error.message || "Failed to create new admin.")
    } finally {
      setAdminLoading(false)
    }
  }

  // 3. Remove Admin Logic
  const handleRemoveAdmin = async (adminId: string, adminName: string) => {
    if (adminId === currentUid) {
      alert("Action Denied: You cannot remove your own admin privileges while logged in.")
      return
    }

    const confirmDelete = window.confirm(`Are you sure you want to revoke admin access for ${adminName}? They will become a regular user.`)
    if (!confirmDelete) return

    try {
      await updateDoc(doc(db, 'users', adminId), {
        role: 'user' // Downgrade them to a normal user to revoke panel access
      })
      alert(`Admin access revoked for ${adminName}.`)
      fetchAdmins() // Refresh the list
    } catch (error) {
      console.error("Error removing admin:", error)
      alert("Failed to remove admin. Check console for details.")
    }
  }

  // 4. Logout Logic
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage admin access, security, and your session.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          
          {/* Account Section */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Account</h2>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B76E79] to-[#8E4F5A] rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase tracking-wider shrink-0">
                {adminName !== 'Loading...' && adminName !== 'Administrator' ? adminName.substring(0, 2) : 'AD'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 capitalize truncate">{adminName}</h3>
                <p className="text-gray-600 font-medium truncate">{adminEmail}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-rose-100 text-[#8E4F5A] rounded text-xs font-bold uppercase tracking-wide">
                  Active Session
                </span>
              </div>
            </div>
          </div>

          {/* Security / Change Password */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#B76E79] text-white rounded-lg hover:bg-[#8E4F5A] transition font-medium"
              >
                <Lock size={18} />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 p-5 bg-rose-50/50 border border-rose-100 rounded-lg">
                {passError && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium"><AlertCircle size={16}/> {passError}</div>}
                {passSuccess && <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm font-medium"><CheckCircle2 size={16}/> {passSuccess}</div>}
                
                <div>
                  <label htmlFor="currentPass" className="block text-sm font-medium text-gray-900 mb-1">Current Password</label>
                  <input
                    id="currentPass"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-black"
                  />
                </div>
                <div>
                  <label htmlFor="newPass" className="block text-sm font-medium text-gray-900 mb-1">New Password</label>
                  <input
                    id="newPass"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-black"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-900 mb-1">Confirm New Password</label>
                  <input
                    id="confirmPass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-black"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={passLoading} className="px-5 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#8E4F5A] transition font-medium disabled:opacity-50">
                    {passLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button type="button" onClick={() => { setShowPasswordForm(false); setPassError(''); }} className="px-5 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Logout */}
          <div className="bg-red-50 rounded-lg border border-red-200 p-6 flex flex-col items-start">
            <h2 className="text-xl font-bold text-red-900 mb-2">Sign Out</h2>
            <p className="text-red-800 mb-5">This will end your current administrative session securely.</p>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold tracking-wide"
            >
              <LogOut size={18} />
              Logout Now
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* Active Administrators List */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="text-[#8E4F5A]" size={24} />
                Active Admins
              </h2>
              <span className="bg-[#8E4F5A] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                Total: {adminsList.length}
              </span>
            </div>

            {fetchingAdmins ? (
              <div className="text-center py-4 text-gray-500">Loading administrators...</div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {adminsList.map(admin => (
                  <div key={admin.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-[#D9A5AD] transition">
                    <div className="overflow-hidden pr-3">
                      <p className="font-bold text-gray-900 truncate">{admin.name}</p>
                      <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                    </div>
                    {admin.id !== currentUid && (
                      <button 
                        onClick={() => handleRemoveAdmin(admin.id, admin.name)}
                        title="Revoke Admin Access"
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Admin Form */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-[#8E4F5A]" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Add New Admin</h2>
            </div>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              {adminError && <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium"><AlertCircle size={16} className="shrink-0 mt-0.5"/> <span>{adminError}</span></div>}
              {adminSuccess && <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm font-medium"><CheckCircle2 size={16}/> {adminSuccess}</div>}

              <div>
                <label htmlFor="adminName" className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                <input
                  id="adminName"
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="E.g., John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-black"
                />
              </div>
              
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-900 mb-1">Email Address</label>
                <input
                  id="adminEmail"
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@charitey.app"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-black"
                />
              </div>
              
              <div>
                <label htmlFor="adminPass" className="block text-sm font-medium text-gray-900 mb-1">Temporary Password</label>
                <input
                  id="adminPass"
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Assign a secure password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-black"
                />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={adminLoading} className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition font-medium disabled:opacity-50">
                  {adminLoading ? 'Creating Admin...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}