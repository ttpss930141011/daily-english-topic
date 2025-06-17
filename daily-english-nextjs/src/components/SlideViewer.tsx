'use client';

import { useState, useEffect } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Slide, getSlideNavigation } from '@/lib/slides';
import { useRouter, usePathname } from 'next/navigation';

interface SlideViewerProps {
  slides: Slide[];
  topicTitle: string;
}

export default function SlideViewer({ slides }: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigation = getSlideNavigation(slides, currentSlide);
  const currentSlideContent = slides[currentSlide - 1];

  const switchToArticleMode = () => {
    router.push(`${pathname}?mode=article`);
  };

  // 鍵盤導航
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          if (navigation.hasNext) {
            setCurrentSlide(navigation.nextSlide);
          }
          break;
        case 'ArrowLeft':
          if (navigation.hasPrevious) {
            setCurrentSlide(navigation.previousSlide);
          }
          break;
        case 'Home':
          setCurrentSlide(1);
          break;
        case 'End':
          setCurrentSlide(slides.length);
          break;
        case 'f':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigation, slides.length, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  // 監聽全螢幕變化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!currentSlideContent) {
    return <div>No slides available</div>;
  }

  return (
    <div className={`slide-viewer ${isFullscreen ? 'fullscreen' : 'windowed'}`}>
      {/* 控制欄 */}
      <div className={`controls ${isFullscreen ? 'fullscreen-controls' : 'normal-controls'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentSlide(navigation.previousSlide)}
              disabled={!navigation.hasPrevious}
              className="btn-nav"
            >
              ← Previous
            </button>
            
            <span className="slide-counter">
              {navigation.current} / {navigation.total}
            </span>
            
            <button
              onClick={() => setCurrentSlide(navigation.nextSlide)}
              disabled={!navigation.hasNext}
              className="btn-nav"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={switchToArticleMode}
              className="btn-control"
              title="Switch to Article Mode"
            >
              📄 Article
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="btn-control"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? '⛶' : '⛶'}
            </button>
            
            {isFullscreen && (
              <button
                onClick={exitFullscreen}
                className="btn-control"
                title="Exit Fullscreen (ESC)"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 投影片內容 */}
      <div className={`slide-content ${isFullscreen ? 'fullscreen-slide' : 'normal-slide'}`}>
        <div className="slide-inner">
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={currentSlideContent.content} />
          </div>
        </div>
      </div>

      {/* 投影片縮圖導航 */}
      {!isFullscreen && (
        <div className="slide-thumbnails">
          <div className="thumbnails-container">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(slide.id)}
                className={`thumbnail ${currentSlide === slide.id ? 'active' : ''}`}
                title={slide.title || `Slide ${slide.id}`}
              >
                <div className="thumbnail-number">{slide.id}</div>
                <div className="thumbnail-title">
                  {slide.title || `Slide ${slide.id}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .slide-viewer {
          min-height: 100vh;
          background: #f8fafc;
        }
        
        .slide-viewer.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #1a1a1a;
          z-index: 9999;
        }

        .controls {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .fullscreen-controls {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-bottom: 1px solid #374151;
        }

        .btn-nav {
          px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
        }

        .btn-control {
          px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700;
        }

        .slide-counter {
          px-3 py-1 bg-gray-100 rounded text-sm font-mono;
        }

        .fullscreen-controls .slide-counter {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .slide-content {
          flex: 1;
        }

        .normal-slide {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }

        .fullscreen-slide {
          height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .slide-inner {
          width: 100%;
          max-width: 800px;
        }

        .fullscreen-slide .slide-inner {
          color: white;
        }

        .slide-thumbnails {
          border-top: 1px solid #e2e8f0;
          background: white;
          padding: 1rem;
        }

        .thumbnails-container {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          max-width: 900px;
          margin: 0 auto;
        }

        .thumbnail {
          min-width: 120px;
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .thumbnail:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .thumbnail.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .thumbnail-number {
          font-weight: bold;
          color: #3b82f6;
        }

        .thumbnail-title {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}