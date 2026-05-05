import 'package:flutter/material.dart';

/// Professional color palette for the admin panel
/// Following Material Design 3 specifications
class AdminColors {
  // Primary Colors
  static const Color primary = Color(0xFF2563EB); // Professional Blue
  static const Color primaryLight = Color(0xFFDBEAFE);
  static const Color primaryDark = Color(0xFF1E40AF);

  // Secondary Colors
  static const Color secondary = Color(0xFF10B981); // Success Green
  static const Color secondaryLight = Color(0xFFD1FAE5);
  static const Color secondaryDark = Color(0xFF059669);

  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color successLight = Color(0xFFD1FAE5);
  
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xFFFEF3C7);
  
  static const Color error = Color(0xFFEF4444);
  static const Color errorLight = Color(0xFFFEE2E2);
  
  static const Color pending = Color(0xFFF59E0B);
  static const Color pendingLight = Color(0xFFFEF3C7);

  // Neutral Colors
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceAlt = Color(0xFFF3F4F6);
  
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textTertiary = Color(0xFF9CA3AF);
  
  static const Color divider = Color(0xFFE5E7EB);
  static const Color border = Color(0xFFD1D5DB);
  
  // Sidebar Colors
  static const Color sidebarBg = Color(0xFF1F2937);
  static const Color sidebarText = Color(0xFFF3F4F6);
  static const Color sidebarActive = Color(0xFF2563EB);
  static const Color sidebarHover = Color(0xFF374151);

  // Status Badge Colors
  static const Color approvedBg = Color(0xFFD1FAE5);
  static const Color approvedText = Color(0xFF065F46);
  
  static const Color pendingBg = Color(0xFFFEF3C7);
  static const Color pendingText = Color(0xFF78350F);
  
  static const Color rejectedBg = Color(0xFFFEE2E2);
  static const Color rejectedText = Color(0xFF7F1D1D);
  
  static const Color blockedBg = Color(0xFFE5E7EB);
  static const Color blockedText = Color(0xFF374151);

  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
