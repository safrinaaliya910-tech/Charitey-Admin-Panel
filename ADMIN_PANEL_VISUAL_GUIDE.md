# Charitey Admin Panel - Visual Design Guide

## Overview
Complete visual mockups of the professional Charitey Admin Dashboard with 10 core screens showing modern Material Design 3 interface, responsive layout, and comprehensive admin features.

---

## Design System

### Color Palette
- **Primary Blue**: #1E88E5 (Navigation, buttons, active states)
- **Success Green**: #43A047 (Approved status, completed actions)
- **Warning Yellow/Orange**: #FFA726 (Pending status, warnings)
- **Error Red**: #E53935 (Rejected, blocked, errors)
- **Neutral Gray**: #616161 (Text, borders, disabled states)
- **Background White**: #FFFFFF (Cards, surfaces)
- **Background Light Gray**: #F5F5F5 (Page background)

### Typography
- **Headlines**: Material Design bold, 28-32px (dashboard title), 20-24px (section title)
- **Body Text**: Material Design regular, 14-16px
- **Small Text**: 12-14px (secondary information)
- **Monospace**: Code/IDs in data tables

### Components
- **Status Badges**: Color-coded pills with text (Approved, Pending, Blocked, etc.)
- **Data Tables**: Striped rows, sortable columns, hover effects
- **Cards**: White background, subtle shadow, rounded corners
- **Buttons**: Material Design style with hover/active states
- **Icons**: Material Icons throughout (users, settings, logout, etc.)

---

## Screen Specifications

### 1. Admin Login Screen
**Purpose**: Secure authentication for admin-only access

**Key Features**:
- Left branding section with "Charitey" logo and tagline
- Centered login form
- Email field (pre-filled placeholder: admin@charitey.app)
- Password field (secure input)
- "Sign In" button (primary blue)
- "Forgot Password" link
- Remember Me checkbox
- Footer with version/copyright
- Gradient background (dark blue to navy)

**Security**: 
- Firebase Auth verification
- Role check: admin role required in users collection
- Error messages for failed login or unauthorized access

---

### 2. Admin Dashboard
**Purpose**: Overview of system statistics and recent activity

**Key Features**:

**Stat Cards Grid** (8 cards in 2 rows):
1. Total NGOs: 234
2. Active Donors: 1,250
3. Open Requests: 89
4. Total Donations: $45,230
5. Pending Approvals: 12 (orange badge)
6. Completed Donations: 567 (green)
7. Blocked Users: 3 (red)
8. Active Volunteers: 456

Each card shows:
- Icon (relevant to metric)
- Metric name
- Count/value
- Optional trend indicator

**Recent Activity Section**:
- List of recent donations with timestamps
- Recent approvals/rejections
- Recent user registrations
- Activity feed scrollable

**Real-Time Updates**: Stream-connected data from Firestore

---

### 3. NGO Management
**Purpose**: Approve, reject, or block NGO organizations

**Layout**: Header | Search/Filter | Data Table | Actions | Pagination

**Features**:
- **Search**: By NGO name or email
- **Filter**: By Status (Pending, Approved, Rejected, Blocked)
- **Table Columns**: 
  - NGO Name
  - Email
  - Phone
  - Status (colored badge)
  - Joined Date
  - Actions

**Sample Data**:
- Help Hearts NGO | pending@hearts.org | +1234567 | ⚠️ Pending | 2024-01-15 | [View] [Approve] [Reject] [Block]
- Clean Water Initiative | info@cleanwater.org | +9876543 | ✓ Approved | 2024-01-10 | [View] [Block]
- Education for All | contact@edu.org | +5555555 | ✗ Rejected | 2024-01-08 | [View] [Approve]

**Actions**:
- View Details (opens modal with NGO info)
- Approve (changes status to approved, sends notification)
- Reject (changes status to rejected, sends reason request)
- Block (prevents NGO from accessing app)

---

### 4. Donor Management
**Purpose**: Manage donor accounts and monitor activity

**Layout**: Similar to NGO Management (sidebar, search, table, actions)

**Features**:
- **Search**: By donor name or email
- **Filter**: By Status (Active, Suspended, Blocked)
- **Table Columns**:
  - Donor Name
  - Email
  - Phone
  - Status (green/red badge)
  - Joined Date
  - Actions

**Sample Data**:
- John Smith | john@email.com | +1111111 | ✓ Active | 2024-01-05 | [View] [Donation History] [Block]
- Sarah Johnson | sarah@email.com | +2222222 | ✓ Active | 2024-01-03 | [View] [History] [Block]
- Michael Chen | michael@email.com | +3333333 | ✗ Blocked | 2024-01-01 | [View] [Unblock]

**Actions**:
- View Details (profile, contact info)
- View Donation History (all donations made)
- Block/Unblock (prevent/allow access)

---

### 5. Request Management (NGO Requests/Posts)
**Purpose**: Track and manage charitable requests from NGOs

**Layout**: Header | Search/Filter | Data Table | Actions | Pagination

**Features**:
- **Search**: By item name or NGO
- **Filter**: By Status (Active, Fulfilled, Partial, Archived), Category
- **Table Columns**:
  - Item/Title
  - Category (Healthcare, Food, Education, etc.)
  - Posted By (NGO name)
  - Quantity Needed
  - Status (colored badge)
  - Date Posted
  - Actions

**Sample Data**:
- Medical Supplies | Healthcare | Help Hearts NGO | 100 | 🔵 Active | 2024-01-15 | [View] [Update] [Delete]
- Food Packages | Food | Food Bank | 50 | ✓ Fulfilled | 2024-01-10 | [View]
- School Supplies | Education | Education for All | 200 | ⚠️ Partial | 2024-01-12 | [View] [Update] [Delete]

**Actions**:
- View Details (full request, donor contributions)
- Mark Fulfilled (when all items received)
- Delete (with confirmation)
- Update Status

---

### 6. Donation Management
**Purpose**: Monitor and manage donations from donors to NGOs

**Layout**: Header | Search/Filter | Data Table | Actions | Pagination

**Features**:
- **Search**: By donor name or NGO recipient
- **Filter**: By Status (Pending, Confirmed, Completed, Cancelled), Date Range
- **Table Columns**:
  - Donor Name
  - NGO Recipient
  - Request Item/Description
  - Amount/Item Qty
  - Status (colored badge)
  - Date
  - Actions

**Sample Data**:
- John Smith | Help Hearts NGO | Medical Supplies | $500 | ⚠️ Pending | 2024-01-20 | [View] [Confirm] [Cancel]
- Sarah Johnson | Clean Water Initiative | Water Filters | $1,200 | 🔵 Confirmed | 2024-01-18 | [View] [Complete] [Cancel]
- Michael Chen | Education for All | Textbooks | $800 | ✓ Completed | 2024-01-15 | [View]

**Actions**:
- View Donor Details (modal with contact info)
- View NGO Details (recipient organization info)
- View Request (original request details)
- Update Status (dropdown: Pending → Confirmed → Completed or Cancel)

---

### 7. Volunteer Management
**Purpose**: Manage volunteer accounts and assignments

**Layout**: Header | Search/Filter | Data Table | Actions | Pagination

**Features**:
- **Search**: By volunteer name or NGO
- **Filter**: By Status (Available, Unavailable, Blocked), Availability Period
- **Table Columns**:
  - Volunteer Name
  - Associated NGO
  - Status (colored badge)
  - Availability (Weekdays, Weekends, Evenings, etc.)
  - Joined Date
  - Actions

**Sample Data**:
- Alex Rodriguez | Help Hearts NGO | ✓ Available | Weekends | 2023-11-01 | [View] [Assign Task] [Block]
- Maria Garcia | Clean Water Initiative | ✓ Available | Evenings | 2023-10-15 | [View] [Assign] [Block]
- James Wilson | Education for All | ⚠️ Unavailable | Weekends | 2023-09-20 | [View] [Set Available]
- Lisa Chen | Medical Aid Foundation | ✗ Blocked | N/A | 2023-08-10 | [View] [Unblock]

**Actions**:
- View Details (volunteer profile)
- View Assigned Tasks (current assignments)
- Update Availability (change status/period)
- Block/Unblock (prevent/allow participation)

---

### 8. Reports & Complaints
**Purpose**: Review and resolve user reports and complaints

**Layout**: Header | Stats | Search/Filter | Data Table | Actions | Pagination

**Stats Row** (above table):
- Pending: 8 (red badge)
- Reviewed: 20 (blue badge)
- Resolved: 14 (green badge)

**Features**:
- **Search**: By reported user or reason
- **Filter**: By Status (Pending, Reviewed, Resolved), Report Type
- **Table Columns**:
  - Reported User
  - Reporter Type (NGO, Donor, Volunteer, Admin)
  - Reason (Suspicious Activity, Harassment, Fraud, etc.)
  - Status (colored badge)
  - Date Reported
  - Actions

**Sample Data**:
- John Smith | NGO | Suspicious Activity | ⚠️ Pending | 2024-01-20 | [View] [Mark Reviewed] [Block User]
- Sarah Johnson | Donor | Inappropriate Behavior | ⚠️ Pending | 2024-01-19 | [View] [Actions]
- Michael Chen | Admin | Fake Profile | 🔵 Reviewed | 2024-01-15 | [View]
- Emma Davis | Volunteer | Harassment | ✓ Resolved | 2024-01-10 | [View]

**Actions**:
- View Full Report (detailed complaint description)
- View Reported User (profile + history)
- Mark as Reviewed
- Block User (with confirmation warning)
- Dismiss (close without action)

---

### 9. Messages Monitoring (Read-Only)
**Purpose**: Monitor communications between users (moderation phase 1 - read-only)

**Layout**: Two-column (conversations list | message thread)

**Left Column - Conversation List**:
- Search conversations by participant name
- Filter: All Chats, Reported Chats
- Each conversation shows:
  - Participant names (in conversation)
  - Last message preview (truncated)
  - Timestamp (e.g., "2 hours ago")
  - Red flag icon (if reported)
  - Unread indicator (optional)

**Sample Conversations**:
- John Smith & Sarah Johnson | "Is the donation ready for..." | 2 hours ago
- Maria Garcia & Help Hearts NGO | "Thank you for helping us..." | Yesterday
- Michael Chen & Clean Water Initiative | "When will supplies arrive..." | 3 days ago

**Right Column - Message Thread**:
- Header: Participant names and "Read-only monitoring"
- Messages displayed chronologically
- Sender name, timestamp, message content
- Color differentiation between participants
- No send/reply button (read-only phase)
- Scrollable message history

**Actions**:
- View Conversation (default when selected)
- Report Message (if spam/abuse detected in future)
- View User Profiles (from conversation)

---

### 10. Admin Settings
**Purpose**: Manage admin account and app preferences

**Layout**: Header | Settings Sections (cards) | Actions

**Sections**:

**1. Account Section**:
- Admin Avatar (circle icon)
- Name: Admin Name
- Email: admin@charitey.app
- Role: Administrator (badge)

**2. App Information**:
- App Name: Charitey Admin Dashboard
- Version: v1.0.0
- Last Updated: January 2024
- Database: Firebase Firestore
- Status: All Systems Operational (green checkmark)

**3. Preferences**:
- Dark Mode (toggle switch - currently off)
- Email Notifications (toggle - on)
- Show Activity Feed (toggle - on)

**4. Security**:
- Change Password (button)
- Two-Factor Authentication (toggle - optional)

**5. Logout**:
- Logout Button (red/prominent)
- Warning text: "This will end your admin session. Are you sure?"
- Requires confirmation dialog

**Footer**:
- Version number: v1.0.0
- Last updated timestamp
- Support contact

---

## Responsive Design

### Desktop Layout (1920px+)
- Sidebar fixed on left (280px width)
- Main content takes full remaining width
- Tables show all columns comfortably
- Cards in 2-4 column grid

### Tablet Layout (1280px)
- Sidebar may collapse to icons (hamburger menu)
- Content adjusts to smaller width
- Tables may have horizontal scroll for many columns
- Cards in 2 column grid or stacked

### Mobile Support (if needed)
- Sidebar becomes drawer (hamburger menu)
- Tables become card-based view
- One column layout
- Tables show key columns with "expand" action

---

## User Flows

### Admin Login Flow
1. User opens admin app
2. Presented with login screen
3. Enters email (admin@charitey.app)
4. Enters password
5. Clicks "Sign In"
6. Firebase Auth authenticates
7. If authenticated AND has role="admin", proceeds to Dashboard
8. If not admin role, shows error: "Insufficient permissions. Admin access required."
9. On successful login, redirect to Dashboard

### NGO Approval Flow
1. Admin navigates to NGO Management
2. Sees pending NGO (status badge yellow)
3. Clicks "View Details"
4. Modal shows NGO full info (name, contact, address, description, documents)
5. Admin reviews details
6. Clicks "Approve" button
7. Confirmation dialog appears: "Approve 'Help Hearts NGO'? This will notify them of approval."
8. Admin confirms
9. Status updates to "Approved" (green badge)
10. Notification sent to NGO
11. Dashboard stat "Pending Approvals" decrements by 1

### Donation Status Update Flow
1. Admin navigates to Donation Management
2. Sees pending donation (yellow badge)
3. Clicks "Update Status" button
4. Dropdown shows: Pending → Confirmed → Completed or Cancel
5. Admin selects "Confirmed"
6. Status updates immediately
7. Badge changes to blue
8. Notification sent to donor and NGO
9. Dashboard stats update in real-time

---

## Security Considerations

1. **Authentication**: All screens protected by Firebase Auth
2. **Authorization**: Admin role verified on each page load
3. **Sensitive Actions**: Confirmation dialogs for block/delete operations
4. **Session Management**: Logout clears auth state
5. **Data Privacy**: User details shown only when needed (modals)
6. **Audit Trail**: All admin actions logged (optional enhancement)

---

## Mobile Notifications

The app sends real-time notifications to users when:
- NGO status changes (approved/rejected/blocked)
- Donation status changes
- Volunteer assignment changes
- Report status updated
- Account blocked/unblocked

---

## Future Enhancements

Phase 2:
- Message moderation (reply to messages from admin)
- Advanced analytics/reports (charts, graphs)
- Batch actions (approve multiple NGOs)
- Automated reports (weekly summaries)
- Role-based sub-admin accounts

---

## File Structure

```
admin_screens/
├── 1_admin_login.jpg              # Login page
├── 2_dashboard.jpg                # Dashboard with stats
├── 3_ngo_management.jpg           # NGO management table
├── 4_donor_management.jpg         # Donor management table
├── 5_request_management.jpg       # Request/post management
├── 6_donation_management.jpg      # Donation tracking
├── 7_volunteer_management.jpg     # Volunteer management
├── 8_reports.jpg                  # Reports & complaints
├── 9_messages_monitoring.jpg      # Chat monitoring
├── 10_settings.jpg                # Settings & profile
```

All visual mockups are high-quality, professional admin interface designs suitable for production deployment.
