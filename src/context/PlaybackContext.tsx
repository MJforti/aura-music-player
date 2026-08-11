import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track, RepeatMode, PlaybackState } from '../types/music';
import { MOCK_TRACKS } from '../services/MockMusicProvider';

interface PlaybackContextType extends PlaybackState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isNowPlayingOpen: boolean;
  setIsNowPlayingOpen: (open: boolean) => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  next: () => void;
  previous: () => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  playNextInQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(MOCK_TRACKS[0].duration || 0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [queue, setQueue] = useState<Track[]>(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [buffering, setBuffering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState<boolean>(false);

  // Play audio
  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch((err) => {
        console.warn('Playback play() interrupted or blocked by browser autoplay policy:', err);
        setIsPlaying(false);
      });
  }, []);

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Seek to specific time in seconds
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(time, duration || 1000));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Set Volume
  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  // Play a specific track and set optional queue
  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      setError(null);
      setLoading(true);
      setCurrentTrack(track);

      if (newQueue && newQueue.length > 0) {
        setQueue(newQueue);
        const idx = newQueue.findIndex((t) => t.id === track.id);
        setQueueIndex(idx !== -1 ? idx : 0);
      } else {
        const idx = queue.findIndex((t) => t.id === track.id);
        if (idx !== -1) {
          setQueueIndex(idx);
        } else {
          setQueue((prev) => [track, ...prev]);
          setQueueIndex(0);
        }
      }

      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setLoading(false);
          })
          .catch((err) => {
            console.warn('Auto-play error on track change:', err);
            setLoading(false);
          });
      }
    },
    [queue]
  );

  // Next Track
  const next = useCallback(() => {
    if (queue.length === 0) return;

    if (shuffleEnabled) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setQueueIndex(randomIndex);
      playTrack(queue[randomIndex]);
      return;
    }

    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex);
      playTrack(queue[nextIndex]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playTrack(queue[0]);
    } else {
      pause();
    }
  }, [queue, queueIndex, shuffleEnabled, repeatMode, playTrack, pause]);

  // Previous Track
  const previous = useCallback(() => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;

    const prevIndex = queueIndex - 1;
    if (prevIndex >= 0) {
      setQueueIndex(prevIndex);
      playTrack(queue[prevIndex]);
    } else if (repeatMode === 'all') {
      const lastIndex = queue.length - 1;
      setQueueIndex(lastIndex);
      playTrack(queue[lastIndex]);
    } else {
      seek(0);
    }
  }, [currentTime, queue, queueIndex, repeatMode, seek, playTrack]);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((prev) => !prev);
  }, []);

  // Toggle Repeat Mode ('off' -> 'all' -> 'one' -> 'off')
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Add to Queue end
  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  // Add to Queue next
  const playNextInQueue = useCallback(
    (track: Track) => {
      setQueue((prev) => {
        const nextQueue = [...prev];
        nextQueue.splice(queueIndex + 1, 0, track);
        return nextQueue;
      });
    },
    [queueIndex]
  );

  // Remove from Queue
  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue((prev) => prev.filter((_, i) => i !== index));
      if (index < queueIndex) {
        setQueueIndex((prev) => Math.max(0, prev - 1));
      }
    },
    [queueIndex]
  );

  // Clear Queue
  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentTrack]);

  // Handle Track Completion
  const handleEnded = useCallback(() => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      play();
    } else {
      next();
    }
  }, [repeatMode, play, next]);

  // Media Session API Sync
  useEffect(() => {
    if (!currentTrack || typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artistName,
      album: currentTrack.albumName,
      artwork: [
        { src: currentTrack.artworkUrl, sizes: '96x96', type: 'image/jpeg' },
        { src: currentTrack.artworkUrl, sizes: '128x128', type: 'image/jpeg' },
        { src: currentTrack.artworkUrl, sizes: '192x192', type: 'image/jpeg' },
        { src: currentTrack.artworkUrl, sizes: '256x256', type: 'image/jpeg' },
        { src: currentTrack.artworkUrl, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', previous);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    try {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          seek(details.seekTime);
        }
      });
    } catch {
      // seekto not supported in old browsers
    }
  }, [currentTrack, play, pause, previous, next, seek]);

  return (
    <PlaybackContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex,
        shuffleEnabled,
        repeatMode,
        buffering,
        loading,
        error,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        playTrack,
        play,
        pause,
        togglePlay,
        seek,
        next,
        previous,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        clearQueue,
      }}
    >
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl || ''}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || currentTrack?.duration || 0);
          }
        }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onEnded={handleEnded}
        onError={() => {
          setError('Playback stream unavailable. Auto-skipping to next track.');
          setBuffering(false);
          setIsPlaying(false);
        }}
      />
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
