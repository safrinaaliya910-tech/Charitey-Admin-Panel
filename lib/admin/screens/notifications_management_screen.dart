import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/status_badge.dart';
import '../widgets/confirmation_dialog.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/loading_skeleton.dart';

/// Notifications management screen
/// NOTE: Uses 'notifications' collection for managing system alerts
class NotificationsManagementScreen extends StatefulWidget {
  const NotificationsManagementScreen({Key? key}) : super(key: key);

  @override
  State<NotificationsManagementScreen> createState() =>
      _NotificationsManagementScreenState();
}

class _NotificationsManagementScreenState
    extends State<NotificationsManagementScreen> {
  final _adminService = AdminService();
  String _selectedFilter = 'all'; // all, unread, read

  /// Handle marking notification as read
  Future<void> _markAsRead(String notificationId) async {
    try {
      await _adminService.markNotificationAsRead(notificationId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Notification marked as read'),
            backgroundColor: AdminColors.success,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: AdminColors.error,
          ),
        );
      }
    }
  }

  /// Handle deleting notification
  Future<void> _deleteNotification(String notificationId) async {
    try {
      await _adminService.deleteNotification(notificationId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Notification deleted'),
            backgroundColor: AdminColors.success,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: AdminColors.error,
          ),
        );
      }
    }
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
            'Notifications Management',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Manage system notifications and alerts',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Filter
          Row(
            children: [
              const Text(
                'Filter:',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AdminColors.textPrimary,
                ),
              ),
              const SizedBox(width: AdminTheme.paddingMd),
              DropdownButton<String>(
                value: _selectedFilter,
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All')),
                  DropdownMenuItem(value: 'unread', child: Text('Unread')),
                  DropdownMenuItem(value: 'read', child: Text('Read')),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedFilter = value ?? 'all';
                  });
                },
              ),
            ],
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Notifications List
          _buildNotificationsList(),
        ],
      ),
    );
  }

  /// Build notifications list
  Widget _buildNotificationsList() {
    Stream<QuerySnapshot> getStream() {
      if (_selectedFilter == 'unread') {
        return _adminService.getUnreadNotifications();
      } else {
        return _adminService.getNotificationsStream();
      }
    }

    return StreamBuilder<QuerySnapshot>(
      stream: getStream(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 5,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: AdminTheme.paddingMd),
                child: LoadingSkeleton(
                  width: double.infinity,
                  height: 100,
                  borderRadius: AdminTheme.radiusMd,
                ),
              );
            },
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('Error: ${snapshot.error}'),
          );
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return EmptyStateWidget(
            title: 'No notifications',
            message: 'There are no notifications to display.',
            icon: Icons.notifications_off_outlined,
          );
        }

        final notifications = snapshot.data!.docs;

        // Filter by read/unread status
        final filtered = notifications.where((doc) {
          final notification = doc.data() as Map<String, dynamic>;
          // NOTE: Adjust field names to match notification_model.dart
          final isRead = notification['isRead'] ?? false;

          if (_selectedFilter == 'unread') {
            return !isRead;
          } else if (_selectedFilter == 'read') {
            return isRead;
          }
          return true; // all
        }).toList();

        if (filtered.isEmpty) {
          return EmptyStateWidget(
            title: 'No notifications match your filter',
            message: 'Try adjusting your filter.',
            icon: Icons.filter_alt_off,
          );
        }

        return Column(
          children: List.generate(
            filtered.length,
            (index) {
              final doc = filtered[index];
              final notification =
                  doc.data() as Map<String, dynamic>;
              // NOTE: Adjust field names to match notification_model.dart
              final title = notification['title'] ?? 'No Title';
              final body = notification['body'] ?? 'No body';
              final type = notification['type'] ?? 'info';
              final isRead = notification['isRead'] ?? false;
              final createdAt = notification['createdAt'] as Timestamp?;
              final timestamp = createdAt?.toDate() ?? DateTime.now();
              final dateString =
                  timestamp.toString().split(' ')[0];

              return Container(
                margin: const EdgeInsets.only(bottom: AdminTheme.paddingMd),
                decoration: BoxDecoration(
                  color: isRead ? AdminColors.surface : AdminColors.primaryLight,
                  border: Border.all(
                    color: isRead ? AdminColors.divider : AdminColors.primary,
                    width: isRead ? 1 : 2,
                  ),
                  borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
                ),
                child: Column(
                  children: [
                    // Header
                    Padding(
                      padding: const EdgeInsets.all(AdminTheme.paddingMd),
                      child: Row(
                        children: [
                          // Icon based on type
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: _getTypeColor(type),
                              borderRadius: BorderRadius.circular(
                                  AdminTheme.radiusSm),
                            ),
                            child: Icon(
                              _getTypeIcon(type),
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                          const SizedBox(width: AdminTheme.paddingMd),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  title,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: AdminColors.textPrimary,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  dateString,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: AdminColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          StatusBadge(
                            status: isRead ? 'read' : 'unread',
                            fontSize: 11,
                          ),
                        ],
                      ),
                    ),

                    const Divider(
                      height: 1,
                      color: AdminColors.divider,
                    ),

                    // Body
                    Padding(
                      padding: const EdgeInsets.all(AdminTheme.paddingMd),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            body,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AdminColors.textPrimary,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Actions
                    Padding(
                      padding: const EdgeInsets.all(AdminTheme.paddingMd),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (!isRead)
                            TextButton.icon(
                              onPressed: () {
                                _markAsRead(doc.id);
                              },
                              icon: const Icon(Icons.done),
                              label: const Text('Mark as Read'),
                            ),
                          const SizedBox(width: AdminTheme.paddingMd),
                          TextButton.icon(
                            onPressed: () {
                              ConfirmationDialog.show(
                                context: context,
                                title: 'Delete Notification',
                                message:
                                    'Are you sure you want to delete this notification?',
                                confirmButtonText: 'Delete',
                                isDangerous: true,
                                onConfirm: () {
                                  _deleteNotification(doc.id);
                                },
                              );
                            },
                            icon: const Icon(Icons.delete_outline),
                            label: const Text('Delete'),
                            style: TextButton.styleFrom(
                              foregroundColor: AdminColors.error,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }

  /// Get color based on notification type
  Color _getTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'error':
        return AdminColors.error;
      case 'warning':
        return AdminColors.warning;
      case 'success':
        return AdminColors.success;
      case 'info':
      default:
        return AdminColors.primary;
    }
  }

  /// Get icon based on notification type
  IconData _getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'error':
        return Icons.error;
      case 'warning':
        return Icons.warning;
      case 'success':
        return Icons.check_circle;
      case 'info':
      default:
        return Icons.info;
    }
  }
}
