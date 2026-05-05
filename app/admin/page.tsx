'use client'

import { TrendingUp, Building2, Clock, Users, FileText, Clock3, CheckCircle2, CheckCircle, Users2, AlertTriangle, Ban, Gift, PlusCircle } from 'lucide-react'

const stats = [
  { label: 'Total NGOs', value: '234', icon: Building2, color: 'bg-rose-100', textColor: 'text-[#8E4F5A]', iconColor: 'text-[#8E4F5A]' },
  { label: 'Pending Approvals', value: '12', icon: Clock, color: 'bg-orange-100', textColor: 'text-orange-600', iconColor: 'text-orange-600' },
  { label: 'Total Donors', value: '1,250', icon: Users, color: 'bg-blue-100', textColor: 'text-blue-600', iconColor: 'text-blue-600' },
  { label: 'Total Requests', value: '89', icon: FileText, color: 'bg-rose-100', textColor: 'text-[#8E4F5A]', iconColor: 'text-[#8E4F5A]' },
  { label: 'Pending Donations', value: '45', icon: Clock3, color: 'bg-yellow-100', textColor: 'text-yellow-700', iconColor: 'text-yellow-700' },
  { label: 'Confirmed Donations', value: '234', icon: CheckCircle2, color: 'bg-blue-100', textColor: 'text-blue-600', iconColor: 'text-blue-600' },
  { label: 'Completed Donations', value: '567', icon: CheckCircle, color: 'bg-emerald-100', textColor: 'text-emerald-600', iconColor: 'text-emerald-600' },
  { label: 'Volunteer Available', value: '78', icon: Users2, color: 'bg-indigo-100', textColor: 'text-indigo-600', iconColor: 'text-indigo-600' },
  { label: 'Reports Pending', value: '8', icon: AlertTriangle, color: 'bg-red-100', textColor: 'text-red-600', iconColor: 'text-red-600' },
  { label: 'Blocked Users', value: '3', icon: Ban, color: 'bg-red-100', textColor: 'text-red-600', iconColor: 'text-red-600' },
]

const recentActivity = [
  { type: 'donation', message: 'New donation: 50 Food Packets from John Smith to Help Hearts NGO', time: '2 minutes ago' },
  { type: 'ngo', message: 'Clean Water Initiative submitted request for 200 Water Filter Kits', time: '15 minutes ago' },
  { type: 'volunteer', message: 'Maria Garcia joined as volunteer for Education for All', time: '1 hour ago' },
  { type: 'approval', message: 'NGO "Medical Aid Foundation" approved', time: '3 hours ago' },
  { type: 'block', message: 'User "John Doe" blocked due to reported violation', time: '5 hours ago' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Charitey Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's your admin overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent size={24} className={stat.iconColor} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-green-600 text-sm">
                <TrendingUp size={16} strokeWidth={1.5} />
                <span>+12% from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Activity Timeline</h2>
          <p className="text-gray-500 text-sm mt-1">Recent platform events and admin actions</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {recentActivity.map((activity, idx) => {
              const getIcon = () => {
                switch (activity.type) {
                  case 'donation': return <Gift size={20} className="text-[#B76E79]" strokeWidth={1.5} />
                  case 'ngo': return <FileText size={20} className="text-[#8E4F5A]" strokeWidth={1.5} />
                  case 'volunteer': return <Users size={20} className="text-purple-600" strokeWidth={1.5} />
                  case 'approval': return <CheckCircle2 size={20} className="text-green-600" strokeWidth={1.5} />
                  default: return <AlertTriangle size={20} className="text-red-600" strokeWidth={1.5} />
                }
              }
              return (
                <div key={idx} className="flex gap-4">
                  {/* Timeline marker */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcon()}
                    </div>
                    {idx !== recentActivity.length - 1 && <div className="w-1 h-12 bg-gray-200 mt-2" />}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
