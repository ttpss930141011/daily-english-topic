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

The script retrieves the day's hottest Reddit post and a few of its top comments from r/AskReddit (when network access allows). It then asks the LLM to generate slides based on this information. The LLM response is JSON with `topic` and `content` fields. The markdown is saved using the pattern `<slug>-DDMMYYYY.md`.


