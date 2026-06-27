class PetState {
  final int hunger;
  final int energy;
  final int happiness;
  final int coins;
  final int colorIndex;
  final int accessoryIndex;
  final bool sleeping;
  final DateTime updatedAt;

  const PetState({
    required this.hunger,
    required this.energy,
    required this.happiness,
    required this.coins,
    required this.colorIndex,
    required this.accessoryIndex,
    required this.sleeping,
    required this.updatedAt,
  });

  factory PetState.initial() => PetState(
        hunger: 100,
        energy: 100,
        happiness: 100,
        coins: 20,
        colorIndex: 0,
        accessoryIndex: 0,
        sleeping: false,
        updatedAt: DateTime.now(),
      );

  PetState copyWith({
    int? hunger,
    int? energy,
    int? happiness,
    int? coins,
    int? colorIndex,
    int? accessoryIndex,
    bool? sleeping,
    DateTime? updatedAt,
  }) {
    return PetState(
      hunger: hunger ?? this.hunger,
      energy: energy ?? this.energy,
      happiness: happiness ?? this.happiness,
      coins: coins ?? this.coins,
      colorIndex: colorIndex ?? this.colorIndex,
      accessoryIndex: accessoryIndex ?? this.accessoryIndex,
      sleeping: sleeping ?? this.sleeping,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
