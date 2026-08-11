import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Mashup, MashupMix, ResolvedAudio } from '../types/mashup';
import { audioResolver } from '../services/engine/AudioResolver';

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
  resolvedAudio: ResolvedAudio | null;
  isMixPlayerOpen: boolean;
  setIsMixPlayerOpen: (open: boolean) => void;
  selectedMashupForDetail: Mashup | null;
  openMashupDetail: (mashup: Mashup) => void;
  closeMashupDetail: () => void;

  playMashup: (mashup: Mashup) => Promise<void>;
  playMix: (mix: MashupMix, initialIndex?: number) => Promise<void>;
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
  const [duration, setDuration] = useState<number>(30);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [error, setError] = useState<string | null>(null);
  const [resolvedAudio, setResolvedAudio] = useState<ResolvedAudio | null>(null);
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
      setDuration(audio.duration || 30);
    };

    const handleEnded = () => {
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
      setError("Audio preview stream isn't available for this track.");
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

  const playMashupDirect = async (mashup: Mashup) => {
    setError(null);
    setIsBuffering(true);

    if (mashup.availability === 'external-only' || mashup.availability === 'unavailable') {
      setError('This mashup is external-only. Use "Listen on source ↗".');
      setIsBuffering(false);
      setIsPlaying(false);
      return;
    }

    const resolved = await audioResolver.resolveMashup(mashup);
    if (!resolved || !resolved.url) {
      setError('No authorized audio stream available for this mashup.');
      setIsBuffering(false);
      setIsPlaying(false);
      return;
    }

    setResolvedAudio(resolved);
    setCurrentMashup(mashup);
    setCurrentMix(null);
    setCurrentIndex(0);

    if (audioRef.current) {
      audioRef.current.src = resolved.url;
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

  const playTrackInMix = async (mix: MashupMix, index: number) => {
    if (!mix.mashups[index]) return;

    const mashup = mix.mashups[index];
    if (mashup.availability === 'external-only' || mashup.availability === 'unavailable') {
      // Auto-skip unavailable item in mix
      if (index + 1 < mix.mashups.length) {
        playTrackInMix(mix, index + 1);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    const resolved = await audioResolver.resolveMashup(mashup);
    if (!resolved || !resolved.url) {
      if (index + 1 < mix.mashups.length) {
        playTrackInMix(mix, index + 1);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    setError(null);
    setIsBuffering(true);
    setResolvedAudio(resolved);
    setCurrentMix(mix);
    setCurrentMashup(mashup);
    setCurrentIndex(index);

    if (audioRef.current) {
      audioRef.current.src = resolved.url;
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

  const playMashup = useCallback(async (mashup: Mashup) => {
    await playMashupDirect(mashup);
  }, []);

  const playMix = useCallback(async (mix: MashupMix, initialIndex: number = 0) => {
    await playTrackInMix(mix, initialIndex);
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
        resolvedAudio,
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
