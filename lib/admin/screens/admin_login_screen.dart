import 'package:flutter/material.dart';
import '../services/admin_auth_service.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';
import '../widgets/confirmation_dialog.dart';

/// Admin login screen with email/password authentication
/// Verifies admin role from Firestore before granting access
class AdminLoginScreen extends StatefulWidget {
  final Function(String adminName, String adminEmail) onLoginSuccess;

  const AdminLoginScreen({
    Key? key,
    required this.onLoginSuccess,
  }) : super(key: key);

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final _authService = AdminAuthService();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  /// Handle login button press
  Future<void> _handleLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      _showError('Please fill in all fields');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _authService.loginAsAdmin(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );

      if (mounted) {
        if (result['success'] as bool) {
          // Get admin profile for display
          final profile = await _authService.getAdminProfile();
          final adminName = profile?['name'] ?? 'Admin';
          final adminEmail = profile?['email'] ?? _emailController.text;

          if (mounted) {
            widget.onLoginSuccess(adminName, adminEmail);
          }
        } else {
          _showError(result['message'] ?? 'Login failed');
          setState(() {
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        _showError('An error occurred: ${e.toString()}');
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  /// Show error snackbar
  void _showError(String message) {
    setState(() {
      _errorMessage = message;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AdminColors.error,
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 900;

    if (isDesktop) {
      return _buildDesktopLayout();
    } else {
      return _buildMobileLayout();
    }
  }

  /// Desktop layout with side-by-side design
  Widget _buildDesktopLayout() {
    return Scaffold(
      body: Row(
        children: [
          // Left side - Branding
          Expanded(
            child: Container(
              color: AdminColors.primary,
              padding: const EdgeInsets.all(AdminTheme.paddingXl),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(AdminTheme.radiusLg),
                      gradient: LinearGradient(
                        colors: [
                          Colors.white.withOpacity(0.3),
                          Colors.white.withOpacity(0.1),
                        ],
                      ),
                    ),
                    child: const Center(
                      child: Text(
                        'C',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 56,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AdminTheme.paddingXl),
                  const Text(
                    'Charitey',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: AdminTheme.paddingMd),
                  const Text(
                    'Admin Control Panel',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: AdminTheme.paddingXl),
                  const Opacity(
                    opacity: 0.8,
                    child: Text(
                      'Manage NGOs, donors, posts, donations, and volunteers from a single dashboard.',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        height: 1.6,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Right side - Login Form
          Expanded(
            child: Container(
              color: AdminColors.background,
              padding: const EdgeInsets.all(AdminTheme.paddingXl),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: _buildLoginForm(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Mobile layout with stacked design
  Widget _buildMobileLayout() {
    return Scaffold(
      backgroundColor: AdminColors.background,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AdminTheme.paddingLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AdminTheme.radiusLg),
                gradient: AdminColors.primaryGradient,
              ),
              child: const Center(
                child: Text(
                  'C',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 40,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AdminTheme.paddingLg),
            const Text(
              'Charitey Admin',
              style: TextStyle(
                color: AdminColors.textPrimary,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AdminTheme.paddingMd),
            const Text(
              'Sign in to continue',
              style: TextStyle(
                color: AdminColors.textSecondary,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: AdminTheme.paddingXl),
            _buildLoginForm(),
          ],
        ),
      ),
    );
  }

  /// Login form widget
  Widget _buildLoginForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Email Field
        TextField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          enabled: !_isLoading,
          decoration: InputDecoration(
            labelText: 'Email',
            hintText: 'admin@example.com',
            prefixIcon: const Icon(Icons.email_outlined),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
            ),
          ),
        ),

        const SizedBox(height: AdminTheme.paddingLg),

        // Password Field
        TextField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          enabled: !_isLoading,
          decoration: InputDecoration(
            labelText: 'Password',
            hintText: 'Enter your password',
            prefixIcon: const Icon(Icons.lock_outlined),
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword ? Icons.visibility_off : Icons.visibility,
              ),
              onPressed: () {
                setState(() {
                  _obscurePassword = !_obscurePassword;
                });
              },
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
            ),
          ),
        ),

        const SizedBox(height: AdminTheme.paddingLg),

        // Login Button
        ElevatedButton(
          onPressed: _isLoading ? null : _handleLogin,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
          child: _isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor:
                        AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                )
              : const Text(
                  'Sign In',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
        ),

        const SizedBox(height: AdminTheme.paddingMd),

        // Info message
        Container(
          padding: const EdgeInsets.all(AdminTheme.paddingMd),
          decoration: BoxDecoration(
            color: AdminColors.primaryLight,
            borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
            border: Border.all(color: AdminColors.primary),
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
                  'Admin access only. You must have the admin role assigned.',
                  style: TextStyle(
                    color: AdminColors.primaryDark,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
