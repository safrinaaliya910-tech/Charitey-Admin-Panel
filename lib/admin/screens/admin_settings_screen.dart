import 'package:flutter/material.dart';
import '../services/admin_auth_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/confirmation_dialog.dart';

/// Admin settings screen
/// View profile, app info, and logout
class AdminSettingsScreen extends StatefulWidget {
  final String adminName;
  final String adminEmail;
  final VoidCallback onLogout;

  const AdminSettingsScreen({
    Key? key,
    required this.adminName,
    required this.adminEmail,
    required this.onLogout,
  }) : super(key: key);

  @override
  State<AdminSettingsScreen> createState() => _AdminSettingsScreenState();
}

class _AdminSettingsScreenState extends State<AdminSettingsScreen> {
  final _authService = AdminAuthService();
  bool _isLoading = false;

  /// Handle logout
  Future<void> _handleLogout() async {
    ConfirmationDialog.show(
      context: context,
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmButtonText: 'Logout',
      isDangerous: true,
      onConfirm: () async {
        setState(() {
          _isLoading = true;
        });

        try {
          await _authService.logout();
          if (mounted) {
            widget.onLogout();
          }
        } catch (e) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error: $e'),
                backgroundColor: AdminColors.error,
              ),
            );
            setState(() {
              _isLoading = false;
            });
          }
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AdminTheme.paddingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Page Title
          const Text(
            'Settings',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Manage your admin account and preferences',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Admin Profile Section
          _buildProfileSection(),

          const SizedBox(height: AdminTheme.paddingXl),

          // App Info Section
          _buildAppInfoSection(),

          const SizedBox(height: AdminTheme.paddingXl),

          // Logout Section
          _buildLogoutSection(),
        ],
      ),
    );
  }

  /// Build admin profile section
  Widget _buildProfileSection() {
    return Container(
      decoration: BoxDecoration(
        color: AdminColors.surface,
        border: Border.all(color: AdminColors.divider),
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      padding: const EdgeInsets.all(AdminTheme.paddingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.account_circle,
                color: AdminColors.primary,
                size: 24,
              ),
              const SizedBox(width: AdminTheme.paddingMd),
              const Text(
                'Admin Profile',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AdminColors.textPrimary,
                ),
              ),
            ],
          ),

          const SizedBox(height: AdminTheme.paddingLg),

          // Avatar and Info
          Row(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AdminTheme.radiusLg),
                  gradient: AdminColors.primaryGradient,
                ),
                child: Center(
                  child: Text(
                    widget.adminName.isNotEmpty
                        ? widget.adminName[0].toUpperCase()
                        : 'A',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 36,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AdminTheme.paddingLg),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.adminName,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AdminColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.adminEmail,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AdminColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AdminColors.successLight,
                        borderRadius: BorderRadius.circular(AdminTheme.radiusSm),
                      ),
                      child: const Text(
                        'Administrator',
                        style: TextStyle(
                          color: AdminColors.success,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: AdminTheme.paddingLg),

          const Divider(color: AdminColors.divider),

          const SizedBox(height: AdminTheme.paddingLg),

          // Profile Details
          _buildSettingRow('Email', widget.adminEmail, Icons.email_outlined),
          const SizedBox(height: AdminTheme.paddingMd),
          _buildSettingRow('Role', 'Administrator', Icons.shield_admin_outlined),
          const SizedBox(height: AdminTheme.paddingMd),
          _buildSettingRow(
            'Status',
            'Active',
            Icons.check_circle_outline,
            statusColor: AdminColors.success,
          ),
        ],
      ),
    );
  }

  /// Build app info section
  Widget _buildAppInfoSection() {
    return Container(
      decoration: BoxDecoration(
        color: AdminColors.surface,
        border: Border.all(color: AdminColors.divider),
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      padding: const EdgeInsets.all(AdminTheme.paddingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.info_outlined,
                color: AdminColors.primary,
                size: 24,
              ),
              const SizedBox(width: AdminTheme.paddingMd),
              const Text(
                'App Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AdminColors.textPrimary,
                ),
              ),
            ],
          ),

          const SizedBox(height: AdminTheme.paddingLg),

          _buildSettingRow('App Name', 'Charitey', Icons.apps),
          const SizedBox(height: AdminTheme.paddingMd),
          _buildSettingRow(
              'Admin Panel Version', '1.0.0', Icons.version_outlined),
          const SizedBox(height: AdminTheme.paddingMd),
          _buildSettingRow(
              'Last Updated', DateTime.now().toString().split(' ')[0], Icons.calendar_today),
        ],
      ),
    );
  }

  /// Build logout section
  Widget _buildLogoutSection() {
    return Container(
      decoration: BoxDecoration(
        color: AdminColors.errorLight,
        border: Border.all(color: AdminColors.error),
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      padding: const EdgeInsets.all(AdminTheme.paddingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.logout,
                color: AdminColors.error,
                size: 24,
              ),
              const SizedBox(width: AdminTheme.paddingMd),
              const Text(
                'Session',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AdminColors.error,
                ),
              ),
            ],
          ),

          const SizedBox(height: AdminTheme.paddingMd),

          Text(
            'Logout to end your admin session. You will be returned to the login screen.',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingLg),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _handleLogout,
              icon: const Icon(Icons.logout),
              label: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AdminColors.error,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Build a setting row with icon and value
  Widget _buildSettingRow(
    String label,
    String value,
    IconData icon, {
    Color? statusColor,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          color: statusColor ?? AdminColors.textSecondary,
          size: 20,
        ),
        const SizedBox(width: AdminTheme.paddingMd),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  color: AdminColors.textSecondary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AdminColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
