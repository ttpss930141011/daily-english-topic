import os
import datetime
import re
from typing import Tuple

import requests
from langchain_community.chat_models import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema

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

def fetch_reddit_post() -> Tuple[str, str]:
    """Return today's hot Reddit post title and url.

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
        return title, f"https://www.reddit.com{permalink}"
    except Exception:
        return "Interesting Reddit Discussion", "https://www.reddit.com/r/AskReddit/"


response_schemas = [
    ResponseSchema(name="topic", description="Title of the topic"),
    ResponseSchema(name="content", description="Markdown content"),
]
parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = parser.get_format_instructions()

llm = AzureChatOpenAI(
    openai_api_version=API_VERSION,
    openai_api_base=ENDPOINT,
    openai_api_key=API_KEY,
    openai_deployment_name=DEPLOYMENT,
)

reddit_title, reddit_url = fetch_reddit_post()

prompt_tmpl = ChatPromptTemplate.from_messages([
    ("system", "You are an experienced English learning assistant."),
    (
        "system",
        "Respond in JSON using the following format. {format_instructions}",
    ),
    (
        "user",
        "{prompt}\n\nUse this Reddit thread as today's discussion topic:\n"
        "[{{title}}]({{url}})",
    ),
])

messages = prompt_tmpl.format_messages(
    format_instructions=format_instructions,
    prompt=prompt,
    title=reddit_title,
    url=reddit_url,
)

response = llm.invoke(messages)
parsed = parser.parse(response.content)

content = parsed["content"]
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
