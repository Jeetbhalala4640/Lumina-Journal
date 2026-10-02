import React, { useEffect, useState } from 'react';

const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (animationFrameId !== null) return;

      animationFrameId = requestAnimationFrame(() => {
        const totalScroll = window.scrollY || document.documentElement.scrollTop;
        const windowHeight =
          document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (windowHeight > 0) {
          const scrollPercentage = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
          setProgress(scrollPercentage);
        } else {
          setProgress(0);
        }
        animationFrameId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
