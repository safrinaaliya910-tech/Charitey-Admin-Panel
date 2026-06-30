'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { auth, db, app } from '@/lib/firebase' // Make sure app is exported from firebase.ts
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  signOut,
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function AdminSettings() {
  const router = useRouter()
  
  // Profile States
  const [adminEmail, setAdminEmail] = useState<string>('Loading...')
  const [adminName, setAdminName] = useState<string>('Loading...')

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

  // Fetch current logged-in admin email AND name on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        setAdminEmail(user.email)
        
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
      console.error(error)
      setPassError(error.message || "Failed to update password. Check your current password.")
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
      // Create secondary Firebase instance to prevent logging current admin out
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

    } catch (error: any) {
      console.error(error)
      setAdminError(error.message || "Failed to create new admin.")
    } finally {
      setAdminLoading(false)
    }
  }

  // 3. Logout Logic
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage admin access, security, and your session.</p>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Current Account</h2>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#B76E79] to-[#8E4F5A] rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase tracking-wider">
            {adminName !== 'Loading...' && adminName !== 'Administrator' ? adminName.substring(0, 2) : 'AD'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 capitalize">{adminName}</h3>
            <p className="text-gray-600 font-medium">{adminEmail}</p>
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
                placeholder="Enter current password"
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
                placeholder="Enter new password (min. 6 characters)"
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
                placeholder="Confirm new password"
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

      {/* Add New Admin */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-[#8E4F5A]" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Add New Administrator</h2>
        </div>
        
        <form onSubmit={handleAddAdmin} className="space-y-4">
          {adminError && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium"><AlertCircle size={16}/> {adminError}</div>}
          {adminSuccess && <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm font-medium"><CheckCircle2 size={16}/> {adminSuccess}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <button type="submit" disabled={adminLoading} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition font-medium disabled:opacity-50">
              {adminLoading ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
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
  )
}