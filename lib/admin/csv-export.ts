/**
 * CSV Export Utility for Admin Panel
 * Provides helper functions to export data as CSV files
 */

export interface ExportOptions {
  filename?: string
  headers?: string[]
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return ''

  // Determine headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0])

  // Create header row
  const headerRow = csvHeaders.map(h => `"${h}"`).join(',')

  // Create data rows
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header]
        // Handle special characters and quotes
        if (value === null || value === undefined) return '""'
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(data: any[], options: ExportOptions = {}): void {
  const {
    filename = `export_${new Date().toISOString().split('T')[0]}.csv`,
    headers,
  } = options

  const csv = convertToCSV(data, headers)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export users data to CSV
 */
export function exportUsersCSV(users: any[]): void {
  const data = users.map(user => ({
    Name: user.name,
    Email: user.email,
    Phone: user.phone,
    Role: user.role,
    Status: user.status,
    Joined: user.joined,
    ...(user.registrationId && { 'Registration ID': user.registrationId }),
  }))

  downloadCSV(data, { filename: `users_${new Date().toISOString().split('T')[0]}.csv` })
}

/**
 * Export donations data to CSV
 */
export function exportDonationsCSV(donations: any[]): void {
  const data = donations.map(donation => ({
    Donor: donation.donor,
    NGO: donation.ngo,
    'Request Item': donation.requestItem,
    'Donated Item': donation.donatedItem,
    Quantity: donation.quantity,
    Status: donation.status,
    Date: donation.date,
  }))

  downloadCSV(data, { filename: `donations_${new Date().toISOString().split('T')[0]}.csv` })
}

/**
 * Export posts data to CSV
 */
export function exportPostsCSV(posts: any[]): void {
  const data = posts.map(post => ({
    'NGO Name': post.ngo,
    'Item Needed': post.item,
    Category: post.category,
    Quantity: post.quantity,
    'Volunteer Needed': post.volunteerNeeded,
    Status: post.status,
    Date: post.date,
  }))

  downloadCSV(data, { filename: `posts_${new Date().toISOString().split('T')[0]}.csv` })
}

/**
 * Export audit logs data to CSV
 */
export function exportAuditLogsCSV(logs: any[]): void {
  const data = logs.map(log => ({
    Admin: log.admin,
    Action: log.action,
    Details: log.details,
    Timestamp: log.timestamp,
    'IP Address': log.ipAddress,
  }))

  downloadCSV(data, { filename: `audit_logs_${new Date().toISOString().split('T')[0]}.csv` })
}
