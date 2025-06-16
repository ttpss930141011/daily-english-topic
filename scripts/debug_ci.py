#!/usr/bin/env python3
"""Debug script for CI environment"""
import requests
import os
import sys

def debug_environment():
    print("=== Environment Debug ===")
    print(f"Python version: {sys.version}")
    print(f"OS: {os.name}")
    print(f"Working directory: {os.getcwd()}")
    
    # Check environment variables
    azure_key = os.environ.get("AZURE_API_KEY")
    reddit_client_id = os.environ.get("REDDIT_CLIENT_ID")
    reddit_client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    
    print(f"AZURE_API_KEY set: {'YES' if azure_key else 'NO'}")
    if azure_key:
        print(f"AZURE_API_KEY length: {len(azure_key)}")
    
    print(f"REDDIT_CLIENT_ID set: {'YES' if reddit_client_id else 'NO'}")
    if reddit_client_id:
        print(f"REDDIT_CLIENT_ID length: {len(reddit_client_id)}")
    
    print(f"REDDIT_CLIENT_SECRET set: {'YES' if reddit_client_secret else 'NO'}")
    if reddit_client_secret:
        print(f"REDDIT_CLIENT_SECRET length: {len(reddit_client_secret)}")
    
    # Test Reddit OAuth if credentials available
    if reddit_client_id and reddit_client_secret:
        print("\n=== Reddit OAuth Test ===")
        try:
            # Import OAuth client if available
            current_dir = os.path.dirname(os.path.abspath(__file__))
            if current_dir not in sys.path:
                sys.path.append(current_dir)
            from reddit_oauth import RedditOAuth
            
            reddit = RedditOAuth()
            token = reddit.get_access_token()
            print(f"✅ OAuth Success! Token: {token[:20]}...")
            
            # Test getting hot posts
            posts = reddit.get_hot_posts()
            post_title = posts["data"]["children"][0]["data"]["title"]
            print(f"✅ Got hot post: {post_title[:50]}...")
            
        except ImportError:
            print("❌ reddit_oauth.py not found")
        except Exception as e:
            print(f"❌ OAuth failed: {e}")
    else:
        print("\n=== Reddit OAuth Test ===")
        print("❌ Reddit OAuth credentials not available")
    
    print("\n=== Network Test ===")
    
    # Test basic internet connectivity
    try:
        response = requests.get("https://httpbin.org/ip", timeout=5)
        print(f"✅ Internet connectivity: {response.status_code}")
        print(f"IP: {response.json()}")
    except Exception as e:
        print(f"❌ Internet connectivity failed: {e}")
    
    # Test Reddit with different approaches
    user_agents = [
        "python:daily-english-topic:v1.0 (by /u/dailyenglishbot)",
        "Mozilla/5.0 (compatible; daily-english-topic/1.0)",
        "curl/7.68.0",
    ]
    
    for i, ua in enumerate(user_agents):
        print(f"\n--- Test {i+1}: Reddit API with UA: {ua[:40]}... ---")
        try:
            headers = {"User-Agent": ua}
            response = requests.get(
                "https://www.reddit.com/r/AskReddit/hot.json?limit=1",
                headers=headers,
                timeout=10
            )
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                title = data['data']['children'][0]['data']['title']
                print(f"✅ SUCCESS! Title: {title[:50]}...")
                break
            else:
                print(f"❌ FAILED")
                print(f"Headers: {dict(response.headers)}")
                print(f"Response: {response.text[:200]}...")
                
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    debug_environment()