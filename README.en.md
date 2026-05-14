<div align="center">

<h1>Breakverse</h1>

<h3>Daily Annoyance Monster Breaker</h3>

<p>
  <em>"Turn today's tiny annoyance into a ridiculous monster, beat it, and share the receipt."</em><br>
  <em>「把今天的小破事，打成一张能发群的战报。」</em>
</p>

<p>
  <a href="./README.md">简体中文</a>
  ·
  <a href="./README.en.md"><strong>English</strong></a>
</p>

<p>
  <img alt="Version v0.4.0" src="https://img.shields.io/badge/version-v0.4.0-35f2ff?style=for-the-badge">
  <img alt="License Personal Use Only" src="https://img.shields.io/badge/license-personal_use_only-ff7a45?style=for-the-badge">
  <img alt="Runtime HTML5 Canvas" src="https://img.shields.io/badge/runtime-HTML5_Canvas-8b5cf6?style=for-the-badge">
  <img alt="Backend Python Account API" src="https://img.shields.io/badge/backend-Python_account_API-4ee18a?style=for-the-badge">
  <img alt="Status Playable Preview" src="https://img.shields.io/badge/status-playable_preview-ff5aa5?style=for-the-badge">
</p>

<p>
  <strong>Current version:</strong> v0.4.0
  ·
  <strong>Main file:</strong> <code>index.html</code>
  ·
  <strong>Optional server:</strong> <code>server.py</code>
</p>

</div>

---

Breakverse is a silly, shareable HTML5 Canvas action game about turning everyday annoyances into cute but punchable monsters. Pick a loadout, clear a five-stage route, collect ridiculous gear, unlock achievements, and generate a battle report card that is actually worth sharing.

## Quick Start

Offline single-player mode:

```bash
open index.html
```

Account, cloud save, and admin mode:

```bash
python3 server.py
```

The default URL is `http://localhost:4173`. The game itself remains a self-contained `index.html`; `server.py` only provides account, session, cloud save, and admin APIs.

> This repository does not include a formal open-source license yet. Treat it as personal-use-only for learning, playtesting, and private preview. Commercial use or redistribution requires prior permission.

## Current Gameplay

- Type a small daily annoyance, then generate it into a "most annoying today" monster poster.
- Choose a major chapter, difficulty, starter species, and four equipment slots: main weapon, secondary weapon, skill 1, and skill 2.
- Fight in a side-scrolling Canvas arena with movement, jumping, three-hit melee strings, perfect dodge, secondary attacks, active skills, and rage supers.
- Each major chapter contains a continuous five-stage route: warm-up, elite encounter, special mechanic, collection stage, and final monster.
- Monsters have phases, readable telegraphs, glowing weak points, and world-specific environmental interactions.
- Small enemies, elites, and stage-clear rewards drop equipment or fragments based on the current chapter type.
- "My Breakverse" separates the collection hub into equipment, chapters, achievements, monster codex, and easter egg goals.
- Daily goals nudge players toward different chapters, combos, sharing, and easter egg hunting.
- The result screen creates a punchy share caption and a downloadable battle report card.

## Major Chapters

| Chapter | Core Play | Recommended Gear |
| --- | --- | --- |
| Chapter 1: Melee Arsenal | Close-range interrupts, three-hit strings, melee damage bonus | Smoking Keyboard, Stretch Slipper, Stamp Hammer |
| Chapter 2: Ranged Roast Desk | Spacing, projectiles, ranged damage bonus | Cold Joke Megaphone, Laser Pointer, Receipt Crossbow |
| Chapter 3: Hybrid Station | Swap between ranged openers and melee finishers | Dual Pens, Sticky Note Mine, Coffee Dash Cup |
| Chapter 4: Dodge Parkour Tower | Hazards, bounce zones, perfect dodge rewards | On-Time Spring Shoes, Idea Jetpack, Social Anxiety Charm |

## Difficulty

| Difficulty | Changes |
| --- | --- |
| Juan | Relaxed run with lower monster HP and damage |
| Very Juan | Standard challenge with slightly better drops |
| Super Juan | Faster, tougher monsters and better loot |
| Juan to Death | High-pressure challenge with the best drop multiplier and a dedicated achievement |

## Controls

| Key | Action |
| --- | --- |
| `A` / `D` or `Left` / `Right` | Move |
| `W` / `Space` / `Up` | Jump |
| `J` | Three-hit melee attack |
| `K` | Dodge, with perfect dodge timing |
| `L` | Secondary weapon, or rage super when full |
| `U` | Skill 1 |
| `I` | Skill 2 |

On mobile, battle mode switches to a fixed viewport with movement and jump controls on the left, and attack, dodge, and skill buttons on the right.

## Account System

The optional Python server includes built-in account APIs with no extra dependencies:

- Register, log in, and log out.
- Passwords are stored with PBKDF2-HMAC-SHA256.
- Sessions use `HttpOnly` cookies and last 7 days by default.
- The first registered account automatically becomes an admin.
- Logged-in users can upload and pull cloud saves.
- Admins can view accounts, enable or disable accounts, and change player or admin roles.

Account data is stored by default at:

```bash
data/accounts.json
```

That file is ignored by Git and should not be committed. For production deployment, configure:

```bash
PORT=4173
BREAKVERSE_DATA_DIR=/path/to/private-data
BREAKVERSE_SESSION_TTL=604800
BREAKVERSE_COOKIE_SECURE=1
```

## Content

Worlds:

- Office Chaos
- Social Feed Storm
- Family Dinner Table
- Commute Oddities
- Creative Traffic Jam
- Time Scramble

Example monsters:

- PPT Version Eight
- Unread Message Octopus
- Dinner Question Hot Pot
- Elevator Never-Arrives King
- Idea Traffic Cone
- Monday Alarm Rooster
- Parcel Locker Riddle Master
- Meeting Microphone Echo Hero

Example equipment:

- Smoking Keyboard
- Stretch Slipper
- Cold Joke Megaphone
- Stamp Hammer
- Laser Pointer
- Receipt Crossbow
- Dual Pens
- Question Bubble Wand
- Milk Tea Shield Cup
- Overtime Cape
- Anti-Overthinking Pot Lid
- Social Anxiety Charm
- Client Radar
- Meme Belt
- Idea Jetpack
- Sticky Note Mine
- On-Time Spring Shoes
- Red Packet Drone
- Coffee Dash Cup
- Confetti Shield Orb

## Technical Structure

`index.html` contains:

- Data-driven content tables for worlds, monsters, equipment, and drops.
- Four major chapter routes: melee, ranged, hybrid, and dodge parkour.
- Four difficulty levels that affect HP, damage, speed, attack rate, and drop rate.
- Starter species, quick presets, and chapter-recommended loadouts.
- Equipment loadouts with main weapon, secondary weapon, and two active skills.
- Local monster generator with keyword matching, random variants, and public-text sanitization.
- Save system for gear, codex, chapter clears, achievements, stats, history, and daily goals.
- Combat systems for physics, collision, three-hit strings, perfect dodge, active skills, rage, monster patterns, route mechanics, stage-clear rewards, and random easter eggs.
- Canvas rendering for parallax worlds, layered player gear, particles, damage numbers, and battle prompts.
- Sharing tools for copy-ready captions and Canvas-generated report cards.

`server.py` provides:

- Static file hosting.
- Account registration and login.
- Session cookies.
- Cloud save upload and download.
- Admin account management.

## Changelog

| Version | Date | Notes |
| --- | --- | --- |
| `v0.4.0` | 2026-05-11 | Productization pass: redesigned "My Breakverse" into separate equipment, chapter, achievement, monster codex, and easter egg goal sections; added battle route progress; added stage-clear rewards based on chapter type; sorted equipment by chapter recommendations; added daily and easter egg goals; merged account system, cloud save sync, admin management, and mobile battle viewport fixes. |
| `v0.3.0` | 2026-05-11 | Added four major chapters, five-stage routes, four difficulty levels, starter species, quick presets, expanded equipment, chapter-aware drops, achievements, random easter eggs, and stronger share captions. |
| `v0.2.0` | 2026-05-10 | Rebuilt the tone into a funny stress-relief game, added weapons, secondary weapons, two active skills, rage supers, route structure, enemy drops, Chinese stat glyphs, equipment icon fixes, and upgraded battle report sharing. |

## Roadmap

- Add more unique moves for each final monster.
- Add a full equipment crafting interface and recipe animations.
- Expand endless mode rankings and daily challenge comparisons.
- Add an optional backend generator while keeping offline mode.
