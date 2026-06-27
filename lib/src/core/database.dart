import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class AppDatabase {
  static final AppDatabase instance = AppDatabase._();
  AppDatabase._();

  Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _init();
    return _db!;
  }

  Future<Database> _init() async {
    final basePath = await getDatabasesPath();
    final path = join(basePath, 'tomo_pet.db');
    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE pet_state(
            id INTEGER PRIMARY KEY,
            hunger INTEGER,
            energy INTEGER,
            happiness INTEGER,
            coins INTEGER,
            colorIndex INTEGER,
            accessoryIndex INTEGER,
            sleeping INTEGER,
            updatedAt INTEGER
          )
        ''');
      },
    );
  }
}
