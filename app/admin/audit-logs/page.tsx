'use client'

import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { auth, db } from "@/lib/firebase";

export default function AuditLogs() {
  const [logsList, setLogsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Fetch logs from Firebase, newest first
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetchedLogs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          admin: data.adminName || data.adminEmail || 'Admin User',
          action: data.action || 'Unknown Action',
          details: data.details || 'No details provided',
          
          // Format the timestamp nicely
          timestamp: data.timestamp 
            ? new Date(data.timestamp.seconds * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
            : 'N/A',
            
          ipAddress: data.ipAddress || 'System'
        }
      });
      
      setLogsList(fetchedLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 🧠 SMART COLOR SYSTEM: Automatically colors text based on keywords!
  const getActionColor = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('delete') || lower.includes('reject') || lower.includes('block') || lower.includes('cancel')) return 'text-red-600';
    if (lower.includes('create') || lower.includes('approve') || lower.includes('add')) return 'text-green-600';
    if (lower.includes('update') || lower.includes('edit')) return 'text-blue-600';
    if (lower.includes('review') || lower.includes('mark')) return 'text-orange-600';
    return 'text-gray-800'; // Default color
  }

  // Generate unique actions for the dropdown filter automatically
  const uniqueActions = Array.from(new Set(logsList.map(log => log.action)));

  const filtered = logsList.filter((log) => {
    const matchSearch = log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchAction = filterAction === 'all' || log.action === filterAction
    return matchSearch && matchAction
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2B1B1F]">Audit Logs</h1>
        <p className="text-gray-500 mt-1">Track all admin actions and system changes • Total: {logsList.length} logs</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-blue-800 font-medium">
          <strong>Audit Trail:</strong> Complete record of all admin actions with timestamps for security and accountability.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by admin, action, or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] flex-1 min-w-64"
        />
        
        {/* Added aria-label to fix the accessibility error you saw earlier! */}
        <select
          aria-label="Filter by Action"
          title="Filter by Action"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] font-medium"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Admin</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Details</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8E4F5A] font-bold animate-pulse">
                    Loading System Logs...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">{log.admin}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold tracking-wide uppercase ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{log.details}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono bg-gray-50">{log.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No logs found</p>
                    <p className="text-sm mt-1">Admin actions will appear here once recorded in the database.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}