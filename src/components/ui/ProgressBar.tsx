import React, { useState, useRef } from 'react';

interface ProgressBarProps {
  currentTime: number; // in seconds
  duration: number; // in seconds
  onSeek: (time: number) => void;
  showTimeLabel?: boolean;
  className?: string;
}

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  showTimeLabel = true,
  className = '',
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    calculateSeek(e);
  };

  const calculateSeek = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * (duration || 0);
    onSeek(targetTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverTime(ratio * duration);
  };

  return (
    <div className={`w-full flex flex-col gap-1 select-none ${className}`}>
      <div
        ref={barRef}
        className="relative group py-2 cursor-pointer touch-none flex items-center"
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoverTime(null);
        }}
        onMouseMove={handleMouseMove}
        role="slider"
        aria-label="Track playback progress"
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      >
        {/* Track Background Bar */}
        <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden transition-all group-hover:h-2">
          <div
            className="h-full bg-gradient-to-r from-white/90 via-purple-300 to-white rounded-full transition-all duration-75 relative"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Floating Thumb indicator */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-black/50 border border-black/20 transition-transform ${
            isHovered ? 'scale-125' : 'scale-0 group-hover:scale-100'
          }`}
          style={{ left: `${percentage}%` }}
        />

        {/* Hover Time Tooltip */}
        {isHovered && hoverTime !== null && (
          <div
            className="absolute -top-7 transform -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 pointer-events-none font-mono"
            style={{ left: `${(hoverTime / (duration || 1)) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {showTimeLabel && (
        <div className="flex justify-between text-xs text-white/50 font-mono tracking-wider">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};
