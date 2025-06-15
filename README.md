# Daily English Topic

This project generates daily English learning topics using an Azure OpenAI deployment.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set your Azure OpenAI API key:
   ```bash
   export AZURE_API_KEY=your-key
   ```

## Usage

Run the generator script to create a markdown file for today:

```bash
python scripts/generate_topic.py
```

The script retrieves the hottest Reddit post from r/AskReddit (if network access allows) and asks the LLM to produce structured content. The response is returned as JSON with `topic` and `content` fields. The markdown is saved using the pattern `<slug>-DDMMYYYY.md`.

