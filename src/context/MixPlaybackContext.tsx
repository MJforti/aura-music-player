import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Mix, MixTrack } from '../types/mix';
import { Track } from '../types/catalog';

interface MixPlaybackContextType {
  currentMix: Mix | null;
  currentTrack: Track | null;
  currentMixTrack: MixTrack | null;
  trackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  mixCurrentTime: number;
  mixDuration: number;
  isBuffering: boolean;
  volume: number;
  error: string | null;

  playMix: (mix: Mix, trackIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (timeInSeconds: number) => void;
  setVolume: (vol: number) => void;
  isMixPlayerOpen: boolean;
  setIsMixPlayerOpen: (open: boolean) => void;
}

const MixPlaybackContext = createContext<MixPlaybackContextType | undefined>(undefined);

export const MixPlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMix, setCurrentMix] = useState<Mix | null>(null);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [error, setError] = useState<string | null>(null);
  const [isMixPlayerOpen, setIsMixPlayerOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeMixRef = useRef<Mix | null>(null);
  const activeIndexRef = useRef<number>(0);

  activeMixRef.current = currentMix;
  activeIndexRef.current = trackIndex;

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
      // Auto-advance to next track in mix seamlessly!
      if (activeMixRef.current) {
        const nextIdx = activeIndexRef.current + 1;
        if (nextIdx < activeMixRef.current.tracks.length) {
          playTrackAtIndex(activeMixRef.current, nextIdx);
        } else {
          setIsPlaying(false);
        }
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => {
      setError("This discovery clip isn't available right now.");
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

  const playTrackAtIndex = (mix: Mix, index: number) => {
    if (!mix.tracks[index]) return;

    setError(null);
    setIsBuffering(true);
    setCurrentMix(mix);
    setTrackIndex(index);

    const mixTrack = mix.tracks[index];
    const track = mixTrack.track;
    const streamUrl = track.previewStreamUrl || track.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    if (audioRef.current) {
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          updateMediaSession(mix, track);
        })
        .catch(err => {
          console.warn('Playback error:', err);
          setIsBuffering(false);
          setIsPlaying(false);
        });
    }
  };

  const updateMediaSession = (mix: Mix, track: Track) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${track.title} (${mix.title})`,
        artist: track.artistName,
        album: mix.title,
        artwork: [{ src: track.artworkUrl || mix.artworkUrl, sizes: '512x512', type: 'image/jpeg' }],
      });

      navigator.mediaSession.setActionHandler('play', resume);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
      navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
    }
  };

  const playMix = useCallback((mix: Mix, initialTrackIndex: number = 0) => {
    playTrackAtIndex(mix, initialTrackIndex);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && currentMix) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [currentMix]);

  const nextTrack = useCallback(() => {
    if (currentMix && trackIndex < currentMix.tracks.length - 1) {
      playTrackAtIndex(currentMix, trackIndex + 1);
    }
  }, [currentMix, trackIndex]);

  const previousTrack = useCallback(() => {
    if (currentMix && trackIndex > 0) {
      playTrackAtIndex(currentMix, trackIndex - 1);
    }
  }, [currentMix, trackIndex]);

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

  const currentMixTrack = currentMix?.tracks[trackIndex] || null;
  const currentTrack = currentMixTrack?.track || null;
  const mixDuration = currentMix?.duration || 0;
  const mixCurrentTime = (trackIndex * 30) + currentTime;

  return (
    <MixPlaybackContext.Provider
      value={{
        currentMix,
        currentTrack,
        currentMixTrack,
        trackIndex,
        isPlaying,
        currentTime,
        duration,
        mixCurrentTime,
        mixDuration,
        isBuffering,
        volume,
        error,
        playMix,
        pause,
        resume,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        isMixPlayerOpen,
        setIsMixPlayerOpen,
      }}
    >
      {children}
    </MixPlaybackContext.Provider>
  );
};

export const useMixPlayback = () => {
  const context = useContext(MixPlaybackContext);
  if (!context) throw new Error('useMixPlayback must be used within MixPlaybackProvider');
  return context;
};
