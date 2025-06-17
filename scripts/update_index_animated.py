#!/usr/bin/env python3
"""Generate animated index.html with topic metadata support."""

import os
import re
import yaml
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Category icon mapping
CATEGORY_ICONS = {
    "Discussion": "fas fa-comments",
    "Language": "fas fa-language", 
    "Lifestyle": "fas fa-heart",
    "Ethics": "fas fa-balance-scale",
    "Career": "fas fa-briefcase",
    "General": "fas fa-lightbulb"
}

# Default category for legacy content
DEFAULT_CATEGORY = "General"

def extract_frontmatter(file_path: str) -> Optional[Dict]:
    """Extract YAML frontmatter from markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for YAML frontmatter
        if content.startswith('---\n'):
            # Find the closing ---
            end_index = content.find('\n---\n', 4)
            if end_index != -1:
                yaml_content = content[4:end_index]
                return yaml.safe_load(yaml_content)
    except Exception as e:
        print(f"Error reading frontmatter from {file_path}: {e}")
    
    return None

def extract_title_from_content(file_path: str) -> Optional[str]:
    """Extract title from markdown content (fallback)."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Look for [title](link) pattern
            match = re.search(r'\[([^\]]+)\]\(https://www\.reddit\.com[^)]+\)', content)
            if match:
                return match.group(1)
    except:
        pass
    return None

def humanize_slug(slug: str) -> str:
    """Convert slug to human-readable title."""
    words = slug.replace('-', ' ').split()
    # Common words that should stay lowercase
    lowercase_words = {'a', 'an', 'and', 'at', 'but', 'by', 'for', 'in', 
                      'of', 'on', 'or', 'the', 'to', 'with'}
    
    humanized = []
    for i, word in enumerate(words):
        if i == 0 or word.lower() not in lowercase_words:
            humanized.append(word.capitalize())
        else:
            humanized.append(word.lower())
    
    return ' '.join(humanized)

def parse_date_from_filename(filename: str) -> Tuple[str, str]:
    """Extract date from filename in MMDDYYYY format (project standard)."""
    # Extract 8-digit date pattern
    match = re.search(r'(\d{8})\.md$', filename)
    if not match:
        return "", ""
    
    date_str = match.group(1)
    
    # Parse MMDDYYYY format (correct project standard)
    month = date_str[0:2]
    day = date_str[2:4]
    year = date_str[4:8]
    
    # Validate day and month ranges
    day_int = int(day)
    month_int = int(month)
    
    if day_int > 31 or month_int > 12 or day_int < 1 or month_int < 1:
        print(f"Warning: Invalid date in {filename}: month={month}, day={day}")
        return "", ""
    
    # Return YYYY-MM-DD for sorting and MMDDYYYY for folder (same as input)
    return f"{year}-{month}-{day}", date_str

def get_topic_info(file_path: str, filename: str) -> Dict:
    """Extract all topic information from a markdown file."""
    # Try to get metadata from frontmatter
    metadata = extract_frontmatter(file_path)
    
    # Parse date from filename
    date_str, folder_date = parse_date_from_filename(filename)
    
    # Get title
    title = None
    if metadata and 'title' in metadata:
        title = metadata['title']
    else:
        # Try to extract from filename slug
        if '-' in filename and filename.endswith('.md'):
            slug_match = re.match(r'^(.+)-\d{8}\.md$', filename)
            if slug_match:
                title = humanize_slug(slug_match.group(1))
        
        # Fallback to content extraction
        if not title:
            title = extract_title_from_content(file_path)
        
        # Last resort
        if not title:
            title = "Daily Topic Discussion"
    
    # Get category
    category = DEFAULT_CATEGORY
    if metadata and 'category' in metadata:
        category = metadata['category']
    elif 'aita' in filename.lower():
        category = "Ethics"
    elif any(word in title.lower() for word in ['language', 'english', 'phrase', 'word']):
        category = "Language"
    elif any(word in title.lower() for word in ['career', 'job', 'work']):
        category = "Career"
    elif any(word in title.lower() for word in ['life', 'routine', 'change', 'thing']):
        category = "Lifestyle"
    else:
        category = "Discussion"
    
    # Get tags
    tags = []
    if metadata and 'tags' in metadata:
        tags = metadata['tags']
    
    return {
        'title': title,
        'category': category,
        'date_str': date_str,
        'folder_date': folder_date,
        'tags': tags,
        'difficulty': metadata.get('difficulty', 'Intermediate') if metadata else 'Intermediate'
    }

def collect_topics() -> List[Dict]:
    """Collect all topics from posts directory and check for HTML folders without markdown."""
    topics = []
    posts_dir = 'posts'
    docs_dir = 'docs'
    
    # Collect from posts directory
    if os.path.exists(posts_dir):
        for filename in os.listdir(posts_dir):
            if filename.endswith('.md'):
                file_path = os.path.join(posts_dir, filename)
                topic_info = get_topic_info(file_path, filename)
                
                if topic_info['folder_date']:
                    topics.append({
                        'filename': filename,
                        'file_path': file_path,
                        **topic_info
                    })
    
    # Check for HTML folders without corresponding markdown (like 06172025)
    if os.path.exists(docs_dir):
        for folder in os.listdir(docs_dir):
            if folder.isdigit() and len(folder) == 8:
                # Check if we already have this topic
                has_topic = any(t['folder_date'] == folder for t in topics)
                
                if not has_topic and os.path.exists(os.path.join(docs_dir, folder, 'index.html')):
                    # Parse date from folder name
                    month = folder[0:2]
                    day = folder[2:4]
                    year = folder[4:8]
                    
                    # Try to get title from legacy mapping
                    legacy_mapping = {
                        "06172025": ("If You Woke Up To News Of World War 3, What Would Be Your First Thoughts?", "Discussion"),
                        "06152025": ("AITA For Accidentally Liking My Crush's 42-Week-Old Post?", "Ethics"),
                        "06142025": ("What's An English Phrase That Confused You When You First Heard It?", "Language")
                    }
                    
                    title, category = legacy_mapping.get(folder, ("Daily Topic Discussion", "General"))
                    
                    topics.append({
                        'filename': f'{folder}.md',
                        'file_path': '',
                        'title': title,
                        'category': category,
                        'date_str': f"{year}-{month}-{day}",
                        'folder_date': folder,
                        'tags': [],
                        'difficulty': 'Intermediate'
                    })
    
    # Sort by date (newest first)
    topics.sort(key=lambda x: x['date_str'], reverse=True)
    return topics

def generate_animated_index(topics: List[Dict]) -> str:
    """Generate the animated index.html content."""
    
    # Generate topic cards
    topic_cards = []
    for topic in topics:
        date_obj = datetime.strptime(topic['date_str'], '%Y-%m-%d')
        formatted_date = date_obj.strftime('%b %d, %Y')
        
        icon = CATEGORY_ICONS.get(topic['category'], CATEGORY_ICONS['General'])
        
        card_html = f"""            <a href="{topic['folder_date']}/index.html" class="topic-card" data-date="{topic['date_str']}">
                <div class="topic-date">
                    <i class="fas fa-calendar-alt"></i>
                    {formatted_date}
                </div>
                <h3 class="topic-title">{topic['title']}</h3>
                <div class="topic-meta">
                    <span class="topic-category">
                        <i class="{icon}"></i>
                        {topic['category']}
                    </span>
                    <div class="topic-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </a>"""
        topic_cards.append(card_html)
    
    # Generate the full HTML
    today = datetime.now().strftime('%Y-%m-%d')
    total_topics = len(topics)
    
    html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily English Topics</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #8b5cf6;
            --accent: #06b6d4;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --dark: #0f172a;
            --dark-light: #1e293b;
            --dark-lighter: #334155;
            --gray: #64748b;
            --gray-light: #94a3b8;
            --gray-lighter: #cbd5e1;
            --white: #ffffff;
            --gradient-primary: linear-gradient(135deg, var(--primary), var(--secondary));
            --gradient-accent: linear-gradient(135deg, var(--accent), var(--success));
            --gradient-dark: linear-gradient(135deg, var(--dark), var(--dark-light));
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: var(--dark);
            color: var(--white);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Animated Background */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: var(--gradient-dark);
        }

        .bg-animation::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            background: 
                radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 25% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
            animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-20px, -20px) rotate(1deg); }
            66% { transform: translate(20px, -10px) rotate(-1deg); }
        }

        /* Header */
        .header {
            position: relative;
            padding: 4rem 2rem 6rem;
            text-align: center;
            background: var(--gradient-primary);
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(255,255,255,0.1)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)" opacity="0.5"><animate attributeName="cx" values="200;800;200" dur="10s" repeatCount="indefinite"/></circle><circle cx="800" cy="400" r="150" fill="url(%23a)" opacity="0.3"><animate attributeName="cy" values="400;600;400" dur="8s" repeatCount="indefinite"/></circle><circle cx="400" cy="700" r="80" fill="url(%23a)" opacity="0.4"><animate attributeName="cx" values="400;600;400" dur="12s" repeatCount="indefinite"/></circle></svg>') center/cover;
            opacity: 0.1;
        }

        .header-content {
            position: relative;
            z-index: 2;
            max-width: 1200px;
            margin: 0 auto;
        }

        .logo {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--white), var(--gray-lighter));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); }
            to { filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5)); }
        }

        .subtitle {
            font-size: 1.25rem;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: var(--shadow-xl);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--white);
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Main Content */
        .main-content {
            max-width: 1200px;
            margin: -3rem auto 0;
            padding: 0 2rem 4rem;
            position: relative;
            z-index: 2;
        }

        .search-section {
            margin-bottom: 3rem;
        }

        .search-container {
            position: relative;
            max-width: 600px;
            margin: 0 auto;
        }

        .search-input {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            color: var(--white);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            background: rgba(255, 255, 255, 0.15);
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.5);
        }

        .filter-tabs {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        }

        .filter-tab {
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .filter-tab.active,
        .filter-tab:hover {
            background: var(--gradient-primary);
            border-color: var(--primary);
            color: var(--white);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        /* Topics Grid */
        .topics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .topic-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            color: inherit;
            position: relative;
            overflow: hidden;
            animation: slideInUp 0.6s ease-out;
            animation-fill-mode: both;
        }

        .topic-card:nth-child(1) { animation-delay: 0.1s; }
        .topic-card:nth-child(2) { animation-delay: 0.2s; }
        .topic-card:nth-child(3) { animation-delay: 0.3s; }
        .topic-card:nth-child(4) { animation-delay: 0.4s; }
        .topic-card:nth-child(5) { animation-delay: 0.5s; }
        .topic-card:nth-child(6) { animation-delay: 0.6s; }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .topic-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-accent);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .topic-card:hover {
            transform: translateY(-8px) scale(1.02);
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: var(--shadow-xl);
        }

        .topic-card:hover::before {
            transform: scaleX(1);
        }

        .topic-date {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--accent);
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .topic-title {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.4;
            margin-bottom: 1rem;
            color: var(--white);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .topic-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .topic-category {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(99, 102, 241, 0.2);
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--primary);
        }

        .topic-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: var(--gradient-primary);
            border-radius: 50%;
            color: var(--white);
            transition: all 0.3s ease;
        }

        .topic-card:hover .topic-arrow {
            transform: rotate(45deg);
            box-shadow: var(--shadow-md);
        }

        /* Footer */
        .footer {
            background: var(--dark-light);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3rem 2rem 2rem;
            text-align: center;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-text {
            color: var(--gray-light);
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-link {
            color: var(--gray-light);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .footer-link:hover {
            color: var(--white);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .header {
                padding: 3rem 1rem 4rem;
            }

            .logo {
                font-size: 2.5rem;
            }

            .subtitle {
                font-size: 1rem;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }

            .stat-card {
                padding: 1.5rem;
            }

            .main-content {
                padding: 0 1rem 3rem;
            }

            .topics-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .filter-tabs {
                justify-content: flex-start;
                overflow-x: auto;
                padding-bottom: 1rem;
            }

            .footer-links {
                flex-direction: column;
                gap: 1rem;
            }
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--dark-light);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
    </style>
</head>
<body>
    <div class="bg-animation"></div>
    
    <header class="header">
        <div class="header-content">
            <h1 class="logo">
                <i class="fas fa-comments"></i>
                Daily English Topics
            </h1>
            <p class="subtitle">
                Discover engaging English discussions from Reddit's most popular posts. 
                Learn vocabulary, idioms, and cultural context through real conversations.
            </p>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="totalTopics">''' + str(total_topics) + '''</div>
                    <div class="stat-label">Total Topics</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">Daily</div>
                    <div class="stat-label">New Content</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">Free Access</div>
                </div>
            </div>
        </div>
    </header>

    <main class="main-content">
        <section class="search-section">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" placeholder="Search topics..." id="searchInput">
            </div>
            
            <div class="filter-tabs">
                <a href="#" class="filter-tab active" data-filter="all">All Topics</a>
                <a href="#" class="filter-tab" data-filter="recent">Recent</a>
                <a href="#" class="filter-tab" data-filter="popular">Popular</a>
                <a href="#" class="filter-tab" data-filter="discussion">Discussion</a>
            </div>
        </section>

        <section class="topics-grid" id="topicsGrid">
''' + '\n\n'.join(topic_cards) + '''
        </section>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="https://github.com/ttpss930141011/daily-english-topic" class="footer-link">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="#" class="footer-link">About</a>
                <a href="#" class="footer-link">Privacy</a>
                <a href="#" class="footer-link">Terms</a>
            </div>
            <p class="footer-text">
                Updated on <span id="lastUpdated">''' + today + '''</span> • 
                Powered by Reddit API & Azure OpenAI
            </p>
        </div>
    </footer>

    <script>
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const topicsGrid = document.getElementById('topicsGrid');
        const filterTabs = document.querySelectorAll('.filter-tab');

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const topicCards = topicsGrid.querySelectorAll('.topic-card');
            
            topicCards.forEach(card => {
                const title = card.querySelector('.topic-title').textContent.toLowerCase();
                const date = card.querySelector('.topic-date').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || date.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.3s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Filter functionality
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                const topicCards = topicsGrid.querySelectorAll('.topic-card');
                
                topicCards.forEach((card, index) => {
                    let shouldShow = true;
                    
                    if (filter === 'recent') {
                        shouldShow = index < 5;
                    } else if (filter === 'popular') {
                        const category = card.querySelector('.topic-category').textContent.toLowerCase();
                        shouldShow = category.includes('discussion') || category.includes('lifestyle');
                    } else if (filter === 'discussion') {
                        const category = card.querySelector('.topic-category').textContent.toLowerCase();
                        shouldShow = category.includes('discussion') || category.includes('ethics');
                    }
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Smooth animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all topic cards
        document.querySelectorAll('.topic-card').forEach(card => {
            observer.observe(card);
        });

        // Update last updated date
        document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
        
        // Add typing effect to search placeholder
        const searchPlaceholders = [
            'Search topics...',
            'Find discussions...',
            'Explore conversations...',
            'Discover insights...'
        ];
        
        let placeholderIndex = 0;
        setInterval(() => {
            searchInput.placeholder = searchPlaceholders[placeholderIndex];
            placeholderIndex = (placeholderIndex + 1) % searchPlaceholders.length;
        }, 3000);
    </script>
</body>
</html>'''

    return html_template

def main():
    """Main function to generate animated index."""
    print("Collecting topics...")
    topics = collect_topics()
    
    print(f"Found {len(topics)} topics")
    
    # Generate HTML
    html_content = generate_animated_index(topics)
    
    # Write to docs/index.html
    output_path = 'docs/index.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✨ Animated index generated at {output_path}")
    
    # Print category statistics
    categories = {}
    for topic in topics:
        cat = topic['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nCategory distribution:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count} topics")

if __name__ == "__main__":
    main()