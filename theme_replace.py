import os
import re

replacements = {
    "今日烦人兽爆破局": "解压大冒险",
    "人间炼狱": "日常碎碎念",
    "烦人兽": "小烦恼",
    "破防宇宙": "解压宇宙",
    "爆破局": "解压局",
    "卷死": "宗师",
    "非常卷": "大师",
    "很卷": "进阶",
    "卷": "休闲",
    "爆破宇宙": "解压宇宙",
    "恶魔": "淘气鬼",
    "BOSS": "大首领",
    "Boss": "大首领"
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for k, v in replacements.items():
            new_content = new_content.replace(k, v)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.md')):
            replace_in_file(os.path.join(root, file))

print("Theme replacement complete!")
