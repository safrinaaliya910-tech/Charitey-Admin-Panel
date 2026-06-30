'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Building2, Users, FileText, Clock3, Users2, Ban, Gift, XCircle } from 'lucide-react'
import { collection, query, where, getCountFromServer, getDocs, orderBy, limit } from 'firebase/firestore'
import { auth, db } from "@/lib/firebase"; 

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    ngos: 0,
    donors: 0,
    requests: 0,
    pendingDonations: 0,
    cancelledDonations: 0,
    volunteers: 0,
    blockedUsers: 0,
  });
  
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const ngoSnap = await getCountFromServer(query(collection(db, 'users'), where('role', '==', 'ngo')));
        const donorSnap = await getCountFromServer(query(collection(db, 'users'), where('role', '==', 'donor')));
        const requestsSnap = await getCountFromServer(collection(db, 'ngo_listings'));
        
        // Tracking your Pending to Confirmed donations
        const pendingDonSnap = await getCountFromServer(query(collection(db, 'donations'), where('status', '==', 'pending')));
        const cancelledDonSnap = await getCountFromServer(query(collection(db, 'donations'), where('status', '==', 'cancelled')));
        
        const volunteerSnap = await getCountFromServer(collection(db, 'volunteer_requests'));
        const blockedSnap = await getCountFromServer(query(collection(db, 'users'), where('status', '==', 'blocked')));

        setCounts({
          ngos: ngoSnap.data().count,
          donors: donorSnap.data().count,
          requests: requestsSnap.data().count,
          pendingDonations: pendingDonSnap.data().count,
          cancelledDonations: cancelledDonSnap.data().count,
          volunteers: volunteerSnap.data().count,
          blockedUsers: blockedSnap.data().count,
        });

        // Fetch Recent Activity
        const activityQuery = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(5));
        const activitySnap = await getDocs(activityQuery);
        
        const fetchedActivities = activitySnap.docs.map(doc => {
          const data = doc.data();
          
          // 👇 LOOK HERE! 👇
          // Change 'foodName' and 'donorName' to whatever exact fields you used in your Firebase Database!
          const itemName = data.foodName || data.title || data.itemName || 'Food Item';
          const donor = data.donorName || data.userName || 'A Donor';
          
          return {
            id: doc.id,
            type: 'donation',
            message: `New donation: ${itemName} from ${donor}`,
            time: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : 'Recently'
          };
        });
        
        setActivities(fetchedActivities);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Updated to 7 cards (Removed "Confirmed", Renamed "Pending")
  const stats = [
    { label: 'Total NGOs', value: counts.ngos, icon: Building2, color: 'bg-rose-100', textColor: 'text-[#8E4F5A]', iconColor: 'text-[#8E4F5A]' },
    { label: 'Total Donors', value: counts.donors, icon: Users, color: 'bg-blue-100', textColor: 'text-blue-600', iconColor: 'text-blue-600' },
    { label: 'Total Requests', value: counts.requests, icon: FileText, color: 'bg-rose-100', textColor: 'text-[#8E4F5A]', iconColor: 'text-[#8E4F5A]' },
    { label: 'Volunteer Requests', value: counts.volunteers, icon: Users2, color: 'bg-indigo-100', textColor: 'text-indigo-600', iconColor: 'text-indigo-600' },
    
    { label: 'Confirmed Donations', value: counts.pendingDonations, icon: Clock3, color: 'bg-yellow-100', textColor: 'text-yellow-700', iconColor: 'text-yellow-700' },
    { label: 'Cancelled Donations', value: counts.cancelledDonations, icon: XCircle, color: 'bg-red-100', textColor: 'text-red-600', iconColor: 'text-red-600' },
    { label: 'Blocked Users', value: counts.blockedUsers, icon: Ban, color: 'bg-red-100', textColor: 'text-red-600', iconColor: 'text-red-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Charitey Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here is your live admin overview.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
            <p className="text-[#8E4F5A] font-bold animate-pulse">Loading live data from Firebase...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <span>Live from database</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Activity Timeline</h2>
          <p className="text-gray-500 text-sm mt-1">Recent donations and platform events</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {activities.length === 0 && !isLoading && (
               <p className="text-gray-500 italic">No recent activity found.</p>
            )}
            {activities.map((activity, idx) => {
              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <Gift size={20} className="text-[#B76E79]" strokeWidth={1.5} />
                    </div>
                    {idx !== activities.length - 1 && <div className="w-1 h-12 bg-gray-100 mt-2" />}
                  </div>
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