import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { RadioStation, StationTrack } from '../types/radio';
import { radioService } from '../services/RadioService';

interface RadioContextType {
  currentStation: RadioStation;
  currentTrack: StationTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  spectrumBars: number[];
  isHonking: boolean;
  isLoadingAudio: boolean;

  tuneToStation: (stationId: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  honkHorn: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stations = radioService.getStations();
  const [currentStation, setCurrentStation] = useState<RadioStation>(stations[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isHonking, setIsHonking] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [spectrumBars, setSpectrumBars] = useState<number[]>([30, 60, 45, 80, 55, 90, 70, 40, 85, 60, 75, 50, 95, 65, 40, 70]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

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
      setIsPlaying(false);
    };

    const handleWaiting = () => setIsLoadingAudio(true);
    const handleCanPlay = () => setIsLoadingAudio(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Audio Spectrum Bar Animation
  useEffect(() => {
    let animId: number;
    const updateSpectrum = () => {
      if (isPlaying) {
        setSpectrumBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 75) + 20));
      } else {
        setSpectrumBars(Array.from({ length: 16 }, () => 15));
      }
      animId = requestAnimationFrame(updateSpectrum);
    };

    animId = requestAnimationFrame(updateSpectrum);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Synthetic Dual-Tone Indian Truck Horn (Web Audio API)
  const honkHorn = useCallback(() => {
    try {
      if (!webAudioCtxRef.current) {
        webAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      setIsHonking(true);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(340, ctx.currentTime);
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);

      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);

      setTimeout(() => setIsHonking(false), 450);
    } catch (e) {
      console.warn('Horn synthesis failed:', e);
      setIsHonking(false);
    }
  }, []);

  // Resolve Actual Real Song Stream from iTunes API
  const fetchRealAudioStream = async (track: StationTrack): Promise<string | null> => {
    const cacheKey = `${track.title}_${track.artist}`;
    if (audioCacheRef.current.has(cacheKey)) {
      return audioCacheRef.current.get(cacheKey) || null;
    }

    try {
      // Query iTunes Search API for actual real track audio stream
      const query = track.sourceTracks?.[0] || `${track.title} ${track.artist}`;
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].previewUrl) {
        const previewUrl = data.results[0].previewUrl;
        audioCacheRef.current.set(cacheKey, previewUrl);
        return previewUrl;
      }
    } catch (e) {
      console.warn('Failed to resolve real song audio:', e);
    }

    return null;
  };

  const playStationAudio = async (station: RadioStation) => {
    setCurrentStation(station);
    setIsLoadingAudio(true);

    const realAudioUrl = await fetchRealAudioStream(station.currentTrack);
    if (!realAudioUrl) {
      setIsLoadingAudio(false);
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = realAudioUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
    }
  };

  const tuneToStation = useCallback((stationId: string) => {
    const station = radioService.getStation(stationId);
    if (station) {
      playStationAudio(station);
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      playStationAudio(currentStation);
    }
  }, [currentStation]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  return (
    <RadioContext.Provider
      value={{
        currentStation,
        currentTrack: currentStation.currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        spectrumBars,
        isHonking,
        isLoadingAudio,
        tuneToStation,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        honkHorn,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) throw new Error('useRadio must be used within RadioProvider');
  return context;
};
