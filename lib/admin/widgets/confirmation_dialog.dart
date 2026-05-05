import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

/// Reusable confirmation dialog for sensitive actions
class ConfirmationDialog extends StatelessWidget {
  final String title;
  final String message;
  final String confirmButtonText;
  final String cancelButtonText;
  final VoidCallback onConfirm;
  final VoidCallback? onCancel;
  final Color? confirmButtonColor;
  final bool isDangerous; // Make confirm button red if true

  const ConfirmationDialog({
    Key? key,
    required this.title,
    required this.message,
    this.confirmButtonText = 'Confirm',
    this.cancelButtonText = 'Cancel',
    required this.onConfirm,
    this.onCancel,
    this.confirmButtonColor,
    this.isDangerous = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final btnColor = confirmButtonColor ??
        (isDangerous ? AdminColors.error : AdminColors.primary);

    return AlertDialog(
      title: Text(
        title,
        style: const TextStyle(
          color: AdminColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      content: Text(
        message,
        style: const TextStyle(
          color: AdminColors.textSecondary,
          fontSize: 14,
          height: 1.5,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            if (onCancel != null) onCancel!();
            Navigator.of(context).pop();
          },
          child: Text(
            cancelButtonText,
            style: const TextStyle(
              color: AdminColors.textSecondary,
            ),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            onConfirm();
            Navigator.of(context).pop();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: btnColor,
            foregroundColor: Colors.white,
          ),
          child: Text(confirmButtonText),
        ),
      ],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      backgroundColor: AdminColors.surface,
      shadowColor: const Color(0x1F000000),
      elevation: 4,
    );
  }

  /// Show confirmation dialog
  static Future<void> show({
    required BuildContext context,
    required String title,
    required String message,
    required VoidCallback onConfirm,
    String confirmButtonText = 'Confirm',
    String cancelButtonText = 'Cancel',
    VoidCallback? onCancel,
    Color? confirmButtonColor,
    bool isDangerous = false,
  }) {
    return showDialog(
      context: context,
      builder: (context) => ConfirmationDialog(
        title: title,
        message: message,
        onConfirm: onConfirm,
        onCancel: onCancel,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: confirmButtonColor,
        isDangerous: isDangerous,
      ),
    );
  }
}

/// Success dialog
class SuccessDialog extends StatelessWidget {
  final String title;
  final String message;
  final String buttonText;
  final VoidCallback? onDismiss;

  const SuccessDialog({
    Key? key,
    required this.title,
    required this.message,
    this.buttonText = 'Done',
    this.onDismiss,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      icon: Container(
        padding: const EdgeInsets.all(AdminTheme.paddingMd),
        decoration: BoxDecoration(
          color: AdminColors.successLight,
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.check_circle,
          color: AdminColors.success,
          size: 32,
        ),
      ),
      title: Text(
        title,
        style: const TextStyle(
          color: AdminColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      content: Text(
        message,
        style: const TextStyle(
          color: AdminColors.textSecondary,
          fontSize: 14,
        ),
      ),
      actions: [
        ElevatedButton(
          onPressed: () {
            if (onDismiss != null) onDismiss!();
            Navigator.of(context).pop();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AdminColors.success,
          ),
          child: Text(buttonText),
        ),
      ],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      backgroundColor: AdminColors.surface,
    );
  }

  static Future<void> show({
    required BuildContext context,
    required String title,
    required String message,
    String buttonText = 'Done',
    VoidCallback? onDismiss,
  }) {
    return showDialog(
      context: context,
      builder: (context) => SuccessDialog(
        title: title,
        message: message,
        buttonText: buttonText,
        onDismiss: onDismiss,
      ),
    );
  }
}

/// Error dialog
class ErrorDialog extends StatelessWidget {
  final String title;
  final String message;
  final String buttonText;
  final VoidCallback? onDismiss;

  const ErrorDialog({
    Key? key,
    required this.title,
    required this.message,
    this.buttonText = 'OK',
    this.onDismiss,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      icon: Container(
        padding: const EdgeInsets.all(AdminTheme.paddingMd),
        decoration: BoxDecoration(
          color: AdminColors.errorLight,
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.error_circle,
          color: AdminColors.error,
          size: 32,
        ),
      ),
      title: Text(
        title,
        style: const TextStyle(
          color: AdminColors.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      content: Text(
        message,
        style: const TextStyle(
          color: AdminColors.textSecondary,
          fontSize: 14,
        ),
      ),
      actions: [
        ElevatedButton(
          onPressed: () {
            if (onDismiss != null) onDismiss!();
            Navigator.of(context).pop();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AdminColors.error,
          ),
          child: Text(buttonText),
        ),
      ],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      backgroundColor: AdminColors.surface,
    );
  }

  static Future<void> show({
    required BuildContext context,
    required String title,
    required String message,
    String buttonText = 'OK',
    VoidCallback? onDismiss,
  }) {
    return showDialog(
      context: context,
      builder: (context) => ErrorDialog(
        title: title,
        message: message,
        buttonText: buttonText,
        onDismiss: onDismiss,
      ),
    );
  }
}
