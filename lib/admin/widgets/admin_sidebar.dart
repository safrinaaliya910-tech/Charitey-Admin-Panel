import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

class AdminSidebarItem {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool isActive;

  AdminSidebarItem({
    required this.label,
    required this.icon,
    required this.onTap,
    this.isActive = false,
  });
}

/// Sidebar navigation for admin panel
/// Displays app logo, admin name, and navigation items
class AdminSidebar extends StatelessWidget {
  final String adminName;
  final List<AdminSidebarItem> items;
  final VoidCallback onLogout;

  const AdminSidebar({
    Key? key,
    required this.adminName,
    required this.items,
    required this.onLogout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280,
      color: AdminColors.sidebarBg,
      child: Column(
        children: [
          // Logo and App Name
          Container(
            padding: const EdgeInsets.all(AdminTheme.paddingLg),
            color: AdminColors.sidebarBg,
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
                    gradient: AdminColors.primaryGradient,
                  ),
                  child: const Center(
                    child: Text(
                      'C',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: AdminTheme.paddingMd),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Charitey',
                        style: TextStyle(
                          color: AdminColors.sidebarText,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      Text(
                        'Admin Panel',
                        style: TextStyle(
                          color: AdminColors.textTertiary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const Divider(color: AdminColors.sidebarHover, height: 1),

          // Admin Profile Section
          Container(
            padding: const EdgeInsets.all(AdminTheme.paddingMd),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Logged in as',
                  style: TextStyle(
                    color: AdminColors.textTertiary,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  adminName,
                  style: const TextStyle(
                    color: AdminColors.sidebarText,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),

          const Divider(color: AdminColors.sidebarHover, height: 1),

          // Navigation Items
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: items
                    .map((item) => _SidebarNavigationItem(item: item))
                    .toList(),
              ),
            ),
          ),

          const Divider(color: AdminColors.sidebarHover, height: 1),

          // Logout Button
          Padding(
            padding: const EdgeInsets.all(AdminTheme.paddingMd),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onLogout,
                icon: const Icon(Icons.logout),
                label: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AdminColors.error,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Individual sidebar navigation item
class _SidebarNavigationItem extends StatelessWidget {
  final AdminSidebarItem item;

  const _SidebarNavigationItem({
    Key? key,
    required this.item,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: item.onTap,
        hoverColor: AdminColors.sidebarHover,
        child: Container(
          color: item.isActive ? AdminColors.sidebarActive : Colors.transparent,
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AdminTheme.paddingMd,
              vertical: AdminTheme.paddingMd,
            ),
            child: Row(
              children: [
                Icon(
                  item.icon,
                  size: 20,
                  color: item.isActive
                      ? Colors.white
                      : AdminColors.sidebarText,
                ),
                const SizedBox(width: AdminTheme.paddingMd),
                Expanded(
                  child: Text(
                    item.label,
                    style: TextStyle(
                      color: item.isActive
                          ? Colors.white
                          : AdminColors.sidebarText,
                      fontWeight: item.isActive
                          ? FontWeight.w600
                          : FontWeight.w500,
                      fontSize: 14,
                    ),
                  ),
                ),
                if (item.isActive)
                  Container(
                    width: 3,
                    height: 24,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(1.5),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
