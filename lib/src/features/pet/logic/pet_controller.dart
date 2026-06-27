import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

import '../data/pet_repository.dart';
import '../domain/pet_state.dart';

class PetController extends ChangeNotifier {
  PetController(this._repository);

  final PetRepository _repository;
  final Random _random = Random();
  PetState _state = PetState.initial();
  Timer? _tick;

  PetState get state => _state;

  static const foodCost = 5;

  Future<void> init() async {
    _state = await _repository.load();
    _applyDecayFromLastSeen();
    _schedule();
    notifyListeners();
  }

  void _applyDecayFromLastSeen() {
    final now = DateTime.now();
    final minutes = now.difference(_state.updatedAt).inMinutes;
    if (minutes <= 0) return;
    _state = _state.copyWith(
      hunger: (_state.hunger - minutes).clamp(0, 100),
      happiness: (_state.happiness - (minutes ~/ 2)).clamp(0, 100),
      energy: _state.sleeping
          ? (_state.energy + minutes).clamp(0, 100)
          : (_state.energy - (minutes ~/ 2)).clamp(0, 100),
      updatedAt: now,
    );
    _repository.save(_state);
  }

  void _schedule() {
    _tick?.cancel();
    _tick = Timer.periodic(const Duration(seconds: 10), (_) {
      _state = _state.copyWith(
        hunger: (_state.hunger - 1).clamp(0, 100),
        happiness: (_state.happiness - 1).clamp(0, 100),
        energy: _state.sleeping
            ? (_state.energy + 1).clamp(0, 100)
            : (_state.energy - 1).clamp(0, 100),
        updatedAt: DateTime.now(),
      );
      _repository.save(_state);
      notifyListeners();
    });
  }

  void feed() {
    if (_state.coins < foodCost) return;
    _state = _state.copyWith(
      hunger: (_state.hunger + 25).clamp(0, 100),
      happiness: (_state.happiness + 5).clamp(0, 100),
      coins: _state.coins - foodCost,
      updatedAt: DateTime.now(),
    );
    _repository.save(_state);
    notifyListeners();
  }

  void toggleSleep() {
    _state = _state.copyWith(sleeping: !_state.sleeping, updatedAt: DateTime.now());
    _repository.save(_state);
    notifyListeners();
  }

  void petTouched() {
    _state = _state.copyWith(
      happiness: (_state.happiness + _random.nextInt(4) + 2).clamp(0, 100),
      updatedAt: DateTime.now(),
    );
    _repository.save(_state);
    notifyListeners();
  }

  void earnCoins(int amount) {
    _state = _state.copyWith(coins: _state.coins + amount, updatedAt: DateTime.now());
    _repository.save(_state);
    notifyListeners();
  }

  void buyCustomization({int? colorIndex, int? accessoryIndex, required int cost}) {
    if (_state.coins < cost) return;
    _state = _state.copyWith(
      coins: _state.coins - cost,
      colorIndex: colorIndex ?? _state.colorIndex,
      accessoryIndex: accessoryIndex ?? _state.accessoryIndex,
      updatedAt: DateTime.now(),
    );
    _repository.save(_state);
    notifyListeners();
  }

  @override
  void dispose() {
    _tick?.cancel();
    super.dispose();
  }
}
