import React, { useState, useRef } from 'react';

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Before", 
  afterLabel = "After" 
}: { 
  beforeImage: string, 
  afterImage: string, 
  beforeLabel?: string, 
  afterLabel?: string 
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden rounded-lg cursor-col-resize select-none border border-zinc-800"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Background) */}
      <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Before Image (Clipping) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl border border-zinc-200">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 8 4 4-4 4M6 8l-4 4 4 4"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
        {afterLabel}
      </div>
    </div>
  );
}
