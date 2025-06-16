import os
import datetime
import re
import json
import requests
from typing import List, Tuple
from openai import AzureOpenAI

# Endpoint and deployment details
ENDPOINT = "https://o9274-mau4vl5y-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT = "o4-mini"
API_VERSION = "2024-12-01-preview"

API_KEY = os.environ.get("AZURE_API_KEY")
if not API_KEY:
    raise SystemExit("AZURE_API_KEY env variable is required")

# Read base prompt
with open("prompt.txt", "r", encoding="utf-8") as f:
    base_prompt = f.read()


def fetch_reddit_post() -> Tuple[str, str, str, List[str]]:
    """Return title, permalink, self text, and a few comments.

    Falls back to generic information if the request fails (e.g. blocked network
    access).
    """

    headers = {"User-Agent": "daily-topic-script"}
    try:
        hot = requests.get(
            "https://www.reddit.com/r/AskReddit/hot.json?limit=1",
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
                f"https://www.reddit.com/r/AskReddit/comments/{post_id}.json",
                headers=headers,
                timeout=10,
            )
            comments_resp.raise_for_status()
            items = comments_resp.json()[1]["data"]["children"]
            for c in items:
                body = c.get("data", {}).get("body")
                if body:
                    comments.append(body)
                if len(comments) >= 3:
                    break
        return title, permalink, selftext, comments
    except Exception:
        return (
            "Interesting Reddit Discussion",
            "https://www.reddit.com/r/AskReddit/",
            "",
            [],
        )


title, permalink, selftext, comments = fetch_reddit_post()
reddit_info = f"Reddit post title: {title}\nPost text: {selftext}\nTop comments:\n"
reddit_info += "\n".join(f"- {c}" for c in comments)
prompt = base_prompt + "\n\n" + reddit_info

client = AzureOpenAI(
    api_version=API_VERSION,
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
)

response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}],
    model=DEPLOYMENT,
    max_completion_tokens=100000,
)

raw = response.choices[0].message.content

# Extract JSON object from the response
m = re.search(r"{.*}", raw, re.S)
if not m:
    raise ValueError("No JSON object found in LLM response")
data = json.loads(m.group(0))
topic = data.get("topic", "topic")
content = data.get("content", "")

# Determine file name in the form <slug>-DDMMYYYY.md
today = datetime.datetime.utcnow()
dmy = today.strftime("%d%m%Y")

def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip('-') or "topic"

slug = slugify(topic)
fname = f"{slug}-{dmy}.md"
with open(fname, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Wrote {fname}")
