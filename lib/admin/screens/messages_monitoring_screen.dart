import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/empty_state_widget.dart';
import '../widgets/loading_skeleton.dart';

/// Messages/Chat monitoring screen (read-only, Phase 1)
/// NOTE: Uses 'messages' collection for monitoring conversations
class MessagesMonitoringScreen extends StatefulWidget {
  const MessagesMonitoringScreen({Key? key}) : super(key: key);

  @override
  State<MessagesMonitoringScreen> createState() =>
      _MessagesMonitoringScreenState();
}

class _MessagesMonitoringScreenState extends State<MessagesMonitoringScreen> {
  final _adminService = AdminService();
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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
            'Messages Monitoring',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Container(
            padding: const EdgeInsets.all(AdminTheme.paddingMd),
            decoration: BoxDecoration(
              color: AdminColors.primaryLight,
              border: Border.all(color: AdminColors.primary),
              borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.info_outlined,
                  color: AdminColors.primary,
                  size: 18,
                ),
                const SizedBox(width: AdminTheme.paddingMd),
                Expanded(
                  child: Text(
                    'Chat monitoring is in read-only mode for Phase 1. Moderation features coming soon.',
                    style: TextStyle(
                      color: AdminColors.primaryDark,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Search
          TextField(
            controller: _searchController,
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            decoration: InputDecoration(
              hintText: 'Search messages...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
              ),
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Messages List
          _buildMessagesList(),
        ],
      ),
    );
  }

  /// Build messages list
  Widget _buildMessagesList() {
    return StreamBuilder<QuerySnapshot>(
      stream: _adminService.getMessagesStream(limit: 100),
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
                  height: 80,
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
            title: 'No messages',
            message: 'There are no messages to monitor yet.',
            icon: Icons.message_outlined,
          );
        }

        final messages = snapshot.data!.docs;

        // Filter by search query
        final filtered = messages.where((doc) {
          final message = doc.data() as Map<String, dynamic>;
          // NOTE: Adjust field names to match message_model.dart
          final text = (message['text'] ?? '').toString().toLowerCase();
          final senderId = (message['senderId'] ?? '').toString().toLowerCase();
          final receiverId =
              (message['receiverId'] ?? '').toString().toLowerCase();

          final query = _searchQuery.toLowerCase();
          return text.contains(query) ||
              senderId.contains(query) ||
              receiverId.contains(query);
        }).toList();

        if (filtered.isEmpty) {
          return EmptyStateWidget(
            title: 'No messages match your search',
            message: 'Try adjusting your search.',
            icon: Icons.search_off,
          );
        }

        return Column(
          children: List.generate(
            filtered.length,
            (index) {
              final doc = filtered[index];
              final message = doc.data() as Map<String, dynamic>;
              // NOTE: Adjust field names to match message_model.dart
              final text = message['text'] ?? '';
              final senderId = message['senderId'] ?? 'Unknown';
              final receiverId = message['receiverId'] ?? 'Unknown';
              final createdAt = message['createdAt'] as Timestamp?;
              final timestamp = createdAt?.toDate() ?? DateTime.now();
              final timeString =
                  '${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}';

              return Container(
                margin: const EdgeInsets.only(bottom: AdminTheme.paddingMd),
                padding: const EdgeInsets.all(AdminTheme.paddingMd),
                decoration: BoxDecoration(
                  color: AdminColors.surface,
                  border: Border.all(color: AdminColors.divider),
                  borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header: From -> To
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'From: ${senderId.substring(0, 8)}...',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AdminColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'To: ${receiverId.substring(0, 8)}...',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AdminColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          timeString,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AdminColors.textTertiary,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: AdminTheme.paddingMd),

                    // Message text
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AdminTheme.paddingMd),
                      decoration: BoxDecoration(
                        color: AdminColors.surfaceAlt,
                        borderRadius: BorderRadius.circular(AdminTheme.radiusSm),
                      ),
                      child: Text(
                        text,
                        style: const TextStyle(
                          color: AdminColors.textPrimary,
                          fontSize: 14,
                        ),
                      ),
                    ),

                    const SizedBox(height: AdminTheme.paddingMd),

                    // Footer: Timestamp
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          timestamp.toString().split('.')[0],
                          style: const TextStyle(
                            fontSize: 11,
                            color: AdminColors.textTertiary,
                          ),
                        ),
                        const Chip(
                          label: Text('Read-Only'),
                          labelStyle: TextStyle(fontSize: 10),
                          backgroundColor: AdminColors.primaryLight,
                        ),
                      ],
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
}
