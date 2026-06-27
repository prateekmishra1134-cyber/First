import 'dart:math';

import 'package:flutter/material.dart';

class PetCharacter extends StatefulWidget {
  const PetCharacter({
    super.key,
    required this.color,
    required this.sleeping,
    required this.accessoryIndex,
    required this.onTouch,
  });

  final Color color;
  final bool sleeping;
  final int accessoryIndex;
  final VoidCallback onTouch;

  @override
  State<PetCharacter> createState() => _PetCharacterState();
}

class _PetCharacterState extends State<PetCharacter>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 2),
  )..repeat(reverse: true);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTouch,
      onPanUpdate: (_) => widget.onTouch(),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (_, __) {
          final breath = 1 + (_controller.value * 0.04);
          final blink = sin(_controller.value * pi * 4).abs() < 0.1;
          return Transform.scale(
            scale: breath,
            child: CustomPaint(
              size: const Size(220, 220),
              painter: _PetPainter(
                color: widget.color,
                sleeping: widget.sleeping,
                blink: blink,
                accessoryIndex: widget.accessoryIndex,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _PetPainter extends CustomPainter {
  _PetPainter({required this.color, required this.sleeping, required this.blink, required this.accessoryIndex});

  final Color color;
  final bool sleeping;
  final bool blink;
  final int accessoryIndex;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final body = Paint()..color = color;
    canvas.drawCircle(center, 80, body);
    final eyePaint = Paint()..color = Colors.black;
    if (sleeping || blink) {
      canvas.drawLine(const Offset(82, 100), const Offset(102, 100), eyePaint);
      canvas.drawLine(const Offset(118, 100), const Offset(138, 100), eyePaint);
    } else {
      canvas.drawCircle(const Offset(92, 100), 7, eyePaint);
      canvas.drawCircle(const Offset(128, 100), 7, eyePaint);
    }
    canvas.drawArc(const Rect.fromLTWH(90, 118, 40, 25), 0, pi, false, eyePaint..style = PaintingStyle.stroke..strokeWidth = 3);
    if (accessoryIndex == 1) {
      canvas.drawCircle(const Offset(110, 54), 14, Paint()..color = Colors.amber);
    }
  }

  @override
  bool shouldRepaint(covariant _PetPainter oldDelegate) => true;
}
