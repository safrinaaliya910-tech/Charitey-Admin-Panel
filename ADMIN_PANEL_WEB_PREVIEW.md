# Charitey Admin Panel - Web Preview Guide

## Overview

This is a **React/Next.js web preview** of the Charitey Admin Panel. It's a visual mockup designed to match the Flutter design specifications exactly, allowing you to preview the UI/UX before implementing the actual Flutter code.

## Accessing the Admin Panel Preview

Once the development server is running (`npm run dev` or `pnpm dev`), navigate to:

```
http://localhost:3000/admin
```

## Available Admin Pages

### 1. Dashboard (`/admin`)
- 8 stat cards showing real-time metrics
- Recent activity feed with latest actions
- Color-coded statistics
- Visual indicators for trends

**Stats Displayed:**
- Total NGOs: 234
- Active Donors: 1,250
- Open Requests: 89
- Total Donations: $45,230
- Pending Approvals: 12
- Completed Donations: 567
- Blocked Users: 3
- Active Volunteers: 456

### 2. Users Management (`/admin/users`)
Manage both NGOs and Donors with the following features:
- Search by name or email
- Filter by role (NGO/Donor) and status (pending/approved/active/blocked/rejected)
- View user details
- Approve/Reject NGO applications
- Block/Unblock users
- Status badges with color coding
- Sortable table with all user information

**Sample Actions:**
- Approve pending NGOs
- Block suspicious donors
- View donor donation history

### 3. Posts/Requests Management (`/admin/posts`)
Manage NGO requests and posts:
- Search by title or NGO name
- Filter by category and status
- Category badges (Healthcare, Food, Education, Water & Sanitation, Emergency, Clothing)
- Status tracking (Active, Fulfilled, Partial)
- Mark requests as fulfilled
- Delete posts with confirmation
- View complete post details

**Status Colors:**
- Blue: Active requests
- Green: Fulfilled requests
- Orange: Partially fulfilled

### 4. Donations Management (`/admin/donations`)
Track and manage donations:
- Search by donor or NGO name
- Filter by status (Pending, Confirmed, Completed, Cancelled)
- Update donation status with dropdown selector
- View related donor/NGO details
- Amount tracking
- Timeline view of donation flow

**Donation Flow:**
1. Pending (awaiting confirmation)
2. Confirmed (ready for delivery)
3. Completed (successfully delivered)
4. Cancelled (not completed)

### 5. Volunteers Management (`/admin/volunteers`)
Manage volunteer information:
- Search by name or NGO
- Filter by status and availability
- Status indicators (Available, Unavailable, Blocked)
- Availability tracking (Weekends, Evenings, Full-time, etc.)
- View assigned tasks
- Block/Unblock volunteers
- Join date tracking

### 6. Messages Monitoring (`/admin/messages`)
Read-only chat monitoring (Phase 1):
- Two-column layout (conversation list + message thread)
- Search conversations by participant name
- Filter for reported chats
- View complete message history
- Identify conversations with violations
- Red alert flag for reported chats
- Participant names and timestamps
- Read-only interface (no send capabilities)

### 7. Notifications Management (`/admin/notifications`)
View and manage system notifications:
- Search by recipient or notification title
- Filter by notification type (Donation, Approval, Request, System, Warning)
- Filter by read status (Read/Unread)
- Color-coded notification types
- Visual indicators for unread notifications
- View notification details
- Delete notifications
- Type badges for quick identification

**Notification Types:**
- Pink: Donation notifications
- Green: Approval notifications
- Blue: Request notifications
- Purple: System notifications
- Red: Warning notifications

### 8. Settings (`/admin/settings`)
Admin profile and preferences:
- View admin account information
- Read-only profile display
- App information and version
- Preference toggles:
  - Dark mode
  - Email notifications
  - Activity feed display
- Security options:
  - Change password form
  - Password update flow
- Logout functionality with confirmation
- Role badge display (Administrator)

## Color Scheme

The admin panel uses a professional Material Design 3 color scheme:

### Primary Colors
- **Blue**: Navigation, primary actions, active states (#1E88E5, #1976D2)
- **Green**: Approved, completed, success states (#43A047, #2E7D32)
- **Red**: Blocked, rejected, dangerous actions (#E53935, #C62828)
- **Orange**: Pending, in-progress states (#FFA726, #F57C00)
- **Gray**: Neutral, secondary content (#6B7280, #E5E7EB)

### Status Badges
- **Green**: Approved, Active, Completed
- **Yellow**: Pending, Partial
- **Red**: Blocked, Rejected, Cancelled
- **Blue**: Confirmed
- **Gray**: Unavailable, Archived

## Interactive Features

### Search Functionality
- Real-time search across multiple fields
- Case-insensitive matching
- Instant filter updates
- Works on tables and lists

### Filter System
- Multiple filter types per page
- Dropdown selectors for status, role, category, etc.
- Combined filtering (search + filters work together)
- Reset filters by selecting "all"

### Data Tables
- Hover effects on rows
- Action buttons with icons
- Responsive layout (scrolls on mobile)
- Pagination indicators
- Status badges integrated into tables

### Dialogs & Modals
- Confirmation dialogs for destructive actions
- Status update dropdowns
- View details functionality
- Safe action patterns

### Toggle Switches
- Dark mode toggle
- Notification preferences
- Activity feed toggle
- Smooth animations

## Responsive Design

The preview is fully responsive:
- **Desktop**: Full sidebar + multi-column layouts
- **Tablet**: Collapsible sidebar for space
- **Mobile**: Stack layout with hamburger menu

### Responsive Elements
- Sidebar collapses to icons on smaller screens
- Grid layouts stack to single column on mobile
- Tables become scrollable on mobile devices
- Two-column chat layout becomes single column on mobile

## Design System

### Typography
- Headings: Bold, large sizes for hierarchy
- Body text: Regular weight, readable sizes
- Small text: Secondary information, captions
- Monospace fonts available for codes

### Spacing
- Consistent padding and margins
- Grid-based spacing scale
- Adequate whitespace for readability
- Clear visual hierarchy through spacing

### Components
- Cards with subtle shadows
- Rounded corners (8px border radius)
- Clean buttons with hover effects
- Input fields with focus states
- Badges for status/category display
- Icons from Lucide React

## Navigation

### Sidebar Menu Items
1. Dashboard (📊)
2. Users Management (👥)
3. Posts/Requests (📝)
4. Donations (💝)
5. Volunteers (🤝)
6. Messages (💬)
7. Notifications (🔔)
8. Settings (⚙️)

### Active Route Highlighting
- Current page shows blue background
- Hover effects on menu items
- Smooth transitions between pages

## Sample Data

The preview includes realistic sample data:
- Multiple NGOs with different statuses
- Donor accounts with transactions
- Posts in various categories
- Donation records at different stages
- Volunteer information with availability
- Message conversations with participants
- Notification records
- User activity feed

## Features Ready for Flutter Implementation

All screens and features in this preview are ready to be implemented in Flutter:

1. **Layout Structure**: Sidebar + main content pattern translates to Flutter's Row + Column
2. **Data Tables**: Material DataTable equivalent in Flutter
3. **Forms**: Material TextField widgets
4. **Buttons**: Material Button and IconButton widgets
5. **Cards**: Material Card widget
6. **Dialogs**: Material Dialog/AlertDialog in Flutter
7. **Navigation**: Flutter's Navigator or GoRouter
8. **State Management**: Can use Provider, Riverpod, or GetX
9. **Firebase Integration**: FirebaseAuth + Firestore
10. **Styling**: Material Design 3 ThemeData in Flutter

## Next Steps

1. **Review the preview** to understand the UI/UX flow
2. **Refer to the Flutter code** in `/lib/admin/` for implementation details
3. **Update field mappings** in `admin_service.dart` based on your actual Firestore schema
4. **Create admin user** in Firestore with `role='admin'`
5. **Test with real data** from your Firebase project
6. **Customize colors** in `admin_theme.dart` to match your app branding

## Technical Stack (Preview)

- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)
- **Routing**: Next.js App Router
- **Database**: Mock data (ready for Firebase integration)

## Technical Stack (Flutter Implementation)

- **Framework**: Flutter
- **UI Kit**: Material Design 3
- **Backend**: Firebase Firestore + Auth
- **State Management**: StreamBuilder + FutureBuilder (or Provider/Riverpod)
- **Navigation**: Navigator 2.0 or GoRouter
- **Icons**: Material Icons

## File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard
│   ├── users/
│   │   └── page.tsx            # Users management
│   ├── posts/
│   │   └── page.tsx            # Posts/Requests
│   ├── donations/
│   │   └── page.tsx            # Donations
│   ├── volunteers/
│   │   └── page.tsx            # Volunteers
│   ├── messages/
│   │   └── page.tsx            # Messages monitoring
│   ├── notifications/
│   │   └── page.tsx            # Notifications
│   └── settings/
│       └── page.tsx            # Settings
```

## Notes

- This is a **visual preview only** - no actual Firebase integration in the web version
- All data is hardcoded for demonstration purposes
- The Flutter implementation will have live Firebase data
- Use this preview as a reference for UI/UX implementation in Flutter
- All screen layouts match the Flutter design mockups exactly

## Quick Start

```bash
# Install dependencies (if not already done)
pnpm install

# Run development server
pnpm dev

# Open in browser
# Navigate to http://localhost:3000/admin
```

Enjoy exploring the Charitey Admin Panel preview!
