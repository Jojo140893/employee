"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, RotateCcw, FastForward, Activity } from "lucide-react";

interface WaveformPlayerProps {
  audioUrl: string;
  durationSeconds: number;
  callSid?: string;
  canDownload?: boolean;
}

export default function WaveformPlayer({ audioUrl, durationSeconds, callSid, canDownload = true }: WaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate 48 pseudorandom normalized waveform heights for realistic visual rendering
  const [waveformBars] = useState(() => {
    return Array.from({ length: 54 }, (_, i) => {
      const seed = Math.sin(i * 0.4) * 0.5 + 0.5;
      return Math.max(15, Math.floor(seed * 85));
    });
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleSeek = (index: number) => {
    if (!audioRef.current) return;
    const targetPercent = index / waveformBars.length;
    const seekTime = targetPercent * (durationSeconds || 120);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono text-[11px] text-slate-300">
            {callSid || "Google Voice Dual-Channel Audio"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Dual-Channel MP3
          </span>
          <span className="font-mono text-slate-300 text-xs">
            {formatTime(currentTime)} / {formatTime(durationSeconds)}
          </span>
        </div>
      </div>

      {/* Interactive Waveform Bar Visualizer */}
      <div className="h-16 flex items-center justify-between gap-[2px] bg-slate-950/70 p-2 rounded-xl mb-4 cursor-pointer select-none border border-slate-800/80">
        {waveformBars.map((height, i) => {
          const barPercent = (i / waveformBars.length) * 100;
          const isPlayed = barPercent <= progressPercent;
          return (
            <div
              key={i}
              onClick={() => handleSeek(i)}
              className="flex-1 flex items-center justify-center h-full group"
            >
              <div
                style={{ height: `${height}%` }}
                className={`w-full rounded-full transition-all duration-75 group-hover:bg-blue-400 ${
                  isPlayed ? "bg-blue-500 shadow-xs shadow-blue-500/50" : "bg-slate-700/80"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Playback Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-blue-600/30"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Button */}
          <button
            onClick={handleSpeedChange}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-blue-400 border border-slate-700 transition-colors"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Volume & Download */}
        <div className="flex items-center space-x-3 text-slate-400">
          <button
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              if (audioRef.current) audioRef.current.muted = nextMute;
            }}
            className="hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {canDownload && (
            <a
              href={audioUrl}
              download="google-voice-call-recording.mp3"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
