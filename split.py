import re

with open('../index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if css_match:
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css_match.group(1).strip())

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if js_match:
    with open('src/main.js', 'w', encoding='utf-8') as f:
        f.write(js_match.group(1).strip())

# Extract HTML (everything without style and script content)
html_content = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="/style.css">', content, flags=re.DOTALL)
html_content = re.sub(r'<script>.*?</script>', '<script type="module" src="/src/main.js"></script>', html_content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content.strip())

print("Split complete!")
