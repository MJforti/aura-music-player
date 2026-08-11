import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Mashup, MashupMix } from '../types/mashup';

interface PlaybackContextType {
  currentMashup: Mashup | null;
  currentMix: MashupMix | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  volume: number;
  error: string | null;
  isMixPlayerOpen: boolean;
  setIsMixPlayerOpen: (open: boolean) => void;
  selectedMashupForDetail: Mashup | null;
  openMashupDetail: (mashup: Mashup) => void;
  closeMashupDetail: () => void;

  playMashup: (mashup: Mashup) => void;
  playMix: (mix: MashupMix, initialIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (timeInSeconds: number) => void;
  setVolume: (vol: number) => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMashup, setCurrentMashup] = useState<Mashup | null>(null);
  const [currentMix, setCurrentMix] = useState<MashupMix | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [error, setError] = useState<string | null>(null);
  const [isMixPlayerOpen, setIsMixPlayerOpen] = useState<boolean>(false);
  const [selectedMashupForDetail, setSelectedMashupForDetail] = useState<Mashup | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeMixRef = useRef<MashupMix | null>(null);
  const activeIndexRef = useRef<number>(0);

  activeMixRef.current = currentMix;
  activeIndexRef.current = currentIndex;

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!audio) return;
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 180);
    };

    const handleEnded = () => {
      // Auto-advance to next mashup in mix seamlessly!
      if (activeMixRef.current) {
        const nextIdx = activeIndexRef.current + 1;
        if (nextIdx < activeMixRef.current.mashups.length) {
          playTrackInMix(activeMixRef.current, nextIdx);
        } else {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => {
      setError("Audio stream isn't available right now.");
      setIsBuffering(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const playMashupDirect = (mashup: Mashup) => {
    setError(null);
    setIsBuffering(true);
    setCurrentMashup(mashup);
    setCurrentMix(null);
    setCurrentIndex(0);

    const streamUrl = mashup.previewUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    if (audioRef.current) {
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          updateMediaSession(mashup);
        })
        .catch(err => {
          console.warn('Playback error:', err);
          setIsBuffering(false);
          setIsPlaying(false);
        });
    }
  };

  const playTrackInMix = (mix: MashupMix, index: number) => {
    if (!mix.mashups[index]) return;

    const mashup = mix.mashups[index];
    setError(null);
    setIsBuffering(true);
    setCurrentMix(mix);
    setCurrentMashup(mashup);
    setCurrentIndex(index);

    const streamUrl = mashup.previewUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    if (audioRef.current) {
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          updateMediaSession(mashup);
        })
        .catch(err => {
          console.warn('Playback error:', err);
          setIsBuffering(false);
          setIsPlaying(false);
        });
    }
  };

  const updateMediaSession = (mashup: Mashup) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: mashup.title,
        artist: mashup.creator.name,
        album: mashup.categoryName,
        artwork: [{ src: mashup.artwork, sizes: '512x512', type: 'image/jpeg' }],
      });

      navigator.mediaSession.setActionHandler('play', resume);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('nexttrack', next);
      navigator.mediaSession.setActionHandler('previoustrack', previous);
    }
  };

  const playMashup = useCallback((mashup: Mashup) => {
    playMashupDirect(mashup);
  }, []);

  const playMix = useCallback((mix: MashupMix, initialIndex: number = 0) => {
    playTrackInMix(mix, initialIndex);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && currentMashup) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [currentMashup]);

  const next = useCallback(() => {
    if (currentMix && currentIndex < currentMix.mashups.length - 1) {
      playTrackInMix(currentMix, currentIndex + 1);
    }
  }, [currentMix, currentIndex]);

  const previous = useCallback(() => {
    if (currentMix && currentIndex > 0) {
      playTrackInMix(currentMix, currentIndex - 1);
    }
  }, [currentMix, currentIndex]);

  const seek = useCallback((timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const openMashupDetail = useCallback((mashup: Mashup) => {
    setSelectedMashupForDetail(mashup);
  }, []);

  const closeMashupDetail = useCallback(() => {
    setSelectedMashupForDetail(null);
  }, []);

  return (
    <PlaybackContext.Provider
      value={{
        currentMashup,
        currentMix,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        isBuffering,
        volume,
        error,
        isMixPlayerOpen,
        setIsMixPlayerOpen,
        selectedMashupForDetail,
        openMashupDetail,
        closeMashupDetail,
        playMashup,
        playMix,
        pause,
        resume,
        next,
        previous,
        seek,
        setVolume,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) throw new Error('usePlayback must be used within PlaybackProvider');
  return context;
};
