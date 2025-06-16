import os
import datetime
import re
from typing import List, Tuple

import requests
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate

# Endpoint and deployment details
ENDPOINT = "https://o9274-mau4vl5y-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT = "o4-mini"
API_VERSION = "2024-12-01-preview"

API_KEY = os.environ.get("AZURE_API_KEY")
if not API_KEY:
    raise SystemExit("AZURE_API_KEY env variable is required")

# Read prompt
with open("prompt.txt", "r", encoding="utf-8") as f:
    prompt = f.read()

def fetch_reddit_post() -> Tuple[str, str, List[str]]:
    """Return today's hot Reddit post title, URL, and a few comments.

    Falls back to a generic topic if the request fails (e.g. due to network
    restrictions)."""

    headers = {"User-Agent": "daily-topic-script"}
    url = "https://www.reddit.com/r/AskReddit/hot.json?limit=1"
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()["data"]["children"][0]["data"]
        title = data.get("title", "Interesting Reddit Discussion")
        permalink = data.get("permalink", "/")
        post_id = data.get("id")

        comments: List[str] = []
        if post_id:
            comments_url = f"https://www.reddit.com/r/AskReddit/comments/{post_id}.json"
            try:
                c_resp = requests.get(comments_url, headers=headers, timeout=10)
                c_resp.raise_for_status()
                c_data = c_resp.json()
                for child in c_data[1]["data"]["children"]:
                    body = child.get("data", {}).get("body")
                    if body:
                        comments.append(body)
                    if len(comments) >= 3:
                        break
            except Exception:
                comments = []

        return title, f"https://www.reddit.com{permalink}", comments
    except Exception:
        return "Interesting Reddit Discussion", "https://www.reddit.com/r/AskReddit/", []


import json

format_instructions = 'Return a JSON object with `topic` and `content` fields.'

llm = AzureChatOpenAI(
    api_key=API_KEY,
    api_version=API_VERSION,
    azure_endpoint=ENDPOINT,
    azure_deployment=DEPLOYMENT,
)

reddit_title, reddit_url, reddit_comments = fetch_reddit_post()


prompt_tmpl = ChatPromptTemplate.from_messages([
    ("system", "You are an experienced English learning assistant."),
    ("system", "{format_instructions}"),
    (
        "user",
        "{prompt}\n\nUse this Reddit thread as today's discussion topic:\n"
        "[{{title}}]({{url}})\n\nHere are some comments from the thread:\n{{comments}}",
    ),
])

messages = prompt_tmpl.format_messages(
    format_instructions=format_instructions,
    prompt=prompt,
    title=reddit_title,
    url=reddit_url,
    comments="\n".join(reddit_comments),
)

response = llm.invoke(messages)
parsed = json.loads(response.content)

content = parsed.get("content", "")
title_match = parsed.get("topic")

# Determine file name in the form <slug>-DDMMYYYY.md
today = datetime.datetime.utcnow()
dmy = today.strftime("%d%m%Y")

def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip('-') or "topic"

slug = slugify(title_match) if title_match else "topic"
fname = f"{slug}-{dmy}.md"
with open(fname, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Wrote {fname}")
