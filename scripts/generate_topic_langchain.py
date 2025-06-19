import os
import datetime
import re
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel, Field
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import AzureChatOpenAI
from langchain.prompts import PromptTemplate
import json

# Try to import OAuth client
try:
    from reddit_oauth import RedditOAuth
    OAUTH_AVAILABLE = True
except ImportError:
    OAUTH_AVAILABLE = False
    
import requests

# Load configuration
def load_config() -> Dict:
    """Load configuration from config.json"""
    try:
        with open("config.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "reddit": {"comment_limit": 8, "subreddit": "AskReddit", "post_limit": 1},
            "output": {"posts_directory": "posts", "docs_directory": "docs", "filename_format": "[{title}]-{date}.md"},
            "llm": {"max_tokens": 100000, "model": "o4-mini"}
        }

config = load_config()

# Azure OpenAI Configuration
ENDPOINT = "https://o9274-mau4vl5y-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT = config["llm"]["model"]
API_VERSION = "2024-12-01-preview"
API_KEY = os.environ.get("AZURE_API_KEY")

if not API_KEY:
    raise SystemExit("AZURE_API_KEY env variable is required")

# Define structured output model
class TopicContent(BaseModel):
    """Structured model for topic content"""
    title: str = Field(description="The topic title")
    category: str = Field(description="Category: Discussion, Language, Lifestyle, Ethics, Career, or General")
    tags: List[str] = Field(description="2-4 relevant tags", min_items=2, max_items=4)
    difficulty: str = Field(description="Difficulty level: Beginner, Intermediate, or Advanced")
    content: str = Field(description="Complete Marp markdown content with slide separators (---)")
    
    class Config:
        schema_extra = {
            "example": {
                "title": "What's your biggest regret?",
                "category": "Discussion",
                "tags": ["life", "reflection", "personal-growth"],
                "difficulty": "Intermediate",
                "content": "---\nmarp: true\ntheme: default\n---\n\n# Content here..."
            }
        }

# Reddit data fetching functions (reuse from original)
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
    """Fetch Reddit post using basic HTTP requests."""
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
    if OAUTH_AVAILABLE and os.environ.get("REDDIT_CLIENT_ID") and os.environ.get("REDDIT_CLIENT_SECRET"):
        try:
            print("🔐 Using Reddit OAuth...")
            return fetch_reddit_post_oauth()
        except Exception as e:
            print(f"⚠️  OAuth failed: {e}")
            print("🔄 Falling back to basic requests...")
    
    print("🌐 Using basic Reddit API...")
    return fetch_reddit_post_basic()

def slugify_title_for_filename(text: str) -> str:
    """Convert title to lowercase slug format for filename."""
    text = text.lower()
    text = re.sub(r'[<>:"/\\|?*]', '', text)
    text = re.sub(r"[''`]", '', text)
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

# Main execution
if __name__ == "__main__":
    # Ensure output directory exists
    os.makedirs(config["output"]["posts_directory"], exist_ok=True)
    
    # Fetch Reddit data
    title, permalink, selftext, comments = fetch_reddit_post()
    
    # Print Reddit data for verification
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
    
    # Initialize LangChain components
    llm = AzureChatOpenAI(
        azure_endpoint=ENDPOINT,
        azure_deployment=DEPLOYMENT,
        api_version=API_VERSION,
        api_key=API_KEY,
        temperature=1,  # o4-mini only supports default temperature
        max_completion_tokens=config["llm"]["max_tokens"]
    )
    
    # Create parser and get format instructions
    parser = PydanticOutputParser(pydantic_object=TopicContent)
    format_instructions = parser.get_format_instructions()
    
    # Load base prompt template
    try:
        with open("prompt_langchain.txt", "r", encoding="utf-8") as f:
            base_prompt_template = f.read()
    except FileNotFoundError:
        # Fallback prompt if template doesn't exist
        base_prompt_template = """Create an English learning topic based on the Reddit discussion below.

{format_instructions}

Reddit Information:
Reddit post title: {title}
Link: {permalink}
Post text: {selftext}
Top comments:
{comments}

Generate comprehensive English learning content with:
1. Key vocabulary and phrases from the discussion
2. Grammar points
3. Pronunciation tips
4. Discussion questions
5. Cultural context
6. Practice activities

Make it engaging and educational for English learners."""
    
    # Create prompt template
    prompt = PromptTemplate(
        template=base_prompt_template,
        input_variables=["title", "permalink", "selftext", "comments"],
        partial_variables={"format_instructions": format_instructions}
    )
    
    # Format comments
    comments_text = "\n".join(f"- {c}" for c in comments)
    
    # Create chain and generate content
    chain = prompt | llm | parser
    
    try:
        print("\n🤖 Generating structured content with LangChain...")
        result = chain.invoke({
            "title": title,
            "permalink": permalink,
            "selftext": selftext,
            "comments": comments_text
        })
        
        print("✅ Successfully generated structured content")
        print(f"📋 Title: {result.title}")
        print(f"📋 Category: {result.category}")
        print(f"📋 Tags: {', '.join(result.tags)}")
        print(f"📋 Difficulty: {result.difficulty}")
        
        # Build final markdown with frontmatter
        today = datetime.datetime.utcnow()
        frontmatter = f"""---
title: "{result.title}"
category: "{result.category}"
date: "{today.strftime('%Y-%m-%d')}"
subreddit: "{config['reddit']['subreddit']}"
tags: {json.dumps(result.tags)}
difficulty: "{result.difficulty}"
---

"""
        
        # Combine frontmatter with content
        final_content = frontmatter + result.content
        
        # Save to file
        mdy = today.strftime("%m%d%Y")
        slug_title = slugify_title_for_filename(title)
        filename_template = config["output"]["filename_format"]
        fname = filename_template.format(title=slug_title, date=mdy)
        
        posts_dir = config["output"]["posts_directory"]
        full_path = os.path.join(posts_dir, fname)
        
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(final_content)
        
        print(f"\n✅ Wrote {full_path}")
        
    except Exception as e:
        print(f"\n❌ Error generating content: {str(e)}")
        print("💡 Check that the LLM is returning valid JSON format")
        raise