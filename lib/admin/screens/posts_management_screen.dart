import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/status_badge.dart';
import '../widgets/confirmation_dialog.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/loading_skeleton.dart';

/// Posts (NGO Requests) management screen
/// NOTE: Uses 'posts' collection for NGO posts/requests
class PostsManagementScreen extends StatefulWidget {
  const PostsManagementScreen({Key? key}) : super(key: key);

  @override
  State<PostsManagementScreen> createState() => _PostsManagementScreenState();
}

class _PostsManagementScreenState extends State<PostsManagementScreen> {
  final _adminService = AdminService();
  final _searchController = TextEditingController();
  String _selectedStatus = 'all';
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  /// Handle post status update
  Future<void> _updatePostStatus(String postId, String newStatus) async {
    try {
      await _adminService.updatePostStatus(
        postId: postId,
        status: newStatus,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Post status updated to $newStatus'),
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

  /// Handle post deletion
  Future<void> _deletePost(String postId) async {
    try {
      await _adminService.deletePost(postId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Post deleted successfully'),
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
            'Posts Management',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Manage NGO posts and requests',
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
                    hintText: 'Search by title...',
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
                  DropdownMenuItem(value: 'active', child: Text('Active')),
                  DropdownMenuItem(value: 'fulfilled', child: Text('Fulfilled')),
                  DropdownMenuItem(value: 'archived', child: Text('Archived')),
                  DropdownMenuItem(value: 'deleted', child: Text('Deleted')),
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

          // Posts Table
          _buildPostsTable(),
        ],
      ),
    );
  }

  /// Build posts data table
  Widget _buildPostsTable() {
    return StreamBuilder<QuerySnapshot>(
      stream: _adminService.getPostsStream(),
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
            title: 'No posts found',
            message: 'There are no posts in the system yet.',
            icon: Icons.article_outlined,
          );
        }

        final posts = snapshot.data!.docs;

        // Filter by search query and status
        final filtered = posts.where((doc) {
          final post = doc.data() as Map<String, dynamic>;
          // NOTE: Adjust field names to match post_model.dart
          final title = (post['title'] ?? '').toString().toLowerCase();
          final status = post['status'] ?? 'active';

          final matchesSearch = title.contains(_searchQuery.toLowerCase());
          final matchesStatus =
              _selectedStatus == 'all' || status == _selectedStatus;

          return matchesSearch && matchesStatus;
        }).toList();

        if (filtered.isEmpty) {
          return EmptyStateWidget(
            title: 'No posts match your filters',
            message: 'Try adjusting your search or filters.',
            icon: Icons.filter_alt_off,
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
                DataColumn(label: Text('Title')),
                DataColumn(label: Text('Category')),
                DataColumn(label: Text('Status')),
                DataColumn(label: Text('Date')),
                DataColumn(label: Text('Actions')),
              ],
              rows: filtered.map((doc) {
                final post = doc.data() as Map<String, dynamic>;
                // NOTE: Adjust field names to match post_model.dart
                final title = post['title'] ?? 'Untitled';
                final category = post['category'] ?? 'General';
                final status = post['status'] ?? 'active';
                final createdAt = post['createdAt'] as Timestamp?;
                final date = createdAt?.toDate().toString().split(' ')[0] ?? 'Unknown';

                return DataRow(
                  cells: [
                    DataCell(
                      SizedBox(
                        width: 200,
                        child: Text(
                          title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                    DataCell(Text(category)),
                    DataCell(StatusBadge(status: status)),
                    DataCell(Text(date)),
                    DataCell(
                      PopupMenuButton(
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            child: const Text('View Details'),
                            onTap: () {
                              _showPostDetails(post, doc.id);
                            },
                          ),
                          if (status != 'fulfilled')
                            PopupMenuItem(
                              child: const Text('Mark as Fulfilled'),
                              onTap: () {
                                ConfirmationDialog.show(
                                  context: context,
                                  title: 'Mark as Fulfilled',
                                  message:
                                      'Are you sure this request has been fulfilled?',
                                  confirmButtonText: 'Confirm',
                                  onConfirm: () {
                                    _updatePostStatus(doc.id, 'fulfilled');
                                  },
                                );
                              },
                            ),
                          PopupMenuItem(
                            child: const Text('Archive'),
                            onTap: () {
                              ConfirmationDialog.show(
                                context: context,
                                title: 'Archive Post',
                                message: 'Archive this post?',
                                confirmButtonText: 'Archive',
                                onConfirm: () {
                                  _updatePostStatus(doc.id, 'archived');
                                },
                              );
                            },
                          ),
                          PopupMenuItem(
                            child: const Text('Delete'),
                            onTap: () {
                              ConfirmationDialog.show(
                                context: context,
                                title: 'Delete Post',
                                message:
                                    'Are you sure you want to delete this post?',
                                confirmButtonText: 'Delete',
                                isDangerous: true,
                                onConfirm: () {
                                  _deletePost(doc.id);
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

  /// Show post details in dialog
  void _showPostDetails(Map<String, dynamic> post, String postId) {
    // NOTE: Customize field names based on post_model.dart
    final title = post['title'] ?? 'Unknown';
    final description = post['description'] ?? 'No description';
    final category = post['category'] ?? 'N/A';
    final status = post['status'] ?? 'unknown';
    final ngoId = post['ngoId'] ?? 'N/A';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildDetailRow('ID', postId),
              _buildDetailRow('Category', category),
              _buildDetailRow('Status', status),
              _buildDetailRow('NGO ID', ngoId),
              const SizedBox(height: AdminTheme.paddingMd),
              const Text(
                'Description',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AdminColors.textSecondary,
                ),
              ),
              const SizedBox(height: 4),
              Text(description),
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

  /// Build detail row for post details dialog
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
