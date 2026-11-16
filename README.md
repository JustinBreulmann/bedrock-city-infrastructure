# Bedrock City Infrastructure & Smartphone OS

[![Minecraft Bedrock](https://img.shields.io/badge/Minecraft-Bedrock%201.21.60%2B-green.svg)](https://minecraft.net/)
[![Mojang Creator Tools](https://img.shields.io/badge/Tooling-mctools.dev-blue.svg)](https://mctools.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Creator](https://img.shields.io/badge/Creator-JustinBreulmann-orange.svg)](https://github.com/JustinBreulmann)

Complete City Life roleplay suite: in-game Smartphone OS (bank, messenger, maps, music, shop), multi-career Job system, plots/land claiming, automated elevators & security vaults

---

## 📦 Architektur & Übersicht

Dieses Repository ist Teil der modularen **Divide & Conquer**-Architektur für Minecraft Bedrock, modularisiert aus monolithischen Welten und ausgerichtet nach offiziellen Standards von [Mojang Creator Tools (mctools.dev)](https://mctools.dev/).

### Pack-Identifikatoren
- **Behavior Pack UUID**: `6d6a05c6-76ba-426d-8b89-cfc8c3a7f4d7`
- **Resource Pack UUID**: `6d747d32-a68d-4609-8a16-700594a2ab6d`
- **Zielversion**: Minecraft Bedrock 1.21.0 - 1.21.60+ (Neueste Version)
- **Script Engine**: `@minecraft/server` v1.14.0+ / `@minecraft/server-ui` v1.3.0+

---

## 📂 Projektstruktur

```
bedrock-city-infrastructure/
├── behavior_packs/
│   └── bedrock_city_infrastructure_bp/
│       ├── manifest.json
│       └── scripts/
│           └── main.js
├── resource_packs/
│   └── bedrock_city_infrastructure_rp/
│       ├── manifest.json
│       └── textures / models / sounds
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Bedrock Verlinkung

### Methode 1: Direkt in Minecraft-Welt verlinken (NTFS Junctions)
1. Repository klonen:
   ```bash
   git clone https://github.com/JustinBreulmann/bedrock-city-infrastructure.git
   ```
2. Verzeichnis-Junctions erstellen:
   - Behavior Pack -> `<welt>/behavior_packs/bedrock_city_infrastructure_bp`
   - Resource Pack -> `<welt>/resource_packs/bedrock_city_infrastructure_rp`

### Methode 2: Globaler Development-Ordner
Verlinkung in `development_behavior_packs` bzw. `development_resource_packs` im `com.mojang`-Verzeichnis für weltübergreifendes Live-Testing.

---

## 🛠️ Entwicklung & Tooling
Unterstützt moderne Tooling-Standards kompatibel mit `@minecraft/creator-tools`:
```bash
npm install
npm test
```

## 📄 Lizenz
MIT License © Justin Breulmann
