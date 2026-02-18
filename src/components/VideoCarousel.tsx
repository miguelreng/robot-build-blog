import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoData {
    src: string;
    poster?: string;
    topLabel?: string;
    bottomLabel?: string;
}

interface VideoCarouselProps {
    videos: VideoData[];
    legend?: string;
}

export default function VideoCarousel({ videos, legend }: VideoCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            checkScroll();
            // Initial check after some time for layout to settle
            setTimeout(checkScroll, 100);

            // Resize observer to handle container size changes
            const resizeObserver = new ResizeObserver(() => checkScroll());
            resizeObserver.observe(container);
            return () => {
                container.removeEventListener('scroll', checkScroll);
                resizeObserver.disconnect();
            };
        }
    }, [videos]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="not-prose my-12 w-full md:w-[65vw] md:relative md:left-1/2 md:-translate-x-1/2 overflow-visible bg-brand-gray-10/30 py-10 rounded-[40px] border border-brand-gray-90/5 px-2 md:px-0">
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:px-10"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {videos.map((video, idx) => (
                    <div
                        key={idx}
                        className="flex-none w-[90%] md:w-[70%] lg:w-[60%] snap-center first:ml-0 last:mr-0"
                    >
                        <div className="relative aspect-video rounded-[24px] overflow-hidden bg-[#262626] border border-brand-gray-90/5 shadow-lg group">
                            <video
                                src={video.src}
                                poster={video.poster}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 m-0"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />

                            {/* Top Label */}
                            {video.topLabel && (
                                <div className="absolute top-5 left-5">
                                    <div className="bg-[#262626]/40 backdrop-blur-md text-white/90 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold border border-white/10 uppercase">
                                        {video.topLabel}
                                    </div>
                                </div>
                            )}

                            {/* Bottom Label */}
                            {video.bottomLabel && (
                                <div className="absolute bottom-5 left-5">
                                    <div className="bg-[#262626]/40 backdrop-blur-md text-white/90 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold border border-white/10 uppercase">
                                        {video.bottomLabel}
                                    </div>
                                </div>
                            )}

                            {/* Brand Logo Placeholder (Bottom Right) */}
                            <div className="absolute bottom-5 right-5 text-white/40 group-hover:text-white/80 transition-colors duration-500">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" opacity="0.3" />
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-10 mt-8 gap-6">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollLeft
                            ? 'bg-[#262626] text-white hover:scale-105 active:scale-95 shadow-lg'
                            : 'bg-brand-gray-90/5 text-brand-gray-90/20 cursor-not-allowed opacity-40'
                            }`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollRight
                            ? 'bg-[#262626] text-white hover:scale-105 active:scale-95 shadow-lg'
                            : 'bg-brand-gray-90/5 text-brand-gray-90/20 cursor-not-allowed opacity-40'
                            }`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {legend && (
                    <div className="flex-1 md:max-w-md">
                        <div className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gray-90/20 mt-1.5 shrink-0" />
                            <p className="text-[11px] font-mono font-medium text-brand-gray-90/40 leading-relaxed uppercase not-italic">
                                {legend}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
