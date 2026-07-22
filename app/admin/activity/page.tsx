'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from "@/lib/firebase"
import { Trash2, Heart, Calendar, User, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react'

interface PostData {
  id: string
  postId: string
  description: string
  donorId: string
  donorUid: string
  ngoId: string
  ngoProfileImage?: string
  image?: string
  likes: number
  createdAt: any
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const postsList: PostData[] = []
      querySnapshot.forEach((doc) => {
        postsList.push({ id: doc.id, ...doc.data() } as PostData)
      })
      setPosts(postsList)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } bits: {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this post?")) {
      return
    }

    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'posts', id))
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    try {
      const date = timestamp.toDate()
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (e) {
      return 'Invalid Date'
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8E4F5A]" size={36} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Activity Feed Moderation</h2>
          <p className="text-sm text-gray-500 mt-0.5">Review user activity logs, shared images, and engagement fields.</p>
        </div>
        <div className="bg-[#8E4F5A]/10 text-[#8E4F5A] px-4 py-2 rounded-xl text-xs font-bold self-start tracking-wider uppercase">
          Total Posts: {posts.length}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 shadow-xs max-w-md mx-auto mt-12">
          <ImageIcon className="mx-auto text-gray-300 mb-4" size={40} />
          <p className="text-base font-semibold text-gray-700">No active posts found</p>
          <p className="text-xs text-gray-400 mt-1">New user items will automatically populate here.</p>
        </div>
      ) : (
        /* Uniform Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#8E4F5A]/30 transition-all duration-200"
            >
              {/* Card Title Bar */}
              <div className="p-4 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  {post.ngoProfileImage ? (
                    <img 
                      src={post.ngoProfileImage} 
                      alt="NGO Avatar" 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <User size={16} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-800 truncate max-w-[140px]" title={post.ngoId}>
                      Poster ID: {post.ngoId?.slice(0, 10)}...
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">{formatDate(post.createdAt)}</div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={deletingId === post.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 rounded-lg transition-all"
                  title="Remove post"
                >
                  {deletingId === post.id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
                </button>
              </div>

              {/* Bounded Media Frame - Fixes the stretching bug from image_7ec2cc.jpg */}
              <div className="h-72 w-full bg-gray-900 flex items-center justify-center overflow-hidden relative group border-b border-gray-100">
                {post.image ? (
                  <>
                    <img 
                      src={post.image} 
                      alt="Post Attachment" 
                      className="w-full h-full object-contain bg-neutral-950" 
                      loading="lazy"
                    />
                    <a 
                      href={post.image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[11px] font-medium tracking-wide shadow-sm"
                    >
                      <ExternalLink size={12} /> View Source
                    </a>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 gap-1.5 bg-gray-50 w-full h-full">
                    <ImageIcon size={26} className="text-gray-300" />
                    <span className="text-xs font-medium">Text-only record</span>
                  </div>
                )}
              </div>

              {/* Engagement Text Section */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                    <Heart size={14} className="text-red-500 fill-red-500" />
                    <span>{post.likes || 0} Likes</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {post.donorId && (
                      <span className="text-[#8E4F5A] font-bold mr-1.5">
                        {post.donorId}
                      </span>
                    )}
                    {post.description || <span className="italic text-gray-400">No descriptive content text provided.</span>}
                  </p>
                </div>

                {/* Metadata Keys Block */}
                <div className="pt-3 border-t border-gray-100 text-[10px] font-mono text-gray-400 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Donor Uid:</span>
                    <span className="text-gray-600 truncate max-w-[160px]" title={post.donorUid}>{post.donorUid || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Post ID:</span>
                    <span className="text-gray-600 truncate max-w-[160px]" title={post.postId || post.id}>{post.postId || post.id}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}