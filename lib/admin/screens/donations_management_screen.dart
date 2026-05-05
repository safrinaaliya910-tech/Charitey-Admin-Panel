import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/status_badge.dart';
import '../widgets/confirmation_dialog.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/loading_skeleton.dart';

/// Donations management screen
/// NOTE: Uses 'donations' collection
class DonationsManagementScreen extends StatefulWidget {
  const DonationsManagementScreen({Key? key}) : super(key: key);

  @override
  State<DonationsManagementScreen> createState() =>
      _DonationsManagementScreenState();
}

class _DonationsManagementScreenState extends State<DonationsManagementScreen> {
  final _adminService = AdminService();
  String _selectedStatus = 'all';

  /// Handle donation status update
  Future<void> _updateDonationStatus(String donationId, String newStatus) async {
    try {
      await _adminService.updateDonationStatus(
        donationId: donationId,
        status: newStatus,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Donation status updated to $newStatus'),
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
            'Donations Management',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Monitor and manage donation records',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Status Filter
          Row(
            children: [
              const Text(
                'Filter by Status:',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AdminColors.textPrimary,
                ),
              ),
              const SizedBox(width: AdminTheme.paddingMd),
              DropdownButton<String>(
                value: _selectedStatus,
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All')),
                  DropdownMenuItem(value: 'pending', child: Text('Pending')),
                  DropdownMenuItem(value: 'confirmed', child: Text('Confirmed')),
                  DropdownMenuItem(value: 'completed', child: Text('Completed')),
                  DropdownMenuItem(
                      value: 'cancelled', child: Text('Cancelled')),
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

          // Donations Table
          _buildDonationsTable(),
        ],
      ),
    );
  }

  /// Build donations data table
  Widget _buildDonationsTable() {
    Stream<QuerySnapshot> getStream() {
      if (_selectedStatus == 'all') {
        return _adminService.getDonationsStream();
      } else {
        return _adminService.getDonationsByStatus(_selectedStatus);
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
            title: 'No donations found',
            message: 'There are no donations matching your filters.',
            icon: Icons.favorite_outline,
          );
        }

        final donations = snapshot.data!.docs;

        return Container(
          decoration: BoxDecoration(
            border: Border.all(color: AdminColors.divider),
            borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columns: const [
                DataColumn(label: Text('Donation ID')),
                DataColumn(label: Text('Donor ID')),
                DataColumn(label: Text('NGO ID')),
                DataColumn(label: Text('Amount')),
                DataColumn(label: Text('Status')),
                DataColumn(label: Text('Date')),
                DataColumn(label: Text('Actions')),
              ],
              rows: donations.map((doc) {
                final donation = doc.data() as Map<String, dynamic>;
                // NOTE: Adjust field names to match donation_model.dart
                final donorId = donation['donorId'] ?? 'N/A';
                final ngoId = donation['ngoId'] ?? 'N/A';
                final amount = donation['amount'] ?? 'N/A';
                final status = donation['status'] ?? 'pending';
                final createdAt = donation['createdAt'] as Timestamp?;
                final date = createdAt?.toDate().toString().split(' ')[0] ?? 'Unknown';

                return DataRow(
                  cells: [
                    DataCell(Text(doc.id.substring(0, 8))),
                    DataCell(
                      SizedBox(
                        width: 120,
                        child: Text(
                          donorId,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
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
                    DataCell(Text(amount.toString())),
                    DataCell(StatusBadge(status: status)),
                    DataCell(Text(date)),
                    DataCell(
                      PopupMenuButton(
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            child: const Text('View Details'),
                            onTap: () {
                              _showDonationDetails(donation, doc.id);
                            },
                          ),
                          if (status != 'confirmed')
                            PopupMenuItem(
                              child: const Text('Mark as Confirmed'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Confirm Donation',
                                  message:
                                      'Mark this donation as confirmed?',
                                  confirmButtonText: 'Confirm',
                                  onConfirm: () {
                                    _updateDonationStatus(doc.id, 'confirmed');
                                  },
                                );
                              },
                            ),
                          if (status != 'completed')
                            PopupMenuItem(
                              child: const Text('Mark as Completed'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Complete Donation',
                                  message:
                                      'Mark this donation as completed?',
                                  confirmButtonText: 'Complete',
                                  onConfirm: () {
                                    _updateDonationStatus(doc.id, 'completed');
                                  },
                                );
                              },
                            ),
                          if (status != 'cancelled')
                            PopupMenuItem(
                              child: const Text('Cancel'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Cancel Donation',
                                  message:
                                      'Are you sure you want to cancel this donation?',
                                  confirmButtonText: 'Cancel',
                                  isDangerous: true,
                                  onConfirm: () {
                                    _updateDonationStatus(doc.id, 'cancelled');
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

  /// Show donation details in dialog
  void _showDonationDetails(Map<String, dynamic> donation, String donationId) {
    // NOTE: Customize field names based on donation_model.dart
    final donorId = donation['donorId'] ?? 'N/A';
    final ngoId = donation['ngoId'] ?? 'N/A';
    final postId = donation['postId'] ?? donation['requestId'] ?? 'N/A';
    final amount = donation['amount'] ?? 'N/A';
    final status = donation['status'] ?? 'unknown';
    final notes = donation['notes'] ?? 'No notes';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Donation #${donationId.substring(0, 8)}'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildDetailRow('Donor ID', donorId),
              _buildDetailRow('NGO ID', ngoId),
              _buildDetailRow('Post/Request ID', postId),
              _buildDetailRow('Amount', amount.toString()),
              _buildDetailRow('Status', status),
              const SizedBox(height: AdminTheme.paddingMd),
              const Text(
                'Notes',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AdminColors.textSecondary,
                ),
              ),
              const SizedBox(height: 4),
              Text(notes),
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

  /// Build detail row for donation details dialog
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
