'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from "@/lib/firebase"; 
import { Star, Loader2, Calendar } from 'lucide-react'

// Updated to support both numerical ratings and text-based survey schemas
interface FeedbackData {
  id: string
  userName: string
  userEmail: string
  userRole: string
  submittedAt: any
  // Schema A (Numerical / Donors)
  q1_notifications?: number
  q2_settings?: number
  q3_recommend?: number
  q4_ngo_info?: number
  q5_support?: number
  // Schema B (Text-based / Volunteers)
  q1_overall_experience?: string
  q2_ease_of_use?: string
  q3_satisfaction?: string
  q4_helpfulness?: string
  q5_recommendation?: string
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(collection(db, 'feedbacks'), orderBy('submittedAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const feedbackList: FeedbackData[] = []
        querySnapshot.forEach((doc) => {
          feedbackList.push({ id: doc.id, ...doc.data() } as FeedbackData)
        })
        
        setFeedbacks(feedbackList)
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  // Smart average calculator that adapts to both schemas
  const calculateAverage = (f: FeedbackData) => {
    // Check if it's the numerical schema
    if (f.q1_notifications !== undefined) {
      const total = (f.q1_notifications || 0) + (f.q2_settings || 0) + (f.q3_recommend || 0) + (f.q4_ngo_info || 0) + (f.q5_support || 0)
      return (total / 5).toFixed(1)
    } 
    
    // Check if it's the text schema and try to extract digits from the "4 Stars" string
    if (f.q1_overall_experience) {
      const match = f.q1_overall_experience.match(/\d+/)
      if (match) return parseFloat(match[0]).toFixed(1)
    }

    return 'N/A'
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8E4F5A]" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">User Feedbacks</h2>
        <p className="text-gray-500 mt-1">Review ratings and feedback submitted by users across the platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No feedback found in the database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Avg Rating</th>
                  <th className="px-6 py-4">Detailed Ratings / Answers</th>
                  <th className="px-6 py-4">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{item.userName || 'Unknown'}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.userEmail || 'No email provided'}</div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${item.userRole === 'ngo' ? 'bg-blue-100 text-blue-700' : 
                          item.userRole === 'donor' ? 'bg-green-100 text-green-700' : 
                          'bg-purple-100 text-purple-700'}`}
                      >
                        {item.userRole || 'USER'}
                      </span>
                    </td>

                    {/* Average Score */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 bg-[#8E4F5A]/10 text-[#8E4F5A] px-3 py-1 rounded-lg font-bold">
                        <Star size={14} className="fill-current" />
                        {calculateAverage(item)}
                      </div>
                    </td>

                    {/* Conditional rendering depending on the schema type */}
                    <td className="px-6 py-4">
                      {item.q1_notifications !== undefined ? (
                        /* Donor / Numeric Layout */
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
                          <div className="bg-gray-100 px-2 py-1 rounded" title="Notifications">Q1: {item.q1_notifications}</div>
                          <div className="bg-gray-100 px-2 py-1 rounded" title="Settings">Q2: {item.q2_settings}</div>
                          <div className="bg-gray-100 px-2 py-1 rounded" title="Recommendation">Q3: {item.q3_recommend}</div>
                          <div className="bg-gray-100 px-2 py-1 rounded" title="NGO Info">Q4: {item.q4_ngo_info}</div>
                          <div className="bg-gray-100 px-2 py-1 rounded" title="Support">Q5: {item.q5_support}</div>
                        </div>
                      ) : (
                        /* Volunteer / Text Layout */
                        <div className="space-y-1 text-xs text-gray-600 min-w-[250px]">
                          <div><span className="font-semibold text-gray-700">Experience:</span> {item.q1_overall_experience || 'N/A'}</div>
                          <div><span className="font-semibold text-gray-700">Ease of Use:</span> {item.q2_ease_of_use || 'N/A'}</div>
                          <div><span className="font-semibold text-gray-700">Satisfaction:</span> {item.q3_satisfaction || 'N/A'}</div>
                          <div><span className="font-semibold text-gray-700">Helpfulness:</span> {item.q4_helpfulness || 'N/A'}</div>
                          <div><span className="font-semibold text-gray-700">Recommend:</span> {item.q5_recommendation || 'N/A'}</div>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        {formatDate(item.submittedAt)}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}