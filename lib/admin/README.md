# Charitey Admin Panel

A professional Flutter admin dashboard for the Charitey charity coordination app. Complete with Firebase authentication, real-time Firestore integration, and 8 management screens.

## 📋 Features

✅ **Admin Authentication** - Secure email/password login with role verification
✅ **Dashboard** - Real-time statistics and activity monitoring
✅ **Users Management** - Manage NGOs and Donors
✅ **Posts Management** - Manage NGO requests/posts
✅ **Donations Management** - Monitor donation records
✅ **Volunteers Management** - Manage volunteer assignments
✅ **Messages Monitoring** - Read-only chat monitoring (Phase 1)
✅ **Settings** - Admin profile and app information
✅ **Professional UI** - Material Design 3, responsive layout
✅ **Real-time Updates** - StreamBuilder integration with Firestore

## 📁 Project Structure

```
lib/admin/
├── admin_shell.dart                 # Main entry point
├── theme/
│   ├── admin_colors.dart           # Color palette
│   └── admin_theme.dart            # Theme configuration
├── services/
│   ├── admin_auth_service.dart     # Firebase Auth
│   └── admin_service.dart          # Firestore queries
├── widgets/
│   ├── admin_sidebar.dart          # Navigation sidebar
│   ├── admin_topbar.dart           # Top navigation
│   ├── dashboard_card.dart         # Stat cards
│   ├── status_badge.dart           # Status indicators
│   ├── confirmation_dialog.dart    # Action dialogs
│   ├── empty_state_widget.dart     # Empty states
│   └── loading_skeleton.dart       # Loading states
├── screens/
│   ├── admin_login_screen.dart     # Login page
│   ├── admin_dashboard_screen.dart # Dashboard
│   ├── users_management_screen.dart
│   ├── posts_management_screen.dart
│   ├── donations_management_screen.dart
│   ├── volunteers_management_screen.dart
│   ├── messages_monitoring_screen.dart
│   └── admin_settings_screen.dart
└── README.md                        # This file
```

## 🚀 Quick Start

### 1. Add to Your Main App

Import the admin shell into your main `main.dart`:

```dart
import 'package:your_app/admin/admin_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const AdminShell(), // Use AdminShell for admin panel
      // OR
      home: const HomePage(), // Use regular app for normal users
    );
  }
}
```

### 2. Update Firestore Field Names

The admin panel uses placeholder field names with comments. Update them to match your app:

**In `admin_service.dart`:**

Search for `NOTE:` comments and update field names:

```dart
// Example - Find this:
final status = user['status'] ?? 'pending';

// If your app uses 'userStatus' instead of 'status':
final status = user['userStatus'] ?? 'pending';
```

**Common field name variations to check:**

- **User model**: `name`, `email`, `role`, `status`, `phone`, `createdAt`
- **Post model**: `title`, `description`, `category`, `ngoId`, `status`, `createdAt`
- **Donation model**: `donorId`, `ngoId`, `postId`, `status`, `amount`, `createdAt`
- **Volunteer model**: `name`, `ngoId`, `status`, `createdAt`, `phone`
- **Message model**: `senderId`, `receiverId`, `text`, `createdAt`
- **Notification model**: `userId`, `title`, `body`, `isRead`, `createdAt`

### 3. Ensure Firestore Collections Exist

The admin panel uses these existing collections (no new collections created):

```
Firestore
├── users          (NGOs and Donors with role field)
├── posts          (NGO requests/posts)
├── donations      (Donation records)
├── volunteers     (Volunteer assignments)
├── messages       (Chat messages)
└── notifications  (Alerts/notifications)
```

### 4. Set Up Admin Role in Firestore

Create an admin user in your `users` collection:

```json
{
  "uid": "admin_user_id",
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "admin",
  "status": "approved",
  "phone": "+1234567890",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Important**: The `role` field must be set to `"admin"` for login to work.

### 5. Test Login

1. Build and run your app
2. Navigate to the admin panel (or set AdminShell as home)
3. Login with admin credentials
4. Admin role verification will check Firestore users collection

## 🔧 Customization

### Updating Field Names

All Firestore field mappings are in `admin_service.dart`. The file includes inline comments for each collection:

```dart
// ==================== USERS MANAGEMENT ====================

/// Fetch all NGO users
/// NOTE: 'role' field - Update if your app uses 'userRole', 'type', etc.
/// NOTE: Expected fields in users doc: name, email, phone, status, createdAt, role
Stream<QuerySnapshot> getNGOsStream() {
  return _firestore
      .collection('users')
      .where('role', isEqualTo: 'ngo')  // <- Update field name here if needed
      .orderBy('createdAt', descending: true)
      .snapshots();
}
```

### Changing Colors

Edit `admin/theme/admin_colors.dart` to customize the color scheme:

```dart
static const Color primary = Color(0xFF2563EB); // Change primary color
static const Color success = Color(0xFF10B981); // Change success color
```

### Adding New Screens

1. Create a new screen file in `screens/`
2. Add navigation item in `admin_shell.dart`
3. Create method in `admin_service.dart` for queries

## 📱 Responsive Design

The admin panel is responsive:

- **Desktop (>900px width)**: Sidebar + full content
- **Tablet/Mobile**: Single column layout with drawer navigation

## 🔐 Security

- **Firebase Auth**: Uses email/password authentication
- **Role Verification**: Checks admin role in Firestore users collection
- **RLS Ready**: Compatible with Row Level Security policies
- **Session Management**: Secure logout and session handling

## 📊 Dashboard Features

**Statistics Cards:**
- Total NGOs
- Total Donors
- Posts/Requests
- Total Donations
- Pending Actions
- Completed Donations
- Volunteers
- Blocked Users

**Recent Activity:**
- Recent donations list
- Recent users registration

## 🛠️ Admin Operations

### Users
- View all users (NGOs and Donors)
- Search by name/email
- Filter by role and status
- Approve/Reject/Block users
- View user details

### Posts
- View all posts (NGO requests)
- Search and filter by status/category
- Update post status
- Delete posts (soft-delete)
- View post details

### Donations
- Monitor donation records
- Filter by status
- Update donation status
- View donation details

### Volunteers
- Manage volunteers
- View assignments
- Update availability
- Block/Unblock volunteers

### Messages
- Monitor conversations (read-only Phase 1)
- Search messages
- View message preview
- Participant information

## ⚙️ Integration with Existing App

### Reusing Models

Import existing models directly:

```dart
import 'package:your_app/models/user_model.dart';
import 'package:your_app/models/post_model.dart';
import 'package:your_app/models/donation_model.dart';
```

### Using Existing Services

The admin service is separate but uses same Firebase instances:

```dart
// Both use the same Firebase project
final _firestore = FirebaseFirestore.instance;
final _auth = FirebaseAuth.instance;
```

### No Schema Changes

All admin operations use existing collections. No new tables or fields are created in Firestore.

## 🐛 Troubleshooting

### Login fails with "Access denied. Admin privileges required."

- Ensure user's `role` field in Firestore users collection is set to `"admin"`
- Verify field name matches your user_model.dart

### No data appears in dashboard

- Check Firestore field names in admin_service.dart
- Ensure collections exist: users, posts, donations, volunteers, messages
- Verify data is actually in Firestore using Firebase Console

### Styling looks different

- Ensure theme is properly applied in your MaterialApp
- Check AdminTheme.lightTheme is set in your main.dart

## 📞 Support

For issues or questions:
1. Check field name mappings in admin_service.dart
2. Verify Firestore collection structure matches expected format
3. Check browser console for error messages
4. Review admin_service.dart comments for customization guidance

## 📝 Notes

- Phase 1: Messages monitoring is read-only
- Moderation features planned for Phase 2
- All timestamps use Firestore server timestamp
- Soft deletes used for posts (status changed to 'deleted')
- Hard deletes for notifications and non-critical data

## 🎨 UI Components

- **DashboardCard**: Display statistics with icon
- **StatusBadge**: Color-coded status indicators
- **ConfirmationDialog**: Safe action confirmation
- **EmptyStateWidget**: "No data" display
- **LoadingSkeleton**: Shimmer loading animation
- **AdminSidebar**: Navigation menu
- **AdminTopbar**: Header with user info

All components are reusable and customizable.

---

**Admin Panel Version**: 1.0.0
**Last Updated**: 2024
**Compatible with**: Charitey app with Firebase
