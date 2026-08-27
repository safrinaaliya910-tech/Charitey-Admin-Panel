'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Star, Loader2, Calendar, MessageSquareText, User } from 'lucide-react'

interface ReviewRow {
  id: string
  source: 'donation' | 'survey'
  type: string // e.g. 'Donor → Volunteer', 'NGO → Donor', 'App Survey'
  fromName: string
  fromRole: string
  toName: string
  rating: number | null
  feedbackText: string
  donationId?: string
  submittedAt: Date | null
}

interface SurveyFeedback {
  id: string
  userName?: string
  userEmail?: string
  userRole?: string
  submittedAt?: any
  q1_notifications?: number
  q2_settings?: number
  q3_recommend?: number
  q4_ngo_info?: number
  q5_support?: number
  q1_overall_experience?: string
  q2_ease_of_use?: string
  q3_satisfaction?: string
  q4_helpfulness?: string
  q5_recommendation?: string
}

function Stars({ value }: { value: number | null }) {
  if (value == null || value <= 0) {
    return <span className="text-gray-400 text-xs">No rating</span>
  }
  const full = Math.round(value)
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < full
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300'
          }
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-gray-700">
        {value.toFixed(1)}
      </span>
    </div>
  )
}

function formatDate(d: Date | null) {
  if (!d) return 'N/A'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

async function resolveUserName(uid: string): Promise<{ name: string; role: string }> {
  if (!uid) return { name: 'Unknown', role: '' }
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return { name: 'Unknown', role: '' }
    const data = snap.data()
    return {
      name: (data.name || data.ngoName || 'Unknown').toString(),
      role: (data.role || '').toString().toLowerCase(),
    }
  } catch {
    return { name: 'Unknown', role: '' }
  }
}

export default function FeedbacksPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // Live donations (delivery ratings)
    const unsubDonations = onSnapshot(
      collection(db, 'donations'),
      async (snap) => {
        const rows: ReviewRow[] = []

        for (const d of snap.docs) {
          const data = d.data() as any
          const donationId = d.id

          // Donor → Volunteer rating (from RatingDialog)
          if (data.isRated === true && (data.volunteerRating || data.volunteerFeedback)) {
            const volunteerId = (data.ratedVolunteerId || data.assignedVolunteerId || '').toString()
            const donorId = (data.donorId || '').toString()

            const [fromUser, toUser] = await Promise.all([
              resolveUserName(donorId),
              resolveUserName(volunteerId),
            ])

            let submittedAt: Date | null = null
            if (data.paymentSubmittedAt?.toDate) {
              submittedAt = data.paymentSubmittedAt.toDate()
            } else if (data.createdAt?.toDate) {
              submittedAt = data.createdAt.toDate()
            }

            rows.push({
              id: `${donationId}_donor_volunteer`,
              source: 'donation',
              type: 'Donor → Volunteer',
              fromName: fromUser.name,
              fromRole: fromUser.role || 'donor',
              toName: toUser.name,
              rating: Number(data.volunteerRating) || null,
              feedbackText: (data.volunteerFeedback || '').toString().trim(),
              donationId,
              submittedAt,
            })
          }

          // NGO ratings (from NgoRatingDialog)
          if (data.ngoRated === true) {
            const ngoId = (data.ngoId || '').toString()
            const donorId = (data.donorId || '').toString()
            const volunteerId = (data.assignedVolunteerId || '').toString()

            const [ngoUser, donorUser, volUser] = await Promise.all([
              resolveUserName(ngoId),
              resolveUserName(donorId),
              resolveUserName(volunteerId),
            ])

            let submittedAt: Date | null = null
            if (data.createdAt?.toDate) submittedAt = data.createdAt.toDate()

            if (data.ngoToDonorRating) {
              rows.push({
                id: `${donationId}_ngo_donor`,
                source: 'donation',
                type: 'NGO → Donor',
                fromName: ngoUser.name,
                fromRole: 'ngo',
                toName: donorUser.name,
                rating: Number(data.ngoToDonorRating) || null,
                feedbackText: '',
                donationId,
                submittedAt,
              })
            }

            if (volunteerId && data.ngoToVolunteerRating) {
              rows.push({
                id: `${donationId}_ngo_volunteer`,
                source: 'donation',
                type: 'NGO → Volunteer',
                fromName: ngoUser.name,
                fromRole: 'ngo',
                toName: volUser.name,
                rating: Number(data.ngoToVolunteerRating) || null,
                feedbackText: '',
                donationId,
                submittedAt,
              })
            }
          }
        }

        // Live survey feedbacks (optional legacy collection)
        const surveySnap = await new Promise<any>((resolve) => {
          const unsub = onSnapshot(
            query(collection(db, 'feedbacks'), orderBy('submittedAt', 'desc')),
            (s) => {
              unsub()
              resolve(s)
            },
            () => {
              unsub()
              resolve(null)
            }
          )
        }).catch(() => null)

        if (surveySnap) {
          surveySnap.forEach((docSnap: any) => {
            const f = { id: docSnap.id, ...docSnap.data() } as SurveyFeedback
            let rating: number | null = null
            let text = ''

            if (f.q1_notifications !== undefined) {
              const total =
                (f.q1_notifications || 0) +
                (f.q2_settings || 0) +
                (f.q3_recommend || 0) +
                (f.q4_ngo_info || 0) +
                (f.q5_support || 0)
              rating = total / 5
              text = `Q1:${f.q1_notifications} Q2:${f.q2_settings} Q3:${f.q3_recommend} Q4:${f.q4_ngo_info} Q5:${f.q5_support}`
            } else {
              const match = (f.q1_overall_experience || '').match(/\d+/)
              if (match) rating = parseFloat(match[0])
              text = [
                f.q1_overall_experience && `Experience: ${f.q1_overall_experience}`,
                f.q2_ease_of_use && `Ease: ${f.q2_ease_of_use}`,
                f.q3_satisfaction && `Satisfaction: ${f.q3_satisfaction}`,
                f.q4_helpfulness && `Helpfulness: ${f.q4_helpfulness}`,
                f.q5_recommendation && `Recommend: ${f.q5_recommendation}`,
              ]
                .filter(Boolean)
                .join(' · ')
            }

            rows.push({
              id: `survey_${f.id}`,
              source: 'survey',
              type: 'App Survey',
              fromName: f.userName || 'Unknown',
              fromRole: (f.userRole || 'user').toLowerCase(),
              toName: 'Platform',
              rating,
              feedbackText: text,
              submittedAt: f.submittedAt?.toDate ? f.submittedAt.toDate() : null,
            })
          })
        }

        // Newest first
        rows.sort((a, b) => {
          const ta = a.submittedAt?.getTime() ?? 0
          const tb = b.submittedAt?.getTime() ?? 0
          return tb - ta
        })

        if (!cancelled) {
          setReviews(rows)
          setLoading(false)
        }
      },
      (err) => {
        console.error('Error listening donations for feedbacks:', err)
        if (!cancelled) setLoading(false)
      }
    )

    return () => {
      cancelled = true
      unsubDonations()
    }
  }, [])

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
        <p className="text-gray-500 mt-1">
          Live ratings from donors &amp; NGOs (delivery reviews) plus app surveys.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No feedback found yet. Ratings appear here after donors rate volunteers
            or NGOs submit ratings on completed donations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">To</th>
                  <th className="px-6 py-4">Stars</th>
                  <th className="px-6 py-4">Feedback text</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.fromName}
                          </div>
                          <span
                            className={`mt-0.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                            ${
                              item.fromRole === 'ngo'
                                ? 'bg-blue-100 text-blue-700'
                                : item.fromRole === 'donor'
                                  ? 'bg-green-100 text-green-700'
                                  : item.fromRole === 'volunteer'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.fromRole || 'user'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {item.toName}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Stars value={item.rating} />
                    </td>

                    <td className="px-6 py-4 max-w-sm">
                      {item.feedbackText ? (
                        <div className="flex items-start gap-2 text-gray-700">
                          <MessageSquareText
                            size={14}
                            className="mt-0.5 shrink-0 text-gray-400"
                          />
                          <span className="text-sm leading-relaxed">
                            {item.feedbackText}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          No written feedback
                        </span>
                      )}
                      {item.donationId && (
                        <div className="text-[10px] text-gray-400 mt-1 font-mono">
                          donation: {item.donationId.slice(0, 10)}…
                        </div>
                      )}
                    </td>

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