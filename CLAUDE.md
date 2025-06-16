# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a daily English learning topic generator that:
- Generates markdown files with English learning content using Azure OpenAI GPT-4 mini
- Converts markdown to HTML slides using Marp
- Hosts the content as a static website via GitHub Pages

## File Naming Convention

- Current format: `posts/slug-DDMMYYYY.md` (e.g., `posts/what-is-your-biggest-regret-15062025.md`)
- Display format: Humanized titles in index.html (e.g., "What Is Your Biggest Regret")
- Legacy format: `MMDDYYYY.md` (in root directory)
- HTML output directories use: `docs/MMDDYYYY/`

## Configuration

The project uses `config.json` for configuration:
- `reddit.comment_limit`: Number of comments to fetch (default: 8)
- `reddit.subreddit`: Target subreddit (default: "AskReddit")
- `output.posts_directory`: Directory for markdown files (default: "posts")
- `output.filename_format`: Filename template (default: "{title}-{date}.md")

## Common Commands

### Generate new daily topic
```bash
python scripts/generate_topic.py
```
Requires `AZURE_API_KEY` environment variable for Azure OpenAI access.

### Build HTML from markdown
```bash
bash scripts/build_html.sh
```
Converts today's markdown file to HTML slides using Marp and updates the index.

### Update website index
```bash
python scripts/update_index.py
```
Regenerates the main index.html with all available topics.

## Dependencies

- Python 3 with `openai` package for Azure OpenAI integration
- Marp CLI for markdown-to-HTML conversion
- Bash for build scripts

## Content Structure

Each daily topic follows a structured format defined in `prompt.txt`:
1. Link to Reddit discussion
2. Topic introduction
3. Learning points (phrases, slang, grammar)
4. Pronunciation practice
5. Discussion questions
6. Template answers
7. Cultural context
8. Extension activity

All content uses Marp markdown format with `---` separators for slide generation.