import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/admin_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/dashboard_card.dart';
import '../widgets/loading_skeleton.dart';

/// Admin dashboard with statistics and recent activity
class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final _adminService = AdminService();

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 900;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AdminTheme.paddingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Page Title
          const Text(
            'Dashboard',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingMd),
          Text(
            'Welcome back! Here&apos;s your app overview.',
            style: TextStyle(
              fontSize: 14,
              color: AdminColors.textSecondary,
            ),
          ),

          const SizedBox(height: AdminTheme.paddingXl),

          // Statistics Grid
          _buildStatisticsSection(isMobile),

          const SizedBox(height: AdminTheme.paddingXl),

          // Recent Activity Section
          Row(
            children: [
              Expanded(
                child: _buildRecentDonationsSection(),
              ),
              if (!isMobile) ...[
                const SizedBox(width: AdminTheme.paddingLg),
                Expanded(
                  child: _buildRecentUsersSection(),
                ),
              ],
            ],
          ),

          if (isMobile) ...[
            const SizedBox(height: AdminTheme.paddingLg),
            _buildRecentUsersSection(),
          ],
        ],
      ),
    );
  }

  /// Build statistics grid with dashboard cards
  Widget _buildStatisticsSection(bool isMobile) {
    return FutureBuilder<Map<String, int>>(
      future: _adminService.getDashboardStats(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return DashboardCardSkeleton(
            count: isMobile ? 2 : 4,
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('Error loading statistics: ${snapshot.error}'),
          );
        }

        final stats = snapshot.data ?? {};

        return GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: isMobile ? 2 : 4,
          mainAxisSpacing: AdminTheme.paddingLg,
          crossAxisSpacing: AdminTheme.paddingLg,
          childAspectRatio: 1.2,
          children: [
            DashboardCard(
              label: 'Total NGOs',
              count: stats['ngos'] ?? 0,
              icon: Icons.apartment_outlined,
              backgroundColor: AdminColors.primaryLight,
              iconColor: AdminColors.primary,
            ),
            DashboardCard(
              label: 'Total Donors',
              count: stats['donors'] ?? 0,
              icon: Icons.person_outline,
              backgroundColor: AdminColors.secondaryLight,
              iconColor: AdminColors.secondary,
            ),
            DashboardCard(
              label: 'Posts/Requests',
              count: stats['posts'] ?? 0,
              icon: Icons.article_outlined,
              backgroundColor: const Color(0xFFFED7AA),
              iconColor: const Color(0xFFEA580C),
            ),
            DashboardCard(
              label: 'Total Donations',
              count: stats['donations'] ?? 0,
              icon: Icons.favorite_outline,
              backgroundColor: const Color(0xFFFBCFCF),
              iconColor: const Color(0xFFDC2626),
            ),
            DashboardCard(
              label: 'Pending Actions',
              count: stats['pending'] ?? 0,
              icon: Icons.schedule_outlined,
              backgroundColor: AdminColors.warningLight,
              iconColor: AdminColors.warning,
            ),
            DashboardCard(
              label: 'Completed',
              count: stats['completed'] ?? 0,
              icon: Icons.check_circle_outline,
              backgroundColor: AdminColors.successLight,
              iconColor: AdminColors.success,
            ),
            DashboardCard(
              label: 'Volunteers',
              count: stats['volunteers'] ?? 0,
              icon: Icons.volunteer_activism_outlined,
              backgroundColor: const Color(0xFFDDD6FE),
              iconColor: const Color(0xFF6366F1),
            ),
            DashboardCard(
              label: 'Blocked Users',
              count: stats['blocked'] ?? 0,
              icon: Icons.block_outlined,
              backgroundColor: AdminColors.errorLight,
              iconColor: AdminColors.error,
            ),
          ],
        );
      },
    );
  }

  /// Build recent donations section
  Widget _buildRecentDonationsSection() {
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
          const Text(
            'Recent Donations',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingLg),
          StreamBuilder<QuerySnapshot>(
            stream: _adminService.getDonationsStream().limit(5),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return DataTableSkeleton(rowCount: 3);
              }

              if (snapshot.hasError) {
                return Text('Error: ${snapshot.error}');
              }

              if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: AdminTheme.paddingLg),
                  child: Text(
                    'No donations yet',
                    style: TextStyle(color: AdminColors.textSecondary),
                  ),
                );
              }

              final donations = snapshot.data!.docs;

              return Column(
                children: List.generate(
                  donations.length,
                  (index) {
                    final donation = donations[index].data() as Map<String, dynamic>;
                    // NOTE: Adjust field names based on your donation_model.dart
                    // Common fields: donorId, ngoId, status, amount, createdAt
                    final status = donation['status'] ?? 'pending';
                    final amount = donation['amount'] ?? 'N/A';
                    final createdAt = donation['createdAt'] as Timestamp?;
                    final date = createdAt?.toDate().toString().split(' ')[0] ?? 'Unknown';

                    return Padding(
                      padding: const EdgeInsets.only(bottom: AdminTheme.paddingMd),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Donation #${donations[index].id.substring(0, 8)}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: AdminColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  date,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AdminColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '$amount',
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AdminColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  /// Build recent users section
  Widget _buildRecentUsersSection() {
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
          const Text(
            'Recent Users',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AdminColors.textPrimary,
            ),
          ),
          const SizedBox(height: AdminTheme.paddingLg),
          StreamBuilder<QuerySnapshot>(
            stream: _adminService.getNGOsStream().limit(5),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return DataTableSkeleton(rowCount: 3);
              }

              if (snapshot.hasError) {
                return Text('Error: ${snapshot.error}');
              }

              if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: AdminTheme.paddingLg),
                  child: Text(
                    'No users yet',
                    style: TextStyle(color: AdminColors.textSecondary),
                  ),
                );
              }

              final users = snapshot.data!.docs;

              return Column(
                children: List.generate(
                  users.length,
                  (index) {
                    final user = users[index].data() as Map<String, dynamic>;
                    // NOTE: Adjust field names based on your user_model.dart
                    // Common fields: name, email, role, status, createdAt
                    final name = user['name'] ?? 'Unknown';
                    final email = user['email'] ?? 'No email';

                    return Padding(
                      padding: const EdgeInsets.only(bottom: AdminTheme.paddingMd),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: AdminColors.primaryLight,
                              borderRadius:
                                  BorderRadius.circular(AdminTheme.radiusLg),
                            ),
                            child: Center(
                              child: Text(
                                name[0].toUpperCase(),
                                style: const TextStyle(
                                  color: AdminColors.primary,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: AdminTheme.paddingMd),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: AdminColors.textPrimary,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  email,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AdminColors.textSecondary,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
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
          ),
        ],
      ),
    );
  }
}
