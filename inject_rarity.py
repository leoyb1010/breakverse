import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add rarity to equipment
def add_rarity(match):
    eq = match.group(0)
    if "'keyboard'" in eq or "'loudspeaker'" in eq or "'milkTea'" in eq or "'memeBelt'" in eq:
        # Initial equipment = common
        return eq.replace("slot:", "rarity:'common', slot:")
    elif "'slipper'" in eq or "'laserPointer'" in eq or "'stampHammer'" in eq:
        return eq.replace("slot:", "rarity:'rare', slot:")
    elif "'dualPens'" in eq or "'bubbleWand'" in eq or "'jetpack'" in eq or "'stickyMine'" in eq:
        return eq.replace("slot:", "rarity:'epic', slot:")
    else:
        # Others legendary or epic
        return eq.replace("slot:", "rarity:'legendary', slot:")

content = re.sub(r'\{ id:\'.*?\', name:\'.*?\', short:\'.*?\', slot:\'(weapon|skill)\'.*?\}', add_rarity, content, flags=re.DOTALL)

# Add rarity colors to CSS
css_additions = """
.rarity-common { border-color: #aeb7c9 !important; box-shadow: inset 0 0 0 1px rgba(174,183,201,0.2) !important; }
.rarity-rare { border-color: #4de0ff !important; box-shadow: inset 0 0 0 1px rgba(77,224,255,0.2) !important; }
.rarity-epic { border-color: #b66dff !important; box-shadow: inset 0 0 0 1px rgba(182,109,255,0.2) !important; }
.rarity-legendary { border-color: #ffd700 !important; box-shadow: inset 0 0 0 1px rgba(255,215,0,0.3), 0 0 8px rgba(255,215,0,0.4) !important; }
.gear-card.rarity-legendary strong { color: #ffd700; text-shadow: 0 0 8px rgba(255,215,0,0.4); }
.gear-card.rarity-epic strong { color: #b66dff; }
.gear-card.rarity-rare strong { color: #4de0ff; }
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css_additions)

# Update gearCard rendering to include rarity class
content = content.replace('`<button class="gear-card ${unlocked || trial?\'\':\'locked\'} ${equipped?\'equipped\':\'\'} ${hot?\'recommended\':\'\'}" data-gear="${e.id}">',
                          '`<button class="gear-card rarity-${e.rarity || \'common\'} ${unlocked || trial?\'\':\'locked\'} ${equipped?\'equipped\':\'\'} ${hot?\'recommended\':\'\'}" data-gear="${e.id}">')

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Rarity injected!")
