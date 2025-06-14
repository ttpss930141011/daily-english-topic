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

def find_md_file(date_str: str) -> str | None:
    """Return the markdown file for the given date.

    The docs directories are named in MMDDYYYY format. Newer markdown files
    are stored using the pattern ``<slug>-DDMMYYYY.md``. Older files may still
    use ``MMDDYYYY.md``. This helper searches for both patterns and returns the
    matching filename if found.
    """

    # Check for new naming scheme first
    try:
        date_obj = datetime.datetime.strptime(date_str, "%m%d%Y")
    except ValueError:
        return None
    dmy = date_obj.strftime("%d%m%Y")
    pattern = re.compile(rf".+-{dmy}\.md$")
    for fname in os.listdir('.'):
        if pattern.fullmatch(fname):
            return fname

    # Fallback to old scheme
    legacy = f"{date_str}.md"
    if os.path.exists(legacy):
        return legacy
    return None


def extract_title_from_file(path: str) -> str | None:
    """Extract the first ``[title](link)`` text from the file if present."""
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            m = re.search(r"\[([^\]]+)\]\(", line)
            if m:
                return m.group(1)
    return None


def humanize_slug(slug: str) -> str:
    """Convert a filename slug into a human readable title."""
    title = slug.replace("-", " ").replace("_", " ")
    return title.strip().title()


def get_title(date_str: str) -> str:
    """Determine the title for the given date."""
    md_file = find_md_file(date_str)
    if not md_file:
        return ""

    title = extract_title_from_file(md_file)
    if title:
        return title

    # If no title in file, derive from filename slug when using new scheme
    m = re.match(r"(.+)-\d{8}\.md$", md_file)
    if m:
        return humanize_slug(m.group(1))

    return ""


def main():
    entries = []
    for name in os.listdir(DOCS_DIR):
        path = os.path.join(DOCS_DIR, name)
        if os.path.isdir(path) and re.fullmatch(r"\d{8}", name):
            entries.append(name)
    entries.sort(reverse=True)
    display_items = []
    for e in entries:
        date_obj = datetime.datetime.strptime(e, "%m%d%Y")
        pretty_date = date_obj.strftime("%b %d, %Y")
        title = get_title(e)
        text = f"{pretty_date} - {title}" if title else pretty_date
        display_items.append(f'    <li><a href="{e}/index.html">{text}</a></li>')
    items = "\n".join(display_items)
    now = datetime.datetime.utcnow().strftime('%Y-%m-%d')
    html = TEMPLATE.format(items=items, date=now)
    with open(os.path.join(DOCS_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    main()
