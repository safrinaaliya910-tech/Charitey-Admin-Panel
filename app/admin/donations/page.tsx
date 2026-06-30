'use client'

import { useState, useEffect } from 'react'
import { Eye, Trash2, XCircle } from 'lucide-react'
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from "@/lib/firebase"; 
import Modal from '@/components/admin/Modal'
import ConfirmationDialog from '@/components/admin/ConfirmationDialog'
import { logAdminAction } from '@/lib/firebase';

// 🎨 EXPERT UI: Strictly only Confirmed and Cancelled
const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function DonationsManagement() {
  const [donationsList, setDonationsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [selectedDonation, setSelectedDonation] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [donationToDelete, setDonationToDelete] = useState<any>(null)

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      // 1. Fetch all listings first to use as a "Lookup Dictionary"
      const listingsSnap = await getDocs(collection(db, 'ngo_listings'));
      const listingsMap: Record<string, any> = {};
      listingsSnap.docs.forEach(doc => {
        listingsMap[doc.id] = doc.data();
      });

      // 2. Fetch the donations
      const donationsSnap = await getDocs(collection(db, 'donations'));
      
      const fetchedDonations = donationsSnap.docs.map(doc => {
        const data = doc.data();
        
        // Lookup the missing names using the listingId
        const originalListing = listingsMap[data.listingId] || {};
        
        const itemName = data.productName || data.foodType || originalListing.productName || originalListing.foodType || 'Unknown Item';
        const ngoName = data.ngoName || originalListing.ngoName || 'Unknown NGO';
        const qty = data.quantity || data.donatedQuantity || originalListing.quantity || 0;
        const unit = data.unit || originalListing.unit || '';
        
        // FORCE STATUS: If it's cancelled, it's CANCELLED. Otherwise, it is CONFIRMED.
        const finalStatus = (data.status?.toLowerCase() === 'cancelled') ? 'CANCELLED' : 'CONFIRMED';
        
        return {
          id: doc.id,
          ...data,
          donor: data.donorName || 'Unknown Donor',
          ngo: ngoName,
          item: itemName,
          quantityDisplay: `${qty} ${unit}`.trim(),
          status: finalStatus,
          date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
          
          donorPhone: data.donorPhone || 'Not provided',
          donorLocation: data.donorLocation || 'Not provided',
          cancelReason: data.cancelReason || ''
        }
      });
      setDonationsList(fetchedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteClick = (donation: any) => {
    setDonationToDelete(donation);
    setShowConfirm(true);
  }

  const confirmDelete = async () => {
  if (!donationToDelete) return;
  try {
    await deleteDoc(doc(db, 'donations', donationToDelete.id));
    setDonationsList(prev => prev.filter(d => d.id !== donationToDelete.id));
    
    // ADD THIS LOG
    await logAdminAction("Admin User", "Deleted Donation", `Permanently deleted donation ID: ${donationToDelete.id}`);
  } catch (error) {
    console.error("Error deleting donation:", error);
  } finally {
    setShowConfirm(false);
    setDonationToDelete(null);
  }
}

// INSIDE handleCancelDonation:
const handleCancelDonation = async (id: string) => {
  if(!confirm("Are you sure you want to cancel this donation?")) return;
  try {
    await updateDoc(doc(db, 'donations', id), { status: 'cancelled' });
    setDonationsList(prev => prev.map(d => d.id === id ? { ...d, status: 'CANCELLED' } : d));
    
    // ADD THIS LOG
    await logAdminAction("Admin User", "Cancelled Donation", `Cancelled donation ID: ${id}`);
  } catch (error) {
    console.error("Error updating status:", error);
  }
}
  const filtered = donationsList.filter((donation) => {
    const matchSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        donation.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        donation.item.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || donation.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Donations Management</h1>
        <p className="text-gray-500 mt-1">Track donor contributions to NGOs • Total: {donationsList.length} donations</p>
      </div>

      {/* The Two Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm flex flex-col justify-center">
          <p className="text-sm text-green-700 font-bold tracking-wider uppercase mb-1">Confirmed Donations</p>
          <p className="text-4xl font-black text-green-800">{donationsList.filter(d => d.status === 'CONFIRMED').length}</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm flex flex-col justify-center">
          <p className="text-sm text-red-700 font-bold tracking-wider uppercase mb-1">Cancelled Donations</p>
          <p className="text-4xl font-black text-red-800">{donationsList.filter(d => d.status === 'CANCELLED').length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by donor, NGO, or item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        <select 
  aria-label="Filter by Status"
  title="Filter by Status"
  value={filterStatus} 
  onChange={(e) => setFilterStatus(e.target.value)} 
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-medium"
>
  <option value="all">All Statuses</option>
  <option value="CONFIRMED">Confirmed</option>
  <option value="CANCELLED">Cancelled</option>
</select>
      </div>

      {/* Clean Table without Chat */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Donor</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">NGO</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Donated Item</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Qty</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-[#8E4F5A] font-bold animate-pulse">Loading Live Donations...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">No donations found.</td></tr>
              ) : (
                filtered.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">{donation.donor}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{donation.ngo}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{donation.item}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">{donation.quantityDisplay}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColors[donation.status] || 'bg-gray-100 text-gray-800'}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedDonation(donation); setShowModal(true); }} className="p-2 hover:bg-rose-100 rounded transition text-[#B76E79]" title="View Details">
                          <Eye size={18} />
                        </button>
                        
                        {donation.status === 'CONFIRMED' ? (
                           <button onClick={() => handleCancelDonation(donation.id)} className="p-2 hover:bg-orange-100 rounded transition text-orange-600" title="Cancel Donation">
                             <XCircle size={18} />
                           </button>
                        ) : (
                           <button onClick={() => handleDeleteClick(donation)} className="p-2 hover:bg-red-100 rounded transition text-red-600" title="Delete Permanently">
                             <Trash2 size={18} />
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Donation Details" size="lg">
        {selectedDonation && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedDonation.item}</h3>
                  <p className="text-[#8E4F5A] font-medium mt-1">Donated by: {selectedDonation.donor}</p>
               </div>
               <div className="text-right bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 font-bold uppercase">Quantity</p>
                  <p className="text-xl text-green-900 font-black">{selectedDonation.quantityDisplay}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">NGO Destination</p>
                <p className="text-gray-900 font-bold">{selectedDonation.ngo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Current Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColors[selectedDonation.status] || 'bg-gray-100 text-gray-800'}`}>
                  {selectedDonation.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Donor Phone</p>
                <p className="text-gray-900 font-medium">{selectedDonation.donorPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Donor Location</p>
                <p className="text-gray-900 font-medium capitalize">{selectedDonation.donorLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Date Created</p>
                <p className="text-gray-900 font-medium">{selectedDonation.date}</p>
              </div>
            </div>
            
            {/* Show Reason if Cancelled */}
            {selectedDonation.status === 'CANCELLED' && selectedDonation.cancelReason && (
              <div className="pt-4 border-t border-red-100">
                <p className="text-sm text-red-500 font-bold mb-2">Reason for Cancellation</p>
                <p className="text-red-900 bg-red-50 p-3 rounded-md italic">
                  "{selectedDonation.cancelReason}"
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Donation Record"
        message="Are you sure you want to permanently delete this donation from the database? This action cannot be undone."
        confirmText="Delete Permanently"
        isDangerous={true}
      />
    </div>
  )
}