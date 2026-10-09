import { useCallback, useEffect, useId, useRef, useState } from 'react';

type FarmixAboutVideoProps = {
    src: string;
    poster: string;
    label?: string;
    className?: string;
};

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function FarmixAboutVideo({
    src,
    poster,
    label = 'ویدیوی معرفی کارا ماشین وصال',
    className = '',
}: FarmixAboutVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const labelId = useId();

    const [isActive, setIsActive] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedRatio, setBufferedRatio] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const hideControlsTimer = useRef<number | null>(null);

    const clearHideTimer = useCallback(() => {
        if (hideControlsTimer.current !== null) {
            window.clearTimeout(hideControlsTimer.current);
            hideControlsTimer.current = null;
        }
    }, []);

    const scheduleHideControls = useCallback(() => {
        clearHideTimer();
        if (!isPlaying) {
            return;
        }
        hideControlsTimer.current = window.setTimeout(() => {
            setShowControls(false);
        }, 2800);
    }, [clearHideTimer, isPlaying]);

    const playVideo = useCallback(async () => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        setIsActive(true);
        try {
            await video.play();
            setIsPlaying(true);
            scheduleHideControls();
        } catch {
            setIsPlaying(false);
        }
    }, [scheduleHideControls]);

    const pauseVideo = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        video.pause();
        setIsPlaying(false);
        setShowControls(true);
        clearHideTimer();
    }, [clearHideTimer]);

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pauseVideo();
        } else {
            playVideo();
        }
    }, [isPlaying, pauseVideo, playVideo]);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    const seekTo = useCallback(
        (value: number) => {
            const video = videoRef.current;
            if (!video || !Number.isFinite(duration) || duration <= 0) {
                return;
            }
            const next = Math.min(Math.max(value, 0), duration);
            video.currentTime = next;
            setCurrentTime(next);
        },
        [duration],
    );

    const toggleFullscreen = useCallback(async () => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await root.requestFullscreen();
            }
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry?.isIntersecting) {
                    pauseVideo();
                }
            },
            { rootMargin: '80px', threshold: 0.15 },
        );

        observer.observe(root);
        return () => observer.disconnect();
    }, [pauseVideo]);

    const onContainerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isActive) {
            return;
        }
        if (event.target instanceof HTMLInputElement && event.target.type === 'range') {
            return;
        }
        switch (event.key) {
            case ' ':
            case 'k':
                event.preventDefault();
                togglePlay();
                break;
            case 'm':
                toggleMute();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'ArrowLeft':
                seekTo(currentTime - 5);
                break;
            case 'ArrowRight':
                seekTo(currentTime + 5);
                break;
            default:
                break;
        }
    };

    useEffect(() => () => clearHideTimer(), [clearHideTimer]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const rootClass = ['farmix-about-video', isActive ? 'farmix-about-video--active' : '', className]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={rootRef}
            className={rootClass}
            tabIndex={0}
            role="group"
            aria-label={label}
            onKeyDown={onContainerKeyDown}
            onMouseMove={() => {
                setShowControls(true);
                scheduleHideControls();
            }}
            onMouseLeave={() => {
                if (isPlaying) {
                    scheduleHideControls();
                }
            }}
        >
            <video
                ref={videoRef}
                className="farmix-about-video__media img1"
                poster={poster}
                preload="metadata"
                playsInline
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(event) => {
                    const el = event.currentTarget;
                    setDuration(el.duration);
                    setIsMuted(el.muted);
                }}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onProgress={(event) => {
                    const el = event.currentTarget;
                    if (el.buffered.length > 0 && el.duration > 0) {
                        const end = el.buffered.end(el.buffered.length - 1);
                        setBufferedRatio(Math.min(end / el.duration, 1));
                    }
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    setShowControls(true);
                }}
                aria-labelledby={labelId}
            >
                <source src={src} type="video/mp4" />
            </video>

            {!isActive && (
                <button
                    type="button"
                    className="farmix-about-video__poster-play"
                    onClick={playVideo}
                    aria-label="پخش ویدیو"
                >
                    <i className="fas fa-play" aria-hidden="true" />
                </button>
            )}

            <div
                id={labelId}
                className={`farmix-about-video__controls${showControls || !isPlaying ? ' is-visible' : ''}`}
                dir="ltr"
            >
                <div className="farmix-about-video__progress-wrap">
                    <div
                        className="farmix-about-video__buffer"
                        style={{ width: `${bufferedRatio * 100}%` }}
                        aria-hidden="true"
                    />
                    <input
                        type="range"
                        className="farmix-about-video__progress"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(event) => seekTo(Number(event.target.value))}
                        aria-label="پیشرفت ویدیو"
                        style={{
                            background: `linear-gradient(to right, var(--theme-color, #ffd800) 0%, var(--theme-color, #ffd800) ${progress}%, rgba(255,255,255,0.25) ${progress}%, rgba(255,255,255,0.25) 100%)`,
                        }}
                    />
                </div>

                <div className="farmix-about-video__bar">
                    <button
                        type="button"
                        className="farmix-about-video__btn"
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'توقف' : 'پخش'}
                    >
                        <i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="farmix-about-video__btn"
                        onClick={toggleMute}
                        aria-label={isMuted ? 'صدا روشن' : 'بی‌صدا'}
                    >
                        <i className={isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'} aria-hidden="true" />
                    </button>
                    <span className="farmix-about-video__time">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <button
                        type="button"
                        className="farmix-about-video__btn farmix-about-video__btn--end"
                        onClick={toggleFullscreen}
                        aria-label="تمام‌صفحه"
                    >
                        <i className="fas fa-expand" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
