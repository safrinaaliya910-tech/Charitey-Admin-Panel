import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

/// Empty state display for no data scenarios
class EmptyStateWidget extends StatelessWidget {
  final String title;
  final String message;
  final IconData icon;
  final Color? iconColor;
  final String? actionButtonText;
  final VoidCallback? onActionTap;

  const EmptyStateWidget({
    Key? key,
    required this.title,
    required this.message,
    this.icon = Icons.inbox,
    this.iconColor,
    this.actionButtonText,
    this.onActionTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AdminTheme.paddingXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AdminColors.surfaceAlt,
                borderRadius: BorderRadius.circular(AdminTheme.radiusLg),
              ),
              child: Icon(
                icon,
                size: 48,
                color: iconColor ?? AdminColors.textTertiary,
              ),
            ),
            const SizedBox(height: AdminTheme.paddingLg),
            Text(
              title,
              style: const TextStyle(
                color: AdminColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AdminTheme.paddingMd),
            Text(
              message,
              style: const TextStyle(
                color: AdminColors.textSecondary,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            if (actionButtonText != null) ...[
              const SizedBox(height: AdminTheme.paddingLg),
              ElevatedButton(
                onPressed: onActionTap,
                child: Text(actionButtonText!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Error state display
class ErrorStateWidget extends StatelessWidget {
  final String title;
  final String message;
  final String? actionButtonText;
  final VoidCallback? onActionTap;
  final String? errorDetails;

  const ErrorStateWidget({
    Key? key,
    required this.title,
    required this.message,
    this.actionButtonText,
    this.onActionTap,
    this.errorDetails,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AdminTheme.paddingXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AdminColors.errorLight,
                borderRadius: BorderRadius.circular(AdminTheme.radiusLg),
              ),
              child: const Icon(
                Icons.error,
                size: 48,
                color: AdminColors.error,
              ),
            ),
            const SizedBox(height: AdminTheme.paddingLg),
            Text(
              title,
              style: const TextStyle(
                color: AdminColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AdminTheme.paddingMd),
            Text(
              message,
              style: const TextStyle(
                color: AdminColors.textSecondary,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            if (errorDetails != null) ...[
              const SizedBox(height: AdminTheme.paddingMd),
              Container(
                padding: const EdgeInsets.all(AdminTheme.paddingMd),
                decoration: BoxDecoration(
                  color: AdminColors.errorLight,
                  border: Border.all(color: AdminColors.error),
                  borderRadius: BorderRadius.circular(AdminTheme.radiusSm),
                ),
                child: Text(
                  errorDetails!,
                  style: const TextStyle(
                    color: AdminColors.error,
                    fontSize: 12,
                    fontFamily: 'monospace',
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
            if (actionButtonText != null) ...[
              const SizedBox(height: AdminTheme.paddingLg),
              ElevatedButton.icon(
                onPressed: onActionTap,
                icon: const Icon(Icons.refresh),
                label: Text(actionButtonText!),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AdminColors.error,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
