import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// Firebase Authentication service for admin login
/// Verifies user role and provides auth state management
class AdminAuthService {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Stream of authentication state changes
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  /// Get current logged-in user
  User? get currentUser => _firebaseAuth.currentUser;

  /// Admin login with email and password
  /// Verifies that user has admin role in Firestore
  /// 
  /// Returns: Map with 'success' boolean and optional 'message' for errors
  /// 
  /// NOTE: Adjust the 'role' field name if your users collection uses different field name
  /// Common variations: userRole, userType, permissions, admin_role
  Future<Map<String, dynamic>> loginAsAdmin({
    required String email,
    required String password,
  }) async {
    try {
      // Authenticate with Firebase Auth
      final userCredential = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;
      if (user == null) {
        return {
          'success': false,
          'message': 'Authentication failed. User not found.',
        };
      }

      // Verify admin role in Firestore
      final userDoc = await _firestore.collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        await _firebaseAuth.signOut();
        return {
          'success': false,
          'message': 'User profile not found in database.',
        };
      }

      // NOTE: 'role' field - Update this if your users collection uses a different field name
      // TODO: Confirm this matches your user_model.dart field structure
      // Common alternatives: userRole, userType, type, admin
      final userRole = userDoc.get('role') as String?;

      if (userRole != 'admin') {
        await _firebaseAuth.signOut();
        return {
          'success': false,
          'message': 'Access denied. Admin privileges required.',
        };
      }

      return {
        'success': true,
        'message': 'Login successful',
        'user': user,
      };
    } on FirebaseAuthException catch (e) {
      String errorMessage = 'Login failed';

      if (e.code == 'user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (e.code == 'wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (e.code == 'invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (e.code == 'user-disabled') {
        errorMessage = 'This account has been disabled.';
      }

      return {
        'success': false,
        'message': errorMessage,
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'An unexpected error occurred: $e',
      };
    }
  }

  /// Check if current user is admin
  /// Returns true if logged in and has admin role
  Future<bool> isCurrentUserAdmin() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return false;

    try {
      final userDoc = await _firestore.collection('users').doc(user.uid).get();
      
      // NOTE: 'role' field - Update if your app uses different field name
      final userRole = userDoc.get('role') as String?;
      return userRole == 'admin';
    } catch (e) {
      print('[AdminAuthService] Error checking admin status: $e');
      return false;
    }
  }

  /// Get admin user details from Firestore
  /// NOTE: Field names - Update these based on your user_model.dart
  /// Common fields: email, name, phone, photoUrl, createdAt, lastLogin
  Future<Map<String, dynamic>?> getAdminProfile() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return null;

    try {
      final userDoc = await _firestore.collection('users').doc(user.uid).get();
      if (!userDoc.exists) return null;

      return userDoc.data();
    } catch (e) {
      print('[AdminAuthService] Error fetching admin profile: $e');
      return null;
    }
  }

  /// Logout current admin user
  Future<void> logout() async {
    try {
      await _firebaseAuth.signOut();
    } catch (e) {
      print('[AdminAuthService] Error during logout: $e');
      rethrow;
    }
  }

  /// Check if user is authenticated
  bool get isAuthenticated => _firebaseAuth.currentUser != null;
}
