import 'package:flutter/material.dart';
import '../theme/admin_colors.dart';
import '../theme/admin_theme.dart';

/// Loading skeleton for dashboard cards
class DashboardCardSkeleton extends StatefulWidget {
  final int count;

  const DashboardCardSkeleton({
    Key? key,
    this.count = 4,
  }) : super(key: key);

  @override
  State<DashboardCardSkeleton> createState() => _DashboardCardSkeletonState();
}

class _DashboardCardSkeletonState extends State<DashboardCardSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: widget.count,
      itemBuilder: (context, index) {
        return _SkeletonCard(
          animation: _animationController,
        );
      },
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  final AnimationController animation;

  const _SkeletonCard({
    Key? key,
    required this.animation,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ShimmerBox(
                    width: 80,
                    height: 12,
                    animation: animation,
                  ),
                  const SizedBox(height: 12),
                  _ShimmerBox(
                    width: 100,
                    height: 28,
                    animation: animation,
                  ),
                ],
              ),
              _ShimmerBox(
                width: 60,
                height: 60,
                animation: animation,
                borderRadius: 8,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Shimmer box for loading animation
class _ShimmerBox extends StatelessWidget {
  final double width;
  final double height;
  final AnimationController animation;
  final double borderRadius;

  const _ShimmerBox({
    Key? key,
    required this.width,
    required this.height,
    required this.animation,
    this.borderRadius = 4,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        final value = animation.value;
        final colors = [
          AdminColors.divider,
          AdminColors.surfaceAlt,
          AdminColors.divider,
        ];
        final stops = [0.0, 0.5, 1.0];

        return Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(borderRadius),
            gradient: LinearGradient(
              begin: Alignment(-1.0, 0.0),
              end: const Alignment(1.0, 0.0),
              stops: [
                (value - 0.5).clamp(0.0, 1.0),
                value.clamp(0.0, 1.0),
                (value + 0.5).clamp(0.0, 1.0),
              ],
              colors: colors,
            ),
          ),
        );
      },
    );
  }
}

/// Loading skeleton for data table
class DataTableSkeleton extends StatefulWidget {
  final int rowCount;

  const DataTableSkeleton({
    Key? key,
    this.rowCount = 5,
  }) : super(key: key);

  @override
  State<DataTableSkeleton> createState() => _DataTableSkeletonState();
}

class _DataTableSkeletonState extends State<DataTableSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AdminColors.divider),
        borderRadius: BorderRadius.circular(AdminTheme.radiusMd),
      ),
      child: Column(
        children: [
          // Header
          Container(
            color: AdminColors.surfaceAlt,
            padding: const EdgeInsets.all(AdminTheme.paddingMd),
            child: Row(
              children: [
                Expanded(
                  flex: 2,
                  child: _ShimmerBox(
                    width: 100,
                    height: 14,
                    animation: _animationController,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: _ShimmerBox(
                    width: 100,
                    height: 14,
                    animation: _animationController,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 1,
                  child: _ShimmerBox(
                    width: 50,
                    height: 14,
                    animation: _animationController,
                  ),
                ),
              ],
            ),
          ),
          // Rows
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: widget.rowCount,
            separatorBuilder: (context, index) => const Divider(
              height: 1,
              color: AdminColors.divider,
            ),
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.all(AdminTheme.paddingMd),
                child: Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: _ShimmerBox(
                        width: 100,
                        height: 14,
                        animation: _animationController,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      flex: 2,
                      child: _ShimmerBox(
                        width: 100,
                        height: 14,
                        animation: _animationController,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      flex: 1,
                      child: _ShimmerBox(
                        width: 50,
                        height: 14,
                        animation: _animationController,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

/// Generic loading skeleton
class LoadingSkeleton extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const LoadingSkeleton({
    Key? key,
    required this.width,
    required this.height,
    this.borderRadius = 4,
  }) : super(key: key);

  @override
  State<LoadingSkeleton> createState() => _LoadingSkeletonState();
}

class _LoadingSkeletonState extends State<LoadingSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _ShimmerBox(
      width: widget.width,
      height: widget.height,
      animation: _animationController,
      borderRadius: widget.borderRadius,
    );
  }
}
