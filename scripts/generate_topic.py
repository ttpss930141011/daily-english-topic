import os
import datetime
import requests

# Endpoint and deployment details
ENDPOINT = "https://o9274-mau4vl5y-eastus2.cognitiveservices.azure.com"
DEPLOYMENT = "o4-mini"
API_VERSION = "2025-01-01-preview"

API_KEY = os.environ.get("AZURE_API_KEY")
if not API_KEY:
    raise SystemExit("AZURE_API_KEY env variable is required")

# Read prompt
with open("prompt.txt", "r", encoding="utf-8") as f:
    prompt = f.read()

url = f"{ENDPOINT}/openai/deployments/{DEPLOYMENT}/chat/completions?api-version={API_VERSION}"

payload = {
    "messages": [
        {"role": "user", "content": prompt}
    ],
    "max_tokens": 2000,
    "model": DEPLOYMENT,
}
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
}
resp = requests.post(url, headers=headers, json=payload)
resp.raise_for_status()
content = resp.json()["choices"][0]["message"]["content"]

# Save to markdown file named mmddyyyy.md
fname = datetime.datetime.utcnow().strftime("%m%d%Y") + ".md"
with open(fname, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Wrote {fname}")
