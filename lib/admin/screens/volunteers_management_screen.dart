import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/status_badge.dart';
import '../widgets/confirmation_dialog.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/loading_skeleton.dart';

/// Volunteers management screen
/// NOTE: Uses 'volunteers' collection
class VolunteersManagementScreen extends StatefulWidget {
  const VolunteersManagementScreen({Key? key}) : super(key: key);

  @override
  State<VolunteersManagementScreen> createState() =>
      _VolunteersManagementScreenState();
}

class _VolunteersManagementScreenState extends State<VolunteersManagementScreen> {
  final _adminService = AdminService();
  final _searchController = TextEditingController();
  String _selectedStatus = 'all';
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  /// Handle volunteer status update
  Future<void> _updateVolunteerStatus(String volunteerId, String newStatus) async {
    try {
      await _adminService.updateVolunteerStatus(
        volunteerId: volunteerId,
        status: newStatus,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Volunteer status updated to $newStatus'),
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

  /// Handle block/unblock volunteer
  Future<void> _toggleBlockVolunteer(
      String volunteerId, bool isCurrentlyBlocked) async {
    try {
      await _adminService.updateVolunteerBlockStatus(
        volunteerId: volunteerId,
        isBlocked: !isCurrentlyBlocked,
      );
      if (mounted) {
        final action = !isCurrentlyBlocked ? 'blocked' : 'unblocked';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Volunteer $action successfully'),
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
            'Volunteers Management',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Manage volunteers and their assignments',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Filters and Search
          Row(
            children: [
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
                    hintText: 'Search by name...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AdminTheme.paddingLg),
              DropdownButton<String>(
                value: _selectedStatus,
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Status')),
                  DropdownMenuItem(value: 'available', child: Text('Available')),
                  DropdownMenuItem(
                      value: 'unavailable', child: Text('Unavailable')),
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

          // Volunteers Table
          _buildVolunteersTable(),
        ],
      ),
    );
  }

  /// Build volunteers data table
  Widget _buildVolunteersTable() {
    Stream<QuerySnapshot> getStream() {
      if (_selectedStatus == 'all') {
        return _adminService.getVolunteersStream();
      } else {
        return _adminService.getVolunteersByStatus(_selectedStatus);
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
            title: 'No volunteers found',
            message: 'There are no volunteers in the system yet.',
            icon: Icons.volunteer_activism_outlined,
          );
        }

        final volunteers = snapshot.data!.docs;

        // Filter by search query
        final filtered = volunteers.where((doc) {
          final volunteer = doc.data() as Map<String, dynamic>;
          // NOTE: Adjust field names to match volunteer_request_model.dart
          final name = (volunteer['name'] ?? '').toString().toLowerCase();
          return name.contains(_searchQuery.toLowerCase());
        }).toList();

        if (filtered.isEmpty) {
          return EmptyStateWidget(
            title: 'No volunteers match your search',
            message: 'Try adjusting your search.',
            icon: Icons.search_off,
          );
        }

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
                DataColumn(label: Text('NGO')),
                DataColumn(label: Text('Status')),
                DataColumn(label: Text('Joined')),
                DataColumn(label: Text('Actions')),
              ],
              rows: filtered.map((doc) {
                final volunteer = doc.data() as Map<String, dynamic>;
                // NOTE: Adjust field names to match volunteer_request_model.dart
                final name = volunteer['name'] ?? 'Unknown';
                final ngoId = volunteer['ngoId'] ?? 'N/A';
                final status = volunteer['status'] ?? 'available';
                final isBlocked = volunteer['isBlocked'] ?? false;
                final createdAt = volunteer['createdAt'] as Timestamp?;
                final date = createdAt?.toDate().toString().split(' ')[0] ?? 'Unknown';

                return DataRow(
                  cells: [
                    DataCell(Text(name)),
                    DataCell(
                      SizedBox(
                        width: 120,
                        child: Text(
                          ngoId,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
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
                              _showVolunteerDetails(volunteer, doc.id);
                            },
                          ),
                          if (status != 'available')
                            PopupMenuItem(
                              child: const Text('Mark Available'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Mark as Available',
                                  message:
                                      'Mark this volunteer as available?',
                                  confirmButtonText: 'Confirm',
                                  onConfirm: () {
                                    _updateVolunteerStatus(doc.id, 'available');
                                  },
                                );
                              },
                            ),
                          if (status != 'unavailable')
                            PopupMenuItem(
                              child: const Text('Mark Unavailable'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Mark as Unavailable',
                                  message:
                                      'Mark this volunteer as unavailable?',
                                  confirmButtonText: 'Confirm',
                                  onConfirm: () {
                                    _updateVolunteerStatus(
                                        doc.id, 'unavailable');
                                  },
                                );
                              },
                            ),
                          PopupMenuItem(
                            child: Text(isBlocked ? 'Unblock' : 'Block'),
                            onTap: () {
                              ConfirmationDialog.show(
                                context: context,
                                title: isBlocked
                                    ? 'Unblock Volunteer'
                                    : 'Block Volunteer',
                                message: isBlocked
                                    ? 'Are you sure you want to unblock this volunteer?'
                                    : 'Are you sure you want to block this volunteer?',
                                confirmButtonText:
                                    isBlocked ? 'Unblock' : 'Block',
                                isDangerous: true,
                                onConfirm: () {
                                  _toggleBlockVolunteer(doc.id, isBlocked);
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

  /// Show volunteer details in dialog
  void _showVolunteerDetails(Map<String, dynamic> volunteer, String volunteerId) {
    // NOTE: Customize field names based on volunteer_request_model.dart
    final name = volunteer['name'] ?? 'Unknown';
    final email = volunteer['email'] ?? 'N/A';
    final phone = volunteer['phone'] ?? 'N/A';
    final ngoId = volunteer['ngoId'] ?? 'N/A';
    final status = volunteer['status'] ?? 'unknown';
    final experience = volunteer['experience'] ?? 'N/A';

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
              _buildDetailRow('NGO ID', ngoId),
              _buildDetailRow('Status', status),
              _buildDetailRow('Experience', experience),
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

  /// Build detail row for volunteer details dialog
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
