import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

/// Status badge for displaying colored status indicators
/// Automatically colors based on status value
class StatusBadge extends StatelessWidget {
  final String status;
  final double? fontSize;
  final EdgeInsetsGeometry? padding;

  const StatusBadge({
    Key? key,
    required this.status,
    this.fontSize,
    this.padding,
  }) : super(key: key);

  /// Get colors based on status
  Map<String, Color> _getColors(String status) {
    final lowerStatus = status.toLowerCase();

    if (lowerStatus == 'approved' ||
        lowerStatus == 'active' ||
        lowerStatus == 'completed' ||
        lowerStatus == 'confirmed' ||
        lowerStatus == 'available') {
      return {
        'bg': AdminColors.approvedBg,
        'text': AdminColors.approvedText,
      };
    } else if (lowerStatus == 'pending') {
      return {
        'bg': AdminColors.pendingBg,
        'text': AdminColors.pendingText,
      };
    } else if (lowerStatus == 'rejected' ||
        lowerStatus == 'cancelled' ||
        lowerStatus == 'blocked' ||
        lowerStatus == 'unavailable') {
      return {
        'bg': AdminColors.rejectedBg,
        'text': AdminColors.rejectedText,
      };
    } else if (lowerStatus == 'archived' || lowerStatus == 'deleted') {
      return {
        'bg': AdminColors.blockedBg,
        'text': AdminColors.blockedText,
      };
    }

    // Default
    return {
      'bg': AdminColors.surfaceAlt,
      'text': AdminColors.textSecondary,
    };
  }

  @override
  Widget build(BuildContext context) {
    final colors = _getColors(status);
    final displayStatus = status[0].toUpperCase() + status.substring(1);

    return Container(
      padding: padding ??
          const EdgeInsets.symmetric(
            horizontal: 10,
            vertical: 4,
          ),
      decoration: BoxDecoration(
        color: colors['bg'],
        borderRadius: BorderRadius.circular(AdminTheme.radiusSm),
      ),
      child: Text(
        displayStatus,
        style: TextStyle(
          color: colors['text'],
          fontSize: fontSize ?? 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

/// Small dot indicator for status
class StatusIndicator extends StatelessWidget {
  final String status;
  final double size;

  const StatusIndicator({
    Key? key,
    required this.status,
    this.size = 8,
  }) : super(key: key);

  Color _getColor(String status) {
    final lowerStatus = status.toLowerCase();

    if (lowerStatus == 'approved' ||
        lowerStatus == 'active' ||
        lowerStatus == 'completed' ||
        lowerStatus == 'confirmed' ||
        lowerStatus == 'available') {
      return AdminColors.success;
    } else if (lowerStatus == 'pending') {
      return AdminColors.warning;
    } else if (lowerStatus == 'rejected' ||
        lowerStatus == 'cancelled' ||
        lowerStatus == 'blocked' ||
        lowerStatus == 'unavailable') {
      return AdminColors.error;
    } else if (lowerStatus == 'archived' || lowerStatus == 'deleted') {
      return AdminColors.textTertiary;
    }

    return AdminColors.textSecondary;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _getColor(status),
        shape: BoxShape.circle,
      ),
    );
  }
}
