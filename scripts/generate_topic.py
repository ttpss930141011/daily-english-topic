import os
import datetime
from openai import AzureOpenAI

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

content = response.choices[0].message.content

# Save to markdown file named mmddyyyy.md
fname = datetime.datetime.utcnow().strftime("%m%d%Y") + ".md"
with open(fname, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Wrote {fname}")
