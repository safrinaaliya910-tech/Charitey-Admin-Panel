'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, User, Settings, LayoutDashboard, Users, FileText, Gift, Users2, MessageSquare, AlertCircle, Bell, BookOpen, Truck } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users Management', href: '/admin/users', icon: Users },
  { name: 'Posts/Requests', href: '/admin/posts', icon: FileText },
  { name: 'Donations', href: '/admin/donations', icon: Gift },
  { name: 'Volunteers', href: '/admin/volunteers', icon: Users2 },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Reports', href: '/admin/reports', icon: AlertCircle },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: BookOpen },
  { name: 'Travel Agencies', href: '/admin/travel-agencies', icon: Truck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-[#8E4F5A] to-[#B76E79] text-white transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-[#D9A5AD]/30">
          {sidebarOpen && <h1 className="text-xl font-bold">Charitey Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-700 rounded transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-white/20 shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <IconComponent size={20} className="flex-shrink-0" strokeWidth={1.5} />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#D9A5AD]/30 p-4">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-white/10 transition">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79] w-64"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <User size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
