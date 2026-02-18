import React, { useState } from 'react';

interface ImageGalleryProps {
    images: { src: string; caption?: string; alt?: string }[];
    columns?: 2 | 3 | 4;
    legend?: string;
}

export default function ImageGallery({ images, columns = 3, legend }: ImageGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    };

    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % images.length : 0);
    const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + images.length) % images.length : 0);

    return (
        <div className="not-prose my-6 w-full md:w-[60vw] md:relative md:left-1/2 md:-translate-x-1/2">
            <div className={`grid ${gridCols[columns]} gap-6`}>
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="group cursor-pointer relative overflow-hidden rounded-[24px] transition-all bg-brand-gray-10 border border-brand-gray-90/5"
                        onClick={() => setLightboxIndex(idx)}
                    >
                        <img
                            src={img.src}
                            alt={img.alt || `Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover aspect-video transition-transform duration-700 group-hover:scale-105 m-0"
                        />
                        {img.caption && (
                            <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 backdrop-blur-[2px]">
                                <p className="text-white text-[11px] font-mono font-bold text-center leading-relaxed uppercase">{img.caption}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {legend && (
                <div className="mt-6 flex items-center gap-3 px-2 border-t border-brand-gray-90/5 pt-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gray-90/20" />
                    <p className="text-[11px] font-mono font-medium text-brand-gray-90/30 uppercase">
                        {legend}
                    </p>
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 bg-[#403F3C]/95 z-[300] flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl font-light leading-none"
                    >
                        ×
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 text-white/70 hover:text-white text-4xl font-light"
                    >
                        ‹
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 text-white/70 hover:text-white text-4xl font-light"
                    >
                        ›
                    </button>

                    <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[lightboxIndex].src}
                            alt={images[lightboxIndex].alt || ''}
                            className="w-full h-auto rounded-lg m-0"
                        />
                        {images[lightboxIndex].caption && (
                            <p className="text-white/70 text-center mt-4 text-[11px] font-mono font-bold uppercase">{images[lightboxIndex].caption}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
