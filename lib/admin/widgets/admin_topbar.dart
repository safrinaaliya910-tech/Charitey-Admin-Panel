import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

/// Top navigation bar for admin panel
/// Displays page title, admin info, and action buttons
class AdminTopbar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String adminEmail;
  final String adminName;
  final VoidCallback? onProfileTap;
  final List<Widget>? actions;

  const AdminTopbar({
    Key? key,
    required this.title,
    required this.adminEmail,
    required this.adminName,
    this.onProfileTap,
    this.actions,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AdminColors.surface,
      elevation: 1,
      shadowColor: const Color(0x1F000000),
      title: Text(
        title,
        style: const TextStyle(
          color: AdminColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      actions: [
        // Action buttons if provided
        if (actions != null) ...actions!,

        const SizedBox(width: AdminTheme.paddingMd),

        // Admin profile button
        Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onProfileTap,
            hoverColor: AdminColors.surfaceAlt,
            borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AdminTheme.paddingMd,
                vertical: AdminTheme.paddingSm,
              ),
              child: Row(
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        adminName,
                        style: const TextStyle(
                          color: AdminColors.textPrimary,
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                      Text(
                        adminEmail,
                        style: const TextStyle(
                          color: AdminColors.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: AdminTheme.paddingMd),
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(AdminTheme.radiusLg),
                      gradient: AdminColors.primaryGradient,
                    ),
                    child: Center(
                      child: Text(
                        adminName.isNotEmpty
                            ? adminName[0].toUpperCase()
                            : 'A',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        const SizedBox(width: AdminTheme.paddingMd),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
