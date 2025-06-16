#!/usr/bin/env python3
"""Reddit OAuth integration for accessing Reddit API with authentication."""

import os
import requests
import base64
from typing import Dict, Any, Optional

class RedditOAuth:
    """Handle Reddit OAuth authentication and API requests."""
    
    def __init__(self):
        self.client_id = os.environ.get("REDDIT_CLIENT_ID")
        self.client_secret = os.environ.get("REDDIT_CLIENT_SECRET") 
        self.user_agent = "daily-english-topic:v1.0 (by /u/your_username)"
        self.base_url = "https://www.reddit.com"
        self.oauth_url = "https://oauth.reddit.com"
        self.access_token: Optional[str] = None
        
        if not self.client_id or not self.client_secret:
            raise ValueError("REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables are required")
    
    def get_access_token(self) -> str:
        """Get OAuth access token using client credentials flow."""
        if self.access_token:
            return self.access_token
            
        # Encode client credentials
        credentials = f"{self.client_id}:{self.client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "User-Agent": self.user_agent
        }
        
        data = {
            "grant_type": "client_credentials"
        }
        
        response = requests.post(
            f"{self.base_url}/api/v1/access_token",
            headers=headers,
            data=data,
            timeout=10
        )
        response.raise_for_status()
        
        token_data = response.json()
        self.access_token = token_data["access_token"]
        return self.access_token
    
    def make_authenticated_request(self, endpoint: str) -> Dict[Any, Any]:
        """Make an authenticated request to Reddit OAuth API."""
        token = self.get_access_token()
        
        headers = {
            "Authorization": f"Bearer {token}",
            "User-Agent": self.user_agent
        }
        
        response = requests.get(
            f"{self.oauth_url}{endpoint}",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    
    def get_hot_posts(self, subreddit: str = "AskReddit", limit: int = 1) -> Dict[Any, Any]:
        """Get hot posts from a subreddit using OAuth."""
        endpoint = f"/r/{subreddit}/hot"
        params = f"?limit={limit}"
        return self.make_authenticated_request(endpoint + params)
    
    def get_post_comments(self, subreddit: str, post_id: str) -> Dict[Any, Any]:
        """Get comments for a specific post using OAuth."""
        endpoint = f"/r/{subreddit}/comments/{post_id}"
        return self.make_authenticated_request(endpoint)

def test_oauth():
    """Test Reddit OAuth functionality."""
    try:
        reddit = RedditOAuth()
        print("🔐 Testing Reddit OAuth...")
        
        # Get access token
        token = reddit.get_access_token()
        print(f"✅ Got access token: {token[:20]}...")
        
        # Get hot posts
        posts = reddit.get_hot_posts()
        post_data = posts["data"]["children"][0]["data"]
        print(f"✅ Got post: {post_data['title'][:50]}...")
        
        # Get comments
        comments = reddit.get_post_comments("AskReddit", post_data["id"])
        print(f"✅ Got comments: {len(comments[1]['data']['children'])} top-level comments")
        
        return True
        
    except Exception as e:
        print(f"❌ OAuth test failed: {e}")
        return False

if __name__ == "__main__":
    test_oauth()