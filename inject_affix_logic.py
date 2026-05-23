import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply affix modifiers in initBattle
affix_apply_logic = """  const bossMax = Math.round((480 + (current大首领.seed % 120)) * current大首领.hpScale * (current大首领.affix?.id === 'tank' ? 1.5 : 1));
  const bossSpeedScale = current大首领.affix?.id === 'swift' ? 1.5 : 1;
  const bossThorns = current大首领.affix?.id === 'thorns' ? 0.1 : 0;
  const bossVampire = current大首领.affix?.id === 'vampiric' ? 0.2 : 0;
  const bossBerserk = current大首领.affix?.id === 'berserk' ? true : false;
"""

content = content.replace("  const bossMax = Math.round((480 + (current大首领.seed % 120)) * current大首领.hpScale);", affix_apply_logic)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Affix mechanics injected!")
