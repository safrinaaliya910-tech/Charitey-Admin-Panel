import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/status_badge.dart';
import '../widgets/confirmation_dialog.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/loading_skeleton.dart';

/// Users (NGOs and Donors) management screen
/// NOTE: Uses 'users' collection, filter by 'role' field (ngo/donor)
class UsersManagementScreen extends StatefulWidget {
  const UsersManagementScreen({Key? key}) : super(key: key);

  @override
  State<UsersManagementScreen> createState() => _UsersManagementScreenState();
}

class _UsersManagementScreenState extends State<UsersManagementScreen> {
  final _adminService = AdminService();
  final _searchController = TextEditingController();
  String _selectedRole = 'all'; // all, ngo, donor
  String _selectedStatus = 'all'; // all, approved, pending, rejected, blocked
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  /// Handle user status update
  Future<void> _updateUserStatus(
      String userId, String newStatus) async {
    try {
      await _adminService.updateUserStatus(
        userId: userId,
        status: newStatus,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('User status updated to $newStatus'),
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

  /// Handle block/unblock user
  Future<void> _toggleBlockUser(String userId, bool isCurrentlyBlocked) async {
    try {
      await _adminService.updateUserBlockStatus(
        userId: userId,
        isBlocked: !isCurrentlyBlocked,
      );
      if (mounted) {
        final action = !isCurrentlyBlocked ? 'blocked' : 'unblocked';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('User $action successfully'),
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
            'Users Management',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Manage NGOs and donors in the system',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Filters and Search
          Row(
            children: [
              // Search box
              Expanded(
                flex: 2,
                child: TextField(
                  controller: _searchController,
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                  decoration: InputDecoration(
                    hintText: 'Search by name or email...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
                    ),
                  ),
                ),
              ),

              const SizedBox(width: AdminTheme.paddingLg),

              // Role filter
              DropdownButton<String>(
                value: _selectedRole,
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Roles')),
                  DropdownMenuItem(value: 'ngo', child: Text('NGOs')),
                  DropdownMenuItem(value: 'donor', child: Text('Donors')),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedRole = value ?? 'all';
                  });
                },
              ),

              const SizedBox(width: AdminTheme.paddingMd),

              // Status filter
              DropdownButton<String>(
                value: _selectedStatus,
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Status')),
                  DropdownMenuItem(value: 'approved', child: Text('Approved')),
                  DropdownMenuItem(value: 'pending', child: Text('Pending')),
                  DropdownMenuItem(value: 'rejected', child: Text('Rejected')),
                  DropdownMenuItem(value: 'blocked', child: Text('Blocked')),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedStatus = value ?? 'all';
                  });
                },
              ),
            ],
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Users Table
          _buildUsersTable(),
        ],
      ),
    );
  }

  /// Build users data table
  Widget _buildUsersTable() {
    // Determine which stream to use based on selected role
    Stream<QuerySnapshot> getStream() {
      if (_selectedRole == 'ngo') {
        return _adminService.getNGOsStream();
      } else if (_selectedRole == 'donor') {
        return _adminService.getDonorsStream();
      } else {
        // For 'all', we need to combine both streams or fetch separately
        // For now, show NGOs as primary
        return _adminService.getNGOsStream();
      }
    }

    return StreamBuilder<QuerySnapshot>(
      stream: getStream(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return DataTableSkeleton(rowCount: 5);
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('Error: ${snapshot.error}'),
          );
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return EmptyStateWidget(
            title: 'No users found',
            message: 'There are no users in the system yet.',
            icon: Icons.people_outline,
          );
        }

        final users = snapshot.data!.docs;

        return Container(
          decoration: BoxDecoration(
            border: Border.all(color: AdminColors.divider),
            borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columns: const [
                DataColumn(label: Text('Name')),
                DataColumn(label: Text('Email')),
                DataColumn(label: Text('Role')),
                DataColumn(label: Text('Status')),
                DataColumn(label: Text('Joined')),
                DataColumn(label: Text('Actions')),
              ],
              rows: users.map((doc) {
                final user = doc.data() as Map<String, dynamic>;
                // NOTE: Adjust field names to match your user_model.dart
                final name = user['name'] ?? 'Unknown';
                final email = user['email'] ?? 'No email';
                final role = user['role'] ?? 'unknown';
                final status = user['status'] ?? 'pending';
                final isBlocked = user['isBlocked'] ?? false;
                final createdAt = user['createdAt'] as Timestamp?;
                final date = createdAt?.toDate().toString().split(' ')[0] ?? 'Unknown';

                return DataRow(
                  cells: [
                    DataCell(Text(name)),
                    DataCell(Text(email)),
                    DataCell(
                      Chip(
                        label: Text(role.toUpperCase()),
                        backgroundColor: role == 'ngo'
                            ? AdminColors.primaryLight
                            : AdminColors.secondaryLight,
                      ),
                    ),
                    DataCell(StatusBadge(status: status)),
                    DataCell(Text(date)),
                    DataCell(
                      PopupMenuButton(
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            child: const Text('View Details'),
                            onTap: () {
                              _showUserDetails(user);
                            },
                          ),
                          if (status != 'approved')
                            PopupMenuItem(
                              child: const Text('Approve'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Approve User',
                                  message: 'Are you sure you want to approve this user?',
                                  confirmButtonText: 'Approve',
                                  onConfirm: () {
                                    _updateUserStatus(doc.id, 'approved');
                                  },
                                );
                              },
                            ),
                          if (status != 'rejected')
                            PopupMenuItem(
                              child: const Text('Reject'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Reject User',
                                  message: 'Are you sure you want to reject this user?',
                                  confirmButtonText: 'Reject',
                                  isDangerous: true,
                                  onConfirm: () {
                                    _updateUserStatus(doc.id, 'rejected');
                                  },
                                );
                              },
                            ),
                          PopupMenuItem(
                            child: Text(isBlocked ? 'Unblock' : 'Block'),
                            onTap: () {
                              ConfirmationDialog.show(
                                context: context,
                                title: isBlocked ? 'Unblock User' : 'Block User',
                                message: isBlocked
                                    ? 'Are you sure you want to unblock this user?'
                                    : 'Are you sure you want to block this user?',
                                confirmButtonText: isBlocked ? 'Unblock' : 'Block',
                                isDangerous: true,
                                onConfirm: () {
                                  _toggleBlockUser(doc.id, isBlocked);
                                },
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        );
      },
    );
  }

  /// Show user details in dialog
  void _showUserDetails(Map<String, dynamic> user) {
    // NOTE: Customize these field names based on your user_model.dart
    final name = user['name'] ?? 'Unknown';
    final email = user['email'] ?? 'N/A';
    final phone = user['phone'] ?? 'N/A';
    final role = user['role'] ?? 'unknown';
    final status = user['status'] ?? 'unknown';
    final address = user['address'] ?? 'N/A';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(name),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildDetailRow('Email', email),
              _buildDetailRow('Phone', phone),
              _buildDetailRow('Role', role.toUpperCase()),
              _buildDetailRow('Status', status),
              _buildDetailRow('Address', address),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  /// Build detail row for user details dialog
  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AdminTheme.paddingSm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 12,
              color: AdminColors.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              color: AdminColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
