import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  legend
}: {
  beforeImage: string,
  afterImage: string,
  beforeLabel?: string,
  afterLabel?: string,
  legend?: string
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove]);

  return (
    <div className="not-prose my-6 w-full md:w-[60vw] md:relative md:left-1/2 md:-translate-x-1/2">
      <div
        ref={containerRef}
        className="relative w-full aspect-video overflow-hidden rounded-[24px] border border-brand-gray-90/5 select-none touch-none"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* After Image (Background) */}
        <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover m-0" />

        {/* Before Image (Clipping) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={beforeImage} alt="Before" className="w-full h-full object-cover m-0" />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/20 backdrop-blur-sm -translate-x-1/2"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border border-white/50 cursor-grab active:cursor-grabbing transform transition-transform hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#403F3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 8 4 4-4 4M6 8l-4 4 4 4" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md text-white text-[10px] font-mono font-bold px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
          {beforeLabel}
        </div>
        <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md text-white text-[10px] font-mono font-bold px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
          {afterLabel}
        </div>
      </div>

      {legend && (
        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gray-90/20" />
          <p className="text-[11px] font-mono font-medium text-brand-gray-90/30 uppercase">
            {legend}
          </p>
        </div>
      )}
    </div>
  );
}

