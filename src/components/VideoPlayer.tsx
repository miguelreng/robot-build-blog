import React, { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    caption?: string;
    legend?: string;
}

export default function VideoPlayer({
    src,
    poster,
    autoplay = false,
    loop = true,
    muted = true,
    caption,
    legend
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(muted ? 0 : 1);
    const [isMuted, setIsMuted] = useState(muted);
    const [showControls, setShowControls] = useState(false);

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (videoRef.current) {
            videoRef.current.muted = newMuted;
            if (!newMuted && volume === 0) {
                setVolume(1);
                videoRef.current.volume = 1;
            }
        }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="not-prose my-6 w-full md:w-[60vw] md:relative md:left-1/2 md:-translate-x-1/2">
            <div
                ref={containerRef}
                className="relative group rounded-[24px] overflow-hidden bg-brand-gray-90 aspect-video shadow-2xl transition-all duration-500"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    src={src}
                    poster={poster}
                    autoPlay={autoplay}
                    loop={loop}
                    muted={muted}
                    playsInline
                    className="w-full h-full object-cover cursor-pointer m-0"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={() => togglePlay()}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />

                {/* Center Play Button (Visible when paused or on hover) */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${(!isPlaying || showControls) ? 'opacity-100' : 'opacity-0'}`}
                >
                    {!isPlaying && (
                        <button
                            onClick={togglePlay}
                            className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:scale-110 transition-transform pointer-events-auto shadow-2xl"
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Bottom Controls Bar */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-8 transition-all duration-500 transform ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                    {/* Progress Bar */}
                    <div className="group/progress relative w-full h-1.5 mb-6 bg-white/20 rounded-full cursor-pointer overflow-hidden">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-100"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Play/Pause */}
                            <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                                {isPlaying ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            {/* Volume */}
                            <div className="flex items-center gap-3 group/volume">
                                <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform">
                                    {isMuted || volume === 0 ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-0 group-hover/volume:w-24 transition-all duration-500 origin-left appearance-none bg-white/20 h-1 rounded-full cursor-pointer accent-white"
                                />
                            </div>

                            {/* Time */}
                            <div className="text-white/80 text-[11px] font-medium tabular-nums">
                                {formatTime(currentTime)} <span className="mx-1 text-white/30">/</span> {formatTime(duration)}
                            </div>
                        </div>

                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className="text-white hover:scale-110 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {caption && (
                <p className="text-sm text-brand-gray-90/40 mt-6 text-center font-medium">{caption}</p>
            )}

            {legend && (
                <div className="mt-8 flex items-center gap-3 px-4 border-t border-brand-gray-90/5 pt-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gray-90/20" />
                    <p className="text-[11px] font-mono font-medium text-brand-gray-90/30 uppercase">
                        {legend}
                    </p>
                </div>
            )}
        </div>
    );
}

