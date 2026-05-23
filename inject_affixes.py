import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add affixes array to CONTENT
affixes_str = """  affixes: [
    { id: 'vampiric', name: '吸血', desc: '攻击附带吸血效果', color: '#ff6b6b' },
    { id: 'berserk', name: '狂暴', desc: '低血量时攻击速度翻倍', color: '#ff4fd8' },
    { id: 'tank', name: '坚壁', desc: '拥有额外护盾', color: '#4de0ff' },
    { id: 'swift', name: '迅捷', desc: '移动速度极大提升', color: '#35f2ff' },
    { id: 'thorns', name: '反伤', desc: '反弹部分受到的近战伤害', color: '#b66dff' },
  ],
  bosses: ["""

content = content.replace("bosses: [", affixes_str, 1)

# Modify make大首领 to pick an affix if difficulty is super or dead
affix_logic = """  const drop = dropPool[Math.floor(rng()*dropPool.length)] || base.drops[0];
  
  // Commercialization: Elite Affixes
  let activeAffix = null;
  if (difficultyId === 'super' || difficultyId === 'dead') {
    const affixList = CONTENT.affixes;
    activeAffix = affixList[Math.floor(rng() * affixList.length)];
  }
  
  current大首领 = {"""

content = content.replace("const drop = dropPool[Math.floor(rng()*dropPool.length)] || base.drops[0];\n  current大首领 = {", affix_logic)

# Add affix to current大首领 object
boss_obj_replace = """    drop,
    affix: activeAffix,
    route: buildRoute"""

content = content.replace("drop,\n    route: buildRoute", boss_obj_replace)

# Modify renderDossier to display the affix
dossier_html = """$('#bossTags').innerHTML = [...current大首领.tags, w.name, diff.note].map(t => `<span class="pill">${t}</span>`).join('');
  if (current大首领.affix) {
    $('#bossTags').innerHTML += `<span class="pill" style="color:#000;background:${current大首领.affix.color};border:none;">精英词缀：${current大首领.affix.name} (${current大首领.affix.desc})</span>`;
  }"""

content = content.replace("$('#bossTags').innerHTML = [...current大首领.tags, w.name, diff.note].map(t => `<span class=\"pill\">${t}</span>`).join('');", dossier_html)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Affixes injected!")
