#!/usr/bin/env python3
"""
Post-processor to enhance Marp-generated slides with interactive features.
This script adds word clicking functionality while preserving the slide experience.
"""

import os
import re
import json
from typing import Dict, List

# Common English words to make interactive
INTERACTIVE_WORDS = {
    # Common expressions from daily topics
    'expression', 'phrase', 'meaning', 'example', 'discussion', 'conversation',
    'pronunciation', 'vocabulary', 'grammar', 'practice', 'learning', 'language',
    'communication', 'understanding', 'context', 'culture', 'native', 'speaker',
    'fluent', 'accent', 'dialect', 'slang', 'idiom', 'colloquial', 'formal',
    'informal', 'professional', 'casual', 'everyday', 'common', 'frequent',
    # Add more as needed
}

def inject_interactive_features(html_content: str) -> str:
    """Inject interactive features into Marp-generated HTML."""
    
    # CSS for popup and interactive features
    interactive_css = """
    <style>
    /* Interactive Word Styling */
    .interactive-word {
        cursor: pointer;
        border-bottom: 1px dotted #6366f1;
        transition: all 0.2s ease;
        padding: 0 1px;
    }
    
    .interactive-word:hover {
        background: rgba(99, 102, 241, 0.1);
        border-bottom-color: #4f46e5;
    }
    
    /* Word Popup */
    .word-popup {
        position: fixed;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        z-index: 10000;
        min-width: 280px;
        max-width: 400px;
        display: none;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
    }
    
    .word-popup.dark {
        background: rgba(30, 41, 59, 0.95);
        border-color: #334155;
        color: #f1f5f9;
    }
    
    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .popup-word {
        font-size: 1.25rem;
        font-weight: 700;
        color: #6366f1;
    }
    
    .popup-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #64748b;
        padding: 4px;
        border-radius: 4px;
    }
    
    .popup-close:hover {
        background: rgba(0, 0, 0, 0.05);
    }
    
    .popup-pronunciation {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    }
    
    .popup-phonetic {
        font-family: 'Lucida Sans Unicode', sans-serif;
        color: #64748b;
        font-size: 0.875rem;
    }
    
    .speak-button {
        background: #6366f1;
        color: white;
        border: none;
        border-radius: 6px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .speak-button:hover {
        background: #4f46e5;
    }
    
    .popup-definition {
        font-size: 0.875rem;
        line-height: 1.5;
        color: #374151;
        margin-bottom: 12px;
    }
    
    .popup-example {
        font-size: 0.875rem;
        font-style: italic;
        color: #64748b;
        padding: 8px 12px;
        background: rgba(99, 102, 241, 0.05);
        border-radius: 6px;
        border-left: 3px solid #6366f1;
    }
    
    .dark .popup-definition {
        color: #d1d5db;
    }
    
    .dark .popup-example {
        background: rgba(99, 102, 241, 0.1);
        color: #cbd5e1;
    }
    
    /* Loading state */
    .popup-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #64748b;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .word-popup {
            max-width: 90vw;
            min-width: 250px;
        }
    }
    </style>
    """
    
    # JavaScript for interactive functionality
    interactive_js = """
    <script>
    class WordLearner {
        constructor() {
            this.popup = null;
            this.init();
        }
        
        init() {
            this.createPopup();
            this.makeWordsInteractive();
            this.setupEventListeners();
        }
        
        createPopup() {
            this.popup = document.createElement('div');
            this.popup.className = 'word-popup';
            this.popup.innerHTML = `
                <div class="popup-header">
                    <span class="popup-word"></span>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="popup-content">
                    <div class="popup-loading">Loading...</div>
                </div>
            `;
            document.body.appendChild(this.popup);
        }
        
        makeWordsInteractive() {
            const interactiveWords = new Set([
                'expression', 'phrase', 'meaning', 'example', 'discussion', 'conversation',
                'pronunciation', 'vocabulary', 'grammar', 'practice', 'learning', 'language',
                'communication', 'understanding', 'context', 'culture', 'native', 'speaker',
                'fluent', 'accent', 'dialect', 'slang', 'idiom', 'colloquial', 'formal',
                'informal', 'professional', 'casual', 'everyday', 'common', 'frequent'
            ]);
            
            // Find all text nodes and wrap interactive words
            this.wrapInteractiveWords(document.body, interactiveWords);
        }
        
        wrapInteractiveWords(element, wordSet) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        // Skip script, style, and already wrapped elements
                        const parent = node.parentElement;
                        if (parent.tagName === 'SCRIPT' || 
                            parent.tagName === 'STYLE' ||
                            parent.classList.contains('interactive-word')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const words = text.split(/(\\s+|[.,!?;:()])/);
                let hasInteractiveWord = false;
                
                const newNodes = words.map(word => {
                    const cleanWord = word.toLowerCase().replace(/[.,!?;:"()]/g, '');
                    if (wordSet.has(cleanWord) && cleanWord.length > 3) {
                        hasInteractiveWord = true;
                        const span = document.createElement('span');
                        span.className = 'interactive-word';
                        span.textContent = word;
                        span.setAttribute('data-word', cleanWord);
                        return span;
                    } else {
                        return document.createTextNode(word);
                    }
                });
                
                if (hasInteractiveWord) {
                    const fragment = document.createDocumentFragment();
                    newNodes.forEach(node => fragment.appendChild(node));
                    textNode.parentNode.replaceChild(fragment, textNode);
                }
            });
        }
        
        setupEventListeners() {
            // Close popup
            this.popup.querySelector('.popup-close').addEventListener('click', () => {
                this.hidePopup();
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.popup.contains(e.target) && !e.target.classList.contains('interactive-word')) {
                    this.hidePopup();
                }
            });
            
            // Word click handler
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('interactive-word')) {
                    e.preventDefault();
                    const word = e.target.getAttribute('data-word');
                    this.showWordInfo(word, e.clientX, e.clientY);
                }
            });
            
            // ESC key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hidePopup();
                }
            });
        }
        
        async showWordInfo(word, x, y) {
            this.popup.querySelector('.popup-word').textContent = word;
            this.popup.querySelector('.popup-content').innerHTML = '<div class="popup-loading">Loading...</div>';
            
            // Position popup
            this.popup.style.display = 'block';
            this.popup.style.left = Math.min(x, window.innerWidth - this.popup.offsetWidth - 20) + 'px';
            this.popup.style.top = Math.min(y, window.innerHeight - this.popup.offsetHeight - 20) + 'px';
            
            // Check for dark mode
            const isDark = document.body.classList.contains('dark') || 
                          document.documentElement.getAttribute('data-theme') === 'dark';
            this.popup.classList.toggle('dark', isDark);
            
            try {
                const wordInfo = await this.fetchWordInfo(word);
                this.displayWordInfo(wordInfo);
            } catch (error) {
                this.displayError(word);
            }
        }
        
        async fetchWordInfo(word) {
            // Use Free Dictionary API
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error('Word not found');
            
            const data = await response.json();
            return data[0]; // Take first result
        }
        
        displayWordInfo(wordInfo) {
            const { word, phonetics, meanings } = wordInfo;
            const firstMeaning = meanings[0];
            const definition = firstMeaning.definitions[0];
            
            // Get phonetic
            const phonetic = phonetics.find(p => p.text) || {};
            const audioUrl = phonetics.find(p => p.audio)?.audio;
            
            const content = `
                <div class="popup-pronunciation">
                    <span class="popup-phonetic">${phonetic.text || ''}</span>
                    ${audioUrl ? `<button class="speak-button" onclick="this.playAudio('${audioUrl}')">🔊</button>` : ''}
                    <button class="speak-button" onclick="wordLearner.speak('${word}')">🔊</button>
                </div>
                <div class="popup-definition">
                    <strong>${firstMeaning.partOfSpeech}</strong>: ${definition.definition}
                </div>
                ${definition.example ? `<div class="popup-example">"${definition.example}"</div>` : ''}
            `;
            
            this.popup.querySelector('.popup-content').innerHTML = content;
        }
        
        displayError(word) {
            const content = `
                <div class="popup-pronunciation">
                    <button class="speak-button" onclick="wordLearner.speak('${word}')">🔊</button>
                </div>
                <div class="popup-definition">
                    Definition not found. Click the speaker to hear pronunciation.
                </div>
            `;
            this.popup.querySelector('.popup-content').innerHTML = content;
        }
        
        speak(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
            }
        }
        
        hidePopup() {
            this.popup.style.display = 'none';
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.wordLearner = new WordLearner();
        });
    } else {
        window.wordLearner = new WordLearner();
    }
    </script>
    """
    
    # Inject CSS and JS into the HTML
    css_injection_point = html_content.find('</head>')
    if css_injection_point != -1:
        html_content = (html_content[:css_injection_point] + 
                       interactive_css + 
                       html_content[css_injection_point:])
    
    js_injection_point = html_content.find('</body>')
    if js_injection_point != -1:
        html_content = (html_content[:js_injection_point] + 
                       interactive_js + 
                       html_content[js_injection_point:])
    
    return html_content

def enhance_slide_file(file_path: str) -> bool:
    """Enhance a single slide file with interactive features."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        enhanced_content = inject_interactive_features(content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(enhanced_content)
        
        print(f"✨ Enhanced {file_path}")
        return True
    except Exception as e:
        print(f"❌ Error enhancing {file_path}: {e}")
        return False

def main():
    """Enhance all slide files in docs directory."""
    docs_dir = 'docs'
    enhanced_count = 0
    
    if not os.path.exists(docs_dir):
        print("No docs directory found")
        return
    
    for item in os.listdir(docs_dir):
        item_path = os.path.join(docs_dir, item)
        if os.path.isdir(item_path) and item.isdigit():
            # This is a topic directory
            index_file = os.path.join(item_path, 'index.html')
            if os.path.exists(index_file):
                if enhance_slide_file(index_file):
                    enhanced_count += 1
    
    print(f"\n🎉 Enhanced {enhanced_count} slide files with interactive features!")
    print("Features added:")
    print("- Click on highlighted words for definitions and pronunciation")
    print("- Dictionary lookup with Free Dictionary API")
    print("- Text-to-speech pronunciation")
    print("- Responsive popup design")

if __name__ == '__main__':
    main()