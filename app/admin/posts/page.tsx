'use client'
import { logAdminAction } from '@/lib/firebase';
import { useState, useEffect } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { auth, db } from "@/lib/firebase"; 
import Modal from '@/components/admin/Modal'
import ConfirmationDialog from '@/components/admin/ConfirmationDialog'

const statusColors: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-800',
  CLAIMED: 'bg-yellow-100 text-yellow-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-orange-100 text-orange-800',
}

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-50 text-orange-700',
  Product: 'bg-blue-50 text-blue-700',
}

export default function PostsManagement() {
  const [postsList, setPostsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [postToDelete, setPostToDelete] = useState<any>(null)

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'ngo_listings'));
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
        
        return {
          id: doc.id,
          ...data,
          ngo: data.ngoName || 'Unknown NGO',
          item: data.productName || data.foodType || 'Unknown Item',
          category: data.type === 'food' ? 'Food' : 'Product',
          quantityDisplay: `${data.quantity || 0} ${data.unit || ''}`.trim(),
          status: (data.status || 'OPEN').toUpperCase(),
          date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
          location: data.ngoLocation || 'Not specified',
          // 👇 EXPERT FIX: Changed variable name to reflect that they HAVE a volunteer ready
          volunteerReady: data.isVolunteerAvailable ? 'Yes' : 'No' 
        }
      });
      setPostsList(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteClick = (post: any) => { setPostToDelete(post); setShowConfirm(true); }
  const confirmDelete = async () => {
  if (!postToDelete) return;
  await deleteDoc(doc(db, 'ngo_listings', postToDelete.id));
  
  // ADD THIS LOG
  await logAdminAction("Admin User", "Deleted Post", `Deleted request: ${postToDelete.item} for ${postToDelete.ngo}`);
  
  setPostsList(prev => prev.filter(p => p.id !== postToDelete.id));
  setShowConfirm(false);
}

  const filtered = postsList.filter((post) => {
    const matchSearch = post.item.toLowerCase().includes(searchTerm.toLowerCase()) || post.ngo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = filterCategory === 'all' || post.category === filterCategory
    const matchStatus = filterStatus === 'all' || post.status === filterStatus
    return matchSearch && matchCategory && matchStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Posts & Requests Management</h1>
        <p className="text-gray-500 mt-1">Item Donation Requests • Total: {postsList.length} requests</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by item or NGO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select 
  aria-label="Filter by Category"
  title="Filter by Category"
  value={filterCategory} 
  onChange={(e) => setFilterCategory(e.target.value)} 
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
>
  <option value="all">All Categories</option>
  <option value="Food">Food</option>
  <option value="Product">Product</option>
</select>
        
        <select 
  aria-label="Filter by Status"
  title="Filter by Status"
  value={filterStatus} 
  onChange={(e) => setFilterStatus(e.target.value)} 
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
>
  <option value="all">All Status</option>
  <option value="OPEN">Open</option>
  <option value="CLAIMED">Claimed</option>
  <option value="CLOSED">Closed</option>
</select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NGO Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Needed Item</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (<tr><td colSpan={6} className="px-6 py-8 text-center text-[#8E4F5A] font-bold">Loading...</td></tr>) : (
              filtered.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{post.ngo}</td>
                  <td className="px-6 py-4 text-sm font-medium">{post.item}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{post.quantityDisplay}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[post.status] || 'bg-gray-100 text-gray-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => { setSelectedPost(post); setShowModal(true); }} className="p-2 hover:bg-rose-100 text-[#B76E79]" title="View Details">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDeleteClick(post)} className="p-2 hover:bg-red-100 text-red-600" title="Delete Post">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Donation Request Details" size="lg">
        {selectedPost && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{selectedPost.item}</h3>
              <p className="text-[#8E4F5A] font-medium mt-1">Requested by: {selectedPost.ngo}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Category</p>
                <p className="text-gray-900">{selectedPost.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Quantity Needed</p>
                <p className="text-gray-900 font-semibold">{selectedPost.quantityDisplay}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedPost.status] || 'bg-gray-100 text-gray-800'}`}>
                  {selectedPost.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Date Posted</p>
                <p className="text-gray-900">{selectedPost.date}</p>
              </div>
              <div>
                {/* 👇 EXPERT FIX: Beautifully updated UI wording */}
                <p className="text-sm text-gray-500 font-medium">Volunteer Ready for Pickup?</p>
                <p className={selectedPost.volunteerReady === 'Yes' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                  {selectedPost.volunteerReady}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Location</p>
                <p className="text-gray-900">{selectedPost.location}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 font-medium mb-2">Description / Notes</p>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                {selectedPost.description || 'No description provided.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
      
      <ConfirmationDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={confirmDelete} title="Delete Post" message="Are you sure you want to permanently delete this request? This action cannot be undone." confirmText="Delete" isDangerous={true} />
    </div>
  )
}