import 'package:cloud_firestore/cloud_firestore.dart';

/// Main Firestore service for admin operations
/// All queries include field name comments for easy customization
/// 
/// IMPORTANT: This service uses your existing app collections:
/// - users (for NGOs and Donors, filter by role field)
/// - posts (for NGO requests/posts)
/// - donations (for donation records)
/// - volunteers (for volunteer assignments)
/// - messages (for chat monitoring)
/// - notifications (for alerts/notifications)
/// 
/// Field names are parameterized where possible. Comments indicate where field names
/// may differ based on your actual app's model definitions.
class AdminService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // ==================== USERS MANAGEMENT ====================

  /// Fetch all NGO users
  /// NOTE: 'role' field - Update if your app uses 'userRole', 'type', etc.
  /// NOTE: Expected fields in users doc: name, email, phone, status, createdAt, role
  Stream<QuerySnapshot> getNGOsStream() {
    return _firestore
        .collection('users')
        .where('role', isEqualTo: 'ngo')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch all Donor users
  /// NOTE: 'role' field - Update if your app uses different field name
  Stream<QuerySnapshot> getDonorsStream() {
    return _firestore
        .collection('users')
        .where('role', isEqualTo: 'donor')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch single user document
  Future<DocumentSnapshot> getUser(String userId) {
    return _firestore.collection('users').doc(userId).get();
  }

  /// Update user status
  /// NOTE: 'status' field - Update if your app uses 'userStatus', 'accountStatus', etc.
  /// Status values: pending, approved, rejected, blocked, active
  Future<void> updateUserStatus({
    required String userId,
    required String status,
  }) {
    return _firestore.collection('users').doc(userId).update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Block/Unblock a user
  Future<void> updateUserBlockStatus({
    required String userId,
    required bool isBlocked,
  }) {
    return _firestore.collection('users').doc(userId).update({
      'isBlocked': isBlocked,
      'blockedAt': isBlocked ? FieldValue.serverTimestamp() : FieldValue.delete(),
    });
  }

  /// Search users by name or email
  /// NOTE: Adjust field names based on your user_model.dart
  /// TODO: 'name' and 'email' fields - Confirm these match your structure
  Future<QuerySnapshot> searchUsers(String query) {
    final lowerQuery = query.toLowerCase();
    return _firestore
        .collection('users')
        .where('nameSearch', arrayContains: lowerQuery)
        .get();
  }

  // ==================== POSTS MANAGEMENT (NGO Requests) ====================

  /// Fetch all posts (NGO requests)
  /// NOTE: 'ngoId', 'status', 'createdAt' - Update field names to match post_model.dart
  /// Expected fields: ngoId, title, description, category, status, createdAt
  Stream<QuerySnapshot> getPostsStream() {
    return _firestore
        .collection('posts')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch posts by specific NGO
  /// NOTE: 'ngoId' field - Update if your posts use 'userId', 'organizationId', etc.
  Stream<QuerySnapshot> getPostsByNGO(String ngoId) {
    return _firestore
        .collection('posts')
        .where('ngoId', isEqualTo: ngoId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch single post document
  Future<DocumentSnapshot> getPost(String postId) {
    return _firestore.collection('posts').doc(postId).get();
  }

  /// Update post status
  /// NOTE: 'status' field - Confirm field name matches post_model.dart
  /// Status values: active, fulfilled, archived, deleted
  Future<void> updatePostStatus({
    required String postId,
    required String status,
  }) {
    return _firestore.collection('posts').doc(postId).update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Delete a post
  /// NOTE: Can either soft-delete (update status to 'deleted') or hard-delete
  /// This soft-deletes the post
  Future<void> deletePost(String postId) {
    return _firestore.collection('posts').doc(postId).update({
      'status': 'deleted',
      'deletedAt': FieldValue.serverTimestamp(),
    });
  }

  // ==================== DONATIONS MANAGEMENT ====================

  /// Fetch all donations
  /// NOTE: Field names - Update to match donation_model.dart
  /// Expected fields: donorId, ngoId, postId/requestId, status, amount, createdAt
  Stream<QuerySnapshot> getDonationsStream() {
    return _firestore
        .collection('donations')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch donations by status
  /// NOTE: 'status' field - Common values: pending, confirmed, completed, cancelled
  Stream<QuerySnapshot> getDonationsByStatus(String status) {
    return _firestore
        .collection('donations')
        .where('status', isEqualTo: status)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch donations by NGO
  /// NOTE: 'ngoId' field - Update if your app uses 'organizationId', 'recipientId', etc.
  Stream<QuerySnapshot> getDonationsByNGO(String ngoId) {
    return _firestore
        .collection('donations')
        .where('ngoId', isEqualTo: ngoId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch donations by donor
  /// NOTE: 'donorId' field - Update if your app uses 'userId', 'contributorId', etc.
  Stream<QuerySnapshot> getDonationsByDonor(String donorId) {
    return _firestore
        .collection('donations')
        .where('donorId', isEqualTo: donorId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch single donation document
  Future<DocumentSnapshot> getDonation(String donationId) {
    return _firestore.collection('donations').doc(donationId).get();
  }

  /// Update donation status
  /// NOTE: 'status' field - Confirm field name in donation_model.dart
  /// Status values: pending, confirmed, completed, cancelled
  Future<void> updateDonationStatus({
    required String donationId,
    required String status,
  }) {
    return _firestore.collection('donations').doc(donationId).update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
      if (status == 'completed') 'completedAt': FieldValue.serverTimestamp(),
    });
  }

  // ==================== VOLUNTEERS MANAGEMENT ====================

  /// Fetch all volunteers
  /// NOTE: Field names - Update to match volunteer_request_model.dart
  /// Expected fields: userId, name, ngoId, status, createdAt
  Stream<QuerySnapshot> getVolunteersStream() {
    return _firestore
        .collection('volunteers')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch volunteers by NGO
  /// NOTE: 'ngoId' field - Update if your app uses 'organizationId', etc.
  Stream<QuerySnapshot> getVolunteersByNGO(String ngoId) {
    return _firestore
        .collection('volunteers')
        .where('ngoId', isEqualTo: ngoId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch volunteers by status
  /// NOTE: 'status' field - Common values: available, unavailable, blocked
  Stream<QuerySnapshot> getVolunteersByStatus(String status) {
    return _firestore
        .collection('volunteers')
        .where('status', isEqualTo: status)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch single volunteer document
  Future<DocumentSnapshot> getVolunteer(String volunteerId) {
    return _firestore.collection('volunteers').doc(volunteerId).get();
  }

  /// Update volunteer status
  /// NOTE: 'status' field - Confirm field name in your app
  /// Status values: available, unavailable, blocked
  Future<void> updateVolunteerStatus({
    required String volunteerId,
    required String status,
  }) {
    return _firestore.collection('volunteers').doc(volunteerId).update({
      'status': status,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Block/Unblock a volunteer
  Future<void> updateVolunteerBlockStatus({
    required String volunteerId,
    required bool isBlocked,
  }) {
    return _firestore.collection('volunteers').doc(volunteerId).update({
      'isBlocked': isBlocked,
      'blockedAt': isBlocked ? FieldValue.serverTimestamp() : FieldValue.delete(),
    });
  }

  // ==================== MESSAGES MANAGEMENT (Chat Monitoring) ====================

  /// Fetch all recent messages
  /// NOTE: Field names - Update to match message_model.dart
  /// Expected fields: senderId, receiverId, text, createdAt
  Stream<QuerySnapshot> getMessagesStream({int limit = 100}) {
    return _firestore
        .collection('messages')
        .orderBy('createdAt', descending: true)
        .limit(limit)
        .snapshots();
  }

  /// Fetch messages between two users
  /// NOTE: 'senderId' and 'receiverId' fields - Update if your app uses different names
  Stream<QuerySnapshot> getConversation({
    required String userId1,
    required String userId2,
  }) {
    return _firestore
        .collection('messages')
        .where('senderId', isEqualTo: userId1)
        .where('receiverId', isEqualTo: userId2)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch single message document
  Future<DocumentSnapshot> getMessage(String messageId) {
    return _firestore.collection('messages').doc(messageId).get();
  }

  // ==================== NOTIFICATIONS MANAGEMENT ====================

  /// Fetch all notifications
  /// NOTE: Field names - Update to match notification_model.dart
  /// Expected fields: userId, title, body, type, status, createdAt
  Stream<QuerySnapshot> getNotificationsStream() {
    return _firestore
        .collection('notifications')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch notifications for specific user
  /// NOTE: 'userId' field - Update if your app uses 'recipientId', etc.
  Stream<QuerySnapshot> getNotificationsByUser(String userId) {
    return _firestore
        .collection('notifications')
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Fetch unread notifications
  /// NOTE: 'isRead' field - Update if your app uses 'read', 'viewed', etc.
  Stream<QuerySnapshot> getUnreadNotifications() {
    return _firestore
        .collection('notifications')
        .where('isRead', isEqualTo: false)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Update notification status
  /// NOTE: 'isRead' field - Update to match your app's notification structure
  Future<void> markNotificationAsRead(String notificationId) {
    return _firestore.collection('notifications').doc(notificationId).update({
      'isRead': true,
      'readAt': FieldValue.serverTimestamp(),
    });
  }

  /// Delete notification
  Future<void> deleteNotification(String notificationId) {
    return _firestore.collection('notifications').doc(notificationId).delete();
  }

  // ==================== DASHBOARD STATISTICS ====================

  /// Get total count of NGOs
  /// NOTE: 'role' field - Update if different in your users collection
  Future<int> getNGOCount() async {
    try {
      final query = await _firestore
          .collection('users')
          .where('role', isEqualTo: 'ngo')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting NGO count: $e');
      return 0;
    }
  }

  /// Get total count of donors
  /// NOTE: 'role' field - Update if different in your users collection
  Future<int> getDonorCount() async {
    try {
      final query = await _firestore
          .collection('users')
          .where('role', isEqualTo: 'donor')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting donor count: $e');
      return 0;
    }
  }

  /// Get total count of posts
  Future<int> getPostCount() async {
    try {
      final query = await _firestore
          .collection('posts')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting post count: $e');
      return 0;
    }
  }

  /// Get total count of donations
  Future<int> getDonationCount() async {
    try {
      final query = await _firestore
          .collection('donations')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting donation count: $e');
      return 0;
    }
  }

  /// Get total count of volunteers
  Future<int> getVolunteerCount() async {
    try {
      final query = await _firestore
          .collection('volunteers')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting volunteer count: $e');
      return 0;
    }
  }

  /// Get count of pending donations
  /// NOTE: 'status' field - Update if different in donations collection
  Future<int> getPendingDonationCount() async {
    try {
      final query = await _firestore
          .collection('donations')
          .where('status', isEqualTo: 'pending')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting pending donation count: $e');
      return 0;
    }
  }

  /// Get count of completed donations
  Future<int> getCompletedDonationCount() async {
    try {
      final query = await _firestore
          .collection('donations')
          .where('status', isEqualTo: 'completed')
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting completed donation count: $e');
      return 0;
    }
  }

  /// Get count of blocked users
  /// NOTE: 'isBlocked' field - Update if your app uses 'blocked', 'banned', etc.
  Future<int> getBlockedUserCount() async {
    try {
      final query = await _firestore
          .collection('users')
          .where('isBlocked', isEqualTo: true)
          .count()
          .get();
      return query.count ?? 0;
    } catch (e) {
      print('[AdminService] Error getting blocked user count: $e');
      return 0;
    }
  }

  /// Get dashboard statistics as a single map
  Future<Map<String, int>> getDashboardStats() async {
    try {
      final ngoCount = await getNGOCount();
      final donorCount = await getDonorCount();
      final postCount = await getPostCount();
      final donationCount = await getDonationCount();
      final volunteerCount = await getVolunteerCount();
      final pendingCount = await getPendingDonationCount();
      final completedCount = await getCompletedDonationCount();
      final blockedCount = await getBlockedUserCount();

      return {
        'ngos': ngoCount,
        'donors': donorCount,
        'posts': postCount,
        'donations': donationCount,
        'volunteers': volunteerCount,
        'pending': pendingCount,
        'completed': completedCount,
        'blocked': blockedCount,
      };
    } catch (e) {
      print('[AdminService] Error getting dashboard stats: $e');
      return {};
    }
  }
}
