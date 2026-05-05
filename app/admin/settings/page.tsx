'use client'

import { useState } from 'react'
import { LogOut, Lock, Moon, Bell, Eye } from 'lucide-react'

export default function AdminSettings() {
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [activityFeed, setActivityFeed] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Charitey Admin Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin profile and preferences</p>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>

        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-br from-[#B76E79] to-[#8E4F5A] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            AD
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Admin User</h3>
            <p className="text-gray-600">admin@charitey.app</p>
            <p className="text-gray-500 text-sm mt-1">
              <span className="inline-block px-2 py-1 bg-rose-100 text-[#8E4F5A] rounded text-xs font-semibold">
                Administrator
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value="admin@charitey.app"
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              value="Admin User"
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">App Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Admin Dashboard Version</label>
            <p className="text-lg font-semibold text-gray-900">v1.0.0</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
            <p className="text-lg font-semibold text-gray-900">January 2024</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Database Backend</label>
            <p className="text-lg font-semibold text-gray-900">Firebase Firestore</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Environment</label>
            <p className="text-lg font-semibold text-gray-900">Production</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Enable dark theme for the dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                darkMode ? 'bg-[#B76E79]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email alerts for important actions</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                emailNotifications ? 'bg-[#B76E79]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Activity Feed</p>
                <p className="text-sm text-gray-600">Show recent activity on dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setActivityFeed(!activityFeed)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                activityFeed ? 'bg-[#B76E79]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  activityFeed ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>

        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#8E4F5A] transition font-medium"
        >
          <Lock size={18} />
          Change Password
        </button>

        {showPasswordForm && (
          <div className="mt-6 space-y-4 p-4 bg-rose-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#8E4F5A] transition font-medium">
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-900 mb-4">Logout</h2>
        <p className="text-red-800 mb-6">This will end your admin session. Make sure to save any pending changes first.</p>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
          <LogOut size={18} />
          Logout Now
        </button>
      </div>
    </div>
  )
}
