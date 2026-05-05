import 'package:flutter/material.dart';
import 'admin_colors.dart';

/// Theme configuration for the admin panel
/// Material Design 3 compliant
class AdminTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: AdminColors.primary,
        secondary: AdminColors.secondary,
        surface: AdminColors.surface,
        background: AdminColors.background,
        error: AdminColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AdminColors.textPrimary,
        onBackground: AdminColors.textPrimary,
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: AdminColors.background,
      appBarTheme: const AppBarTheme(
        backgroundColor: AdminColors.surface,
        foregroundColor: AdminColors.textPrimary,
        elevation: 1,
        shadowColor: Color(0x1F000000),
        centerTitle: false,
      ),
      buttonTheme: const ButtonThemeData(
        buttonColor: AdminColors.primary,
        textTheme: ButtonTextTheme.primary,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AdminColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          elevation: 2,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AdminColors.primary,
          side: const BorderSide(color: AdminColors.primary, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AdminColors.primary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AdminColors.surfaceAlt,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AdminColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AdminColors.divider),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AdminColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AdminColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AdminColors.error, width: 2),
        ),
        labelStyle: const TextStyle(
          color: AdminColors.textSecondary,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        hintStyle: const TextStyle(
          color: AdminColors.textTertiary,
          fontSize: 14,
        ),
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: AdminColors.textPrimary,
        ),
        displayMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: AdminColors.textPrimary,
        ),
        displaySmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: AdminColors.textPrimary,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: AdminColors.textPrimary,
        ),
        headlineSmall: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AdminColors.textPrimary,
        ),
        titleLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AdminColors.textPrimary,
        ),
        titleMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AdminColors.textPrimary,
        ),
        titleSmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: AdminColors.textSecondary,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: AdminColors.textPrimary,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: AdminColors.textPrimary,
        ),
        bodySmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: AdminColors.textSecondary,
        ),
        labelLarge: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AdminColors.textPrimary,
        ),
        labelSmall: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AdminColors.textSecondary,
        ),
      ),
      cardTheme: CardTheme(
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AdminColors.divider),
        ),
        color: AdminColors.surface,
      ),
      dividerTheme: const DividerThemeData(
        color: AdminColors.divider,
        thickness: 1,
        space: 16,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AdminColors.surfaceAlt,
        disabledColor: AdminColors.divider,
        selectedColor: AdminColors.primary,
        secondarySelectedColor: AdminColors.secondary,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        labelStyle: const TextStyle(
          color: AdminColors.textPrimary,
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
        secondaryLabelStyle: const TextStyle(
          color: Colors.white,
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
        brightness: Brightness.light,
      ),
      dataTableTheme: DataTableThemeData(
        headingRowColor: MaterialStateProperty.all(AdminColors.surfaceAlt),
        dataRowColor: MaterialStateProperty.all(AdminColors.surface),
        decoration: BoxDecoration(
          border: Border.all(color: AdminColors.divider),
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  // Reusable padding/spacing constants
  static const double paddingXs = 4;
  static const double paddingSm = 8;
  static const double paddingMd = 16;
  static const double paddingLg = 24;
  static const double paddingXl = 32;

  // Border radius constants
  static const double radiusSm = 4;
  static const double radiusMd = 8;
  static const double radiusLg = 12;

  // Elevation constants
  static const double elevationSm = 1;
  static const double elevationMd = 4;
  static const double elevationLg = 8;
}
