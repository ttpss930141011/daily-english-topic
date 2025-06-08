import os
import re
import datetime

DOCS_DIR = 'docs'

TEMPLATE = """<!DOCTYPE html>
<html lang=\"en\">
<head>
<meta charset=\"UTF-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>Daily English Topics</title>
<style>
body {{font-family: Arial, sans-serif; background: linear-gradient(135deg,#eef2f3,#d9e2ec); margin:0;}}
header {{background:#0b3d91;color:#fff;padding:1rem;text-align:center;}}
main {{max-width:800px;margin:2rem auto;padding:0 1rem;}}
ul {{list-style:none;padding:0;}}
li {{margin:.5rem 0;}}
a {{display:block;padding:.75rem;border-radius:8px;background:#fff;color:#0b3d91;text-decoration:none;font-weight:bold;transition:.2s;}}
a:hover {{transform:translateY(-2px);box-shadow:0 4px 6px rgba(0,0,0,0.1);}}
footer {{text-align:center;margin:2rem;font-size:.9rem;color:#555;}}
</style>
</head>
<body>
<header><h1>Daily English Topics</h1></header>
<main>
  <ul>
{items}
  </ul>
</main>
<footer>Updated on {date}</footer>
</body>
</html>
"""

def main():
    entries = []
    for name in os.listdir(DOCS_DIR):
        path = os.path.join(DOCS_DIR, name)
        if os.path.isdir(path) and re.fullmatch(r'\d{8}', name):
            entries.append(name)
    entries.sort(reverse=True)
    items = "\n".join(f'    <li><a href="{e}/index.html">{e}</a></li>' for e in entries)
    now = datetime.datetime.utcnow().strftime('%Y-%m-%d')
    html = TEMPLATE.format(items=items, date=now)
    with open(os.path.join(DOCS_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    main()
