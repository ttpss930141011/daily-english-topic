export interface Slide {
  id: number;
  content: string;
  title?: string;
}

export function parseMarkdownToSlides(content: string): Slide[] {
  // 按照 --- 分割投影片
  const rawSlides = content.split(/^---\s*$/m);
  
  const slides: Slide[] = [];
  
  rawSlides.forEach((slide, index) => {
    const trimmedSlide = slide.trim();
    if (!trimmedSlide) return;
    
    // 提取標題（第一個 # 或 ## 標題）
    const titleMatch = trimmedSlide.match(/^#+ (.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;
    
    slides.push({
      id: index + 1,
      content: trimmedSlide,
      title,
    });
  });
  
  return slides;
}

export function getSlideNavigation(slides: Slide[], currentSlide: number) {
  return {
    current: currentSlide,
    total: slides.length,
    hasPrevious: currentSlide > 1,
    hasNext: currentSlide < slides.length,
    previousSlide: Math.max(1, currentSlide - 1),
    nextSlide: Math.min(slides.length, currentSlide + 1),
  };
}