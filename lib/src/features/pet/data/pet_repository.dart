import 'package:sqflite/sqflite.dart';

import '../../../core/database.dart';
import '../domain/pet_state.dart';

class PetRepository {
  Future<PetState> load() async {
    final db = await AppDatabase.instance.database;
    final rows = await db.query('pet_state', where: 'id = ?', whereArgs: [1]);
    if (rows.isEmpty) {
      final initial = PetState.initial();
      await save(initial);
      return initial;
    }
    return _fromMap(rows.first);
  }

  Future<void> save(PetState state) async {
    final db = await AppDatabase.instance.database;
    await db.insert(
      'pet_state',
      _toMap(state),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Map<String, Object?> _toMap(PetState s) => {
        'id': 1,
        'hunger': s.hunger,
        'energy': s.energy,
        'happiness': s.happiness,
        'coins': s.coins,
        'colorIndex': s.colorIndex,
        'accessoryIndex': s.accessoryIndex,
        'sleeping': s.sleeping ? 1 : 0,
        'updatedAt': s.updatedAt.millisecondsSinceEpoch,
      };

  PetState _fromMap(Map<String, Object?> m) => PetState(
        hunger: m['hunger'] as int,
        energy: m['energy'] as int,
        happiness: m['happiness'] as int,
        coins: m['coins'] as int,
        colorIndex: m['colorIndex'] as int,
        accessoryIndex: m['accessoryIndex'] as int,
        sleeping: (m['sleeping'] as int) == 1,
        updatedAt: DateTime.fromMillisecondsSinceEpoch(m['updatedAt'] as int),
      );
}
