import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../features/audio/logic/voice_controller.dart';
import '../features/pet/data/pet_repository.dart';
import '../features/pet/logic/pet_controller.dart';
import '../features/pet/presentation/widgets/pet_character.dart';

class TomoPetApp extends StatelessWidget {
  const TomoPetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => PetController(PetRepository())..init(),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Tomo Pet Offline',
        theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),
        home: const MainScreen(),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _index = 0;
  int _tapScore = 0;
  final VoiceController _voice = VoiceController();

  static const petColors = [Colors.teal, Colors.pink, Colors.blueGrey, Colors.orange];

  @override
  void dispose() {
    _voice.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pet = context.watch<PetController>();
    final s = pet.state;
    return Scaffold(
      appBar: AppBar(title: Text('Coins: ${s.coins}')),
      body: IndexedStack(
        index: _index,
        children: [
          _buildHome(pet),
          _buildFood(pet),
          _buildGame(pet),
          _buildShop(pet),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.pets), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.restaurant), label: 'Food'),
          NavigationDestination(icon: Icon(Icons.sports_esports), label: 'Game'),
          NavigationDestination(icon: Icon(Icons.store), label: 'Shop'),
        ],
      ),
    );
  }

  Widget _buildHome(PetController pet) {
    final s = pet.state;
    return Stack(
      children: [
        if (s.sleeping)
          Container(color: Colors.black.withOpacity(0.75)),
        Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            PetCharacter(
              color: petColors[s.colorIndex % petColors.length],
              sleeping: s.sleeping,
              accessoryIndex: s.accessoryIndex,
              onTouch: pet.petTouched,
            ),
            const SizedBox(height: 20),
            _meter('Hunger', s.hunger),
            _meter('Energy', s.energy),
            _meter('Happiness', s.happiness),
            Wrap(spacing: 8, children: [
              ElevatedButton.icon(
                onPressed: pet.toggleSleep,
                icon: const Icon(Icons.nightlight),
                label: Text(s.sleeping ? 'Wake Up' : 'Sleep'),
              ),
              ElevatedButton.icon(
                onPressed: _voice.startRecording,
                icon: const Icon(Icons.mic),
                label: const Text('Record'),
              ),
              ElevatedButton.icon(
                onPressed: () async {
                  await _voice.stopRecording();
                  await _voice.playFunny();
                },
                icon: const Icon(Icons.play_arrow),
                label: const Text('Play Funny Voice'),
              ),
            ])
          ]),
        ),
      ],
    );
  }

  Widget _buildFood(PetController pet) => Center(
        child: ElevatedButton(
          onPressed: pet.feed,
          child: const Text('Feed pet (5 coins)'),
        ),
      );

  Widget _buildGame(PetController pet) => Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text('Tap score: $_tapScore'),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () => setState(() => _tapScore++),
            child: const Text('Tap me!'),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () {
              pet.earnCoins(_tapScore);
              setState(() => _tapScore = 0);
            },
            child: const Text('Claim coins'),
          )
        ]),
      );

  Widget _buildShop(PetController pet) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Colors (10 coins)'),
          Wrap(
            spacing: 8,
            children: List.generate(
              petColors.length,
              (i) => OutlinedButton(
                onPressed: () => pet.buyCustomization(colorIndex: i, cost: 10),
                child: Text('Color ${i + 1}'),
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Accessory: Crown (15 coins)'),
          OutlinedButton(
            onPressed: () => pet.buyCustomization(accessoryIndex: 1, cost: 15),
            child: const Text('Buy/Equip Crown'),
          ),
        ],
      );

  Widget _meter(String name, int value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('$name: $value'),
        LinearProgressIndicator(value: value / 100),
      ]),
    );
  }
}
