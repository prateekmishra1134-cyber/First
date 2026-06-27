import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';

class VoiceController {
  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayer _player = AudioPlayer();
  String? _lastPath;

  Future<void> startRecording() async {
    if (await _recorder.hasPermission()) {
      final dir = await getApplicationDocumentsDirectory();
      _lastPath = '${dir.path}/voice_note.m4a';
      await _recorder.start(const RecordConfig(), path: _lastPath!);
    }
  }

  Future<void> stopRecording() async {
    await _recorder.stop();
  }

  Future<void> playFunny() async {
    final path = _lastPath;
    if (path == null || !File(path).existsSync()) return;
    await _player.setPlaybackRate(1.35);
    await _player.play(DeviceFileSource(path));
  }

  Future<void> dispose() async {
    await _recorder.dispose();
    await _player.dispose();
  }
}
