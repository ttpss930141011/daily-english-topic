import os
import datetime
import re
import json
import requests
from typing import List, Tuple, Any, Dict
from openai import AzureOpenAI

# Try to import OAuth client
try:
    from reddit_oauth import RedditOAuth
    OAUTH_AVAILABLE = True
except ImportError:
    OAUTH_AVAILABLE = False

# Load configuration
def load_config() -> Dict:
    """Load configuration from config.json"""
    try:
        with open("config.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        # Default configuration if file doesn't exist
        return {
            "reddit": {"comment_limit": 8, "subreddit": "AskReddit", "post_limit": 1},
            "output": {"posts_directory": "posts", "docs_directory": "docs", "filename_format": "[{title}]-{date}.md"},
            "llm": {"max_tokens": 100000, "model": "o4-mini"}
        }

config = load_config()

# Endpoint and deployment details
ENDPOINT = "https://o9274-mau4vl5y-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT = config["llm"]["model"]
API_VERSION = "2024-12-01-preview"

API_KEY = os.environ.get("AZURE_API_KEY")
if not API_KEY:
    raise SystemExit("AZURE_API_KEY env variable is required")

# Read base prompt
with open("prompt.txt", "r", encoding="utf-8") as f:
    base_prompt = f.read()

# Ensure output directory exists
os.makedirs(config["output"]["posts_directory"], exist_ok=True)


def _collect_comment_text(item: Any, out: List[str], limit: int) -> None:
    """Recursively collect comment bodies from a Reddit comment tree."""
    if len(out) >= limit:
        return
    if not isinstance(item, dict):
        return
    if item.get("kind") == "t1":
        body = item.get("data", {}).get("body")
        if body:
            out.append(body)
            if len(out) >= limit:
                return
        replies = item.get("data", {}).get("replies")
        if isinstance(replies, dict):
            for child in replies.get("data", {}).get("children", []):
                _collect_comment_text(child, out, limit)
                if len(out) >= limit:
                    break


def fetch_reddit_post_oauth() -> Tuple[str, str, str, List[str]]:
    """Fetch Reddit post using OAuth authentication."""
    reddit = RedditOAuth()
    subreddit = config["reddit"]["subreddit"]
    comment_limit = config["reddit"]["comment_limit"]
    
    # Get hot posts
    posts = reddit.get_hot_posts(subreddit, limit=config["reddit"]["post_limit"])
    post = posts["data"]["children"][0]["data"]
    
    title = post.get("title", "Interesting Reddit Discussion")
    permalink = "https://www.reddit.com" + post.get("permalink", "/")
    selftext = post.get("selftext", "")
    post_id = post.get("id")
    
    comments: List[str] = []
    if post_id:
        comments_data = reddit.get_post_comments(subreddit, post_id)
        items = comments_data[1]["data"]["children"]
        for item in items:
            _collect_comment_text(item, comments, limit=comment_limit)
            if len(comments) >= comment_limit:
                break
    
    return title, permalink, selftext, comments

def fetch_reddit_post_basic() -> Tuple[str, str, str, List[str]]:
    """Fetch Reddit post using basic HTTP requests (no OAuth).
    
    Raises exception if Reddit API fails.
    """
    subreddit = config["reddit"]["subreddit"]
    comment_limit = config["reddit"]["comment_limit"]
    
    headers = {"User-Agent": "daily-topic-script"}
    hot = requests.get(
        f"https://www.reddit.com/r/{subreddit}/hot.json?limit={config['reddit']['post_limit']}",
        headers=headers,
        timeout=10,
    )
    hot.raise_for_status()
    post = hot.json()["data"]["children"][0]["data"]
    title = post.get("title", "Interesting Reddit Discussion")
    permalink = "https://www.reddit.com" + post.get("permalink", "/")
    selftext = post.get("selftext", "")
    post_id = post.get("id")
    comments: List[str] = []
    if post_id:
        comments_resp = requests.get(
            f"https://www.reddit.com/r/{subreddit}/comments/{post_id}.json",
            headers=headers,
            timeout=10,
        )
        comments_resp.raise_for_status()
        items = comments_resp.json()[1]["data"]["children"]
        for item in items:
            _collect_comment_text(item, comments, limit=comment_limit)
            if len(comments) >= comment_limit:
                break
    return title, permalink, selftext, comments

def fetch_reddit_post() -> Tuple[str, str, str, List[str]]:
    """Fetch Reddit post with automatic OAuth fallback."""
    # Try OAuth first if credentials are available
    if OAUTH_AVAILABLE and os.environ.get("REDDIT_CLIENT_ID") and os.environ.get("REDDIT_CLIENT_SECRET"):
        try:
            print("🔐 Using Reddit OAuth...")
            return fetch_reddit_post_oauth()
        except Exception as e:
            print(f"⚠️  OAuth failed: {e}")
            print("🔄 Falling back to basic requests...")
    
    # Fall back to basic requests
    print("🌐 Using basic Reddit API...")
    return fetch_reddit_post_basic()


title, permalink, selftext, comments = fetch_reddit_post()

# Print detailed Reddit data for verification
print("\n" + "="*60)
print("📊 REDDIT DATA VERIFICATION")
print("="*60)
print(f"📝 POST TITLE: {title}")
print(f"🔗 PERMALINK: {permalink}")
print(f"📄 POST TEXT: {selftext if selftext.strip() else '(No self text)'}")
print(f"💬 COMMENTS COUNT: {len(comments)}")
print("\n📋 COMMENT DETAILS:")
for i, comment in enumerate(comments, 1):
    print(f"  {i}. {comment[:100]}{'...' if len(comment) > 100 else ''}")
print("="*60)

reddit_info = (
    f"Reddit post title: {title}\n"
    f"Link: {permalink}\n"
    f"Post text: {selftext}\n"
    "Top comments:\n"
    + "\n".join(f"- {c}" for c in comments)
)
prompt = base_prompt + "\n\n" + reddit_info

client = AzureOpenAI(
    api_version=API_VERSION,
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
)

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}],
    model=DEPLOYMENT,
    max_completion_tokens=config["llm"]["max_tokens"],
)

raw = response.choices[0].message.content

# Extract JSON object from the response
m = re.search(r"{.*}", raw, re.S)
if not m:
    raise ValueError("No JSON object found in LLM response")
data = json.loads(m.group(0))
topic = data.get("topic", "topic")
content = data.get("content", "")

# Determine file name using new format [title]-DDMMYYYY.md
today = datetime.datetime.utcnow()
dmy = today.strftime("%d%m%Y")

def slugify_title_for_filename(text: str) -> str:
    """Convert title to lowercase slug format for filename."""
    # Convert to lowercase
    text = text.lower()
    # Remove/replace problematic characters for filenames
    text = re.sub(r'[<>:"/\\|?*]', '', text)  # Remove invalid filename chars
    text = re.sub(r"[''`]", '', text)  # Remove quotes
    text = re.sub(r'[^\w\s-]', '', text)  # Keep only alphanumeric, spaces, hyphens
    text = re.sub(r'\s+', '-', text)  # Replace spaces with hyphens
    text = re.sub(r'-+', '-', text)  # Replace multiple hyphens with single
    return text.strip('-')  # Remove leading/trailing hyphens

# Use Reddit title for filename in slug-DDMMYYYY.md format
slug_title = slugify_title_for_filename(title)
filename_template = config["output"]["filename_format"]
fname = filename_template.format(title=slug_title, date=dmy)

# Create full path in posts directory
posts_dir = config["output"]["posts_directory"]
full_path = os.path.join(posts_dir, fname)

with open(full_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"✅ Wrote {full_path}")
