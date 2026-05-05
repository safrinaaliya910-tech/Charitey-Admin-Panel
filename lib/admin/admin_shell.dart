import 'package:flutter/material.dart';
import 'services/admin_auth_service.dart';
import 'theme/admin_theme.dart';
import 'theme/admin_colors.dart';
import 'widgets/admin_sidebar.dart';
import 'widgets/admin_topbar.dart';
import 'screens/admin_login_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/users_management_screen.dart';
import 'screens/posts_management_screen.dart';
import 'screens/donations_management_screen.dart';
import 'screens/volunteers_management_screen.dart';
import 'screens/messages_monitoring_screen.dart';
import 'screens/admin_settings_screen.dart';

/// Main admin shell - entry point for the admin panel
/// Handles authentication and navigation
class AdminShell extends StatefulWidget {
  const AdminShell({Key? key}) : super(key: key);

  @override
  State<AdminShell> createState() => _AdminShellState();
}

class _AdminShellState extends State<AdminShell> {
  final _authService = AdminAuthService();
  bool _isAuthenticated = false;
  String _adminName = '';
  String _adminEmail = '';
  String _currentRoute = 'dashboard';

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  /// Check if user is authenticated and admin
  void _checkAuthStatus() async {
    final isAdmin = await _authService.isCurrentUserAdmin();
    if (mounted) {
      setState(() {
        _isAuthenticated = isAdmin;
      });
    }
  }

  /// Handle login success
  void _handleLoginSuccess(String adminName, String adminEmail) {
    setState(() {
      _isAuthenticated = true;
      _adminName = adminName;
      _adminEmail = adminEmail;
      _currentRoute = 'dashboard';
    });
  }

  /// Handle logout
  void _handleLogout() {
    setState(() {
      _isAuthenticated = false;
      _adminName = '';
      _adminEmail = '';
      _currentRoute = 'dashboard';
    });
  }

  /// Get current screen widget based on route
  Widget _getCurrentScreen() {
    switch (_currentRoute) {
      case 'users':
        return const UsersManagementScreen();
      case 'posts':
        return const PostsManagementScreen();
      case 'donations':
        return const DonationsManagementScreen();
      case 'volunteers':
        return const VolunteersManagementScreen();
      case 'messages':
        return const MessagesMonitoringScreen();
      case 'settings':
        return AdminSettingsScreen(
          adminName: _adminName,
          adminEmail: _adminEmail,
          onLogout: _handleLogout,
        );
      case 'dashboard':
      default:
        return const AdminDashboardScreen();
    }
  }

  /// Build sidebar items
  List<AdminSidebarItem> _buildSidebarItems() {
    return [
      AdminSidebarItem(
        label: 'Dashboard',
        icon: Icons.dashboard_outlined,
        onTap: () {
          setState(() => _currentRoute = 'dashboard');
        },
        isActive: _currentRoute == 'dashboard',
      ),
      AdminSidebarItem(
        label: 'Users',
        icon: Icons.people_outlined,
        onTap: () {
          setState(() => _currentRoute = 'users');
        },
        isActive: _currentRoute == 'users',
      ),
      AdminSidebarItem(
        label: 'Posts',
        icon: Icons.article_outlined,
        onTap: () {
          setState(() => _currentRoute = 'posts');
        },
        isActive: _currentRoute == 'posts',
      ),
      AdminSidebarItem(
        label: 'Donations',
        icon: Icons.favorite_outlined,
        onTap: () {
          setState(() => _currentRoute = 'donations');
        },
        isActive: _currentRoute == 'donations',
      ),
      AdminSidebarItem(
        label: 'Volunteers',
        icon: Icons.volunteer_activism_outlined,
        onTap: () {
          setState(() => _currentRoute = 'volunteers');
        },
        isActive: _currentRoute == 'volunteers',
      ),
      AdminSidebarItem(
        label: 'Messages',
        icon: Icons.message_outlined,
        onTap: () {
          setState(() => _currentRoute = 'messages');
        },
        isActive: _currentRoute == 'messages',
      ),
      AdminSidebarItem(
        label: 'Settings',
        icon: Icons.settings_outlined,
        onTap: () {
          setState(() => _currentRoute = 'settings');
        },
        isActive: _currentRoute == 'settings',
      ),
    ];
  }

  /// Get page title for current route
  String _getPageTitle() {
    switch (_currentRoute) {
      case 'users':
        return 'Users Management';
      case 'posts':
        return 'Posts Management';
      case 'donations':
        return 'Donations Management';
      case 'volunteers':
        return 'Volunteers Management';
      case 'messages':
        return 'Messages Monitoring';
      case 'settings':
        return 'Settings';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  }

  @override
  Widget build(BuildContext context) {
    // Show login screen if not authenticated
    if (!_isAuthenticated) {
      return MaterialApp(
        title: 'Charitey Admin',
        theme: AdminTheme.lightTheme,
        home: AdminLoginScreen(
          onLoginSuccess: _handleLoginSuccess,
        ),
        debugShowCheckedModeBanner: false,
      );
    }

    // Show main admin panel if authenticated
    return MaterialApp(
      title: 'Charitey Admin',
      theme: AdminTheme.lightTheme,
      home: Scaffold(
        appBar: AdminTopbar(
          title: _getPageTitle(),
          adminEmail: _adminEmail,
          adminName: _adminName,
          onProfileTap: () {
            setState(() => _currentRoute = 'settings');
          },
        ),
        body: Row(
          children: [
            // Sidebar
            AdminSidebar(
              adminName: _adminName,
              items: _buildSidebarItems(),
              onLogout: _handleLogout,
            ),

            // Main Content
            Expanded(
              child: Container(
                color: AdminColors.background,
                child: _getCurrentScreen(),
              ),
            ),
          ],
        ),
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}
