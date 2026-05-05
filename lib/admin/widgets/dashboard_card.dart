import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

/// Dashboard statistics card
/// Displays count, label, icon, and optional trend
class DashboardCard extends StatelessWidget {
  final String label;
  final int count;
  final IconData icon;
  final Color? backgroundColor;
  final Color? iconColor;
  final String? trend; // e.g., "+12% from last month"
  final Color? trendColor;
  final VoidCallback? onTap;

  const DashboardCard({
    Key? key,
    required this.label,
    required this.count,
    required this.icon,
    this.backgroundColor,
    this.iconColor,
    this.trend,
    this.trendColor,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bgColor = backgroundColor ?? AdminColors.primaryLight;
    final iColor = iconColor ?? AdminColors.primary;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
        child: Container(
          decoration: BoxDecoration(
            color: AdminColors.surface,
            border: Border.all(color: AdminColors.divider),
            borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
          ),
          padding: const EdgeInsets.all(AdminTheme.paddingLg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon and Label Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: const TextStyle(
                          color: AdminColors.textSecondary,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        count.toString(),
                        style: const TextStyle(
                          color: AdminColors.textPrimary,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: bgColor,
                      borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
                    ),
                    child: Icon(
                      icon,
                      color: iColor,
                      size: 24,
                    ),
                  ),
                ],
              ),

              // Trend (Optional)
              if (trend != null) ...[
                const SizedBox(height: 12),
                Text(
                  trend!,
                  style: TextStyle(
                    color: trendColor ?? AdminColors.success,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Mini card for dashboard (smaller variant)
class MiniDashboardCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color? backgroundColor;
  final Color? iconColor;

  const MiniDashboardCard({
    Key? key,
    required this.label,
    required this.value,
    required this.icon,
    this.backgroundColor,
    this.iconColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bgColor = backgroundColor ?? AdminColors.primaryLight;
    final iColor = iconColor ?? AdminColors.primary;

    return Container(
      decoration: BoxDecoration(
        color: AdminColors.surface,
        border: Border.all(color: AdminColors.divider),
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      padding: const EdgeInsets.all(AdminTheme.paddingMd),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
            ),
            child: Icon(
              icon,
              color: iColor,
              size: 20,
            ),
          ),
          const SizedBox(width: AdminTheme.paddingMd),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    color: AdminColors.textSecondary,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    color: AdminColors.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
