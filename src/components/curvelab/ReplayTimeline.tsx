'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Zap } from 'lucide-react';

interface ReplayTimelineProps {
  currentQuoteReserve: number;
  setCurrentQuoteReserve: React.Dispatch<React.SetStateAction<number>>;
  migrationQuoteThreshold: number;
  quoteSymbol: string;
}

export const ReplayTimeline: React.FC<ReplayTimelineProps> = ({
  currentQuoteReserve,
  setCurrentQuoteReserve,
  migrationQuoteThreshold,
  quoteSymbol,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 5x, 20x

  // Progress percentage
  const progressPct = Math.min(100, (currentQuoteReserve / (migrationQuoteThreshold || 1)) * 100);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentQuoteReserve((prev) => {
        const step = (migrationQuoteThreshold / 120) * playbackSpeed;
        const next = prev + step;
        if (next >= migrationQuoteThreshold) {
          setIsPlaying(false);
          return migrationQuoteThreshold;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, migrationQuoteThreshold, setCurrentQuoteReserve]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentQuoteReserve(0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentQuoteReserve((val / 100) * migrationQuoteThreshold);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#0a0c12] border border-[#1f232f] rounded-xl p-4 font-mono text-xs">
      {/* Title row */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#181b24]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#00d2c4] animate-pulse"></span>
          <span className="text-white font-bold">REPLAY TIMELINE SCRUBBER</span>
        </div>
        <div className="text-[11px] text-[#7f889b]">
          Speed: {playbackSpeed}x
        </div>
      </div>

      {/* Graduation Status Indicator */}
      <div className="p-3 bg-[#11131c] border border-[#1f232f] rounded-lg space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#a5b0c4]">Threshold Progress:</span>
          <span className="text-white font-bold">
            {currentQuoteReserve.toFixed(2)} / {migrationQuoteThreshold} {quoteSymbol} ({progressPct.toFixed(1)}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#08090d] rounded-full overflow-hidden p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              progressPct >= 100
                ? 'bg-[#10b981]'
                : 'bg-gradient-to-r from-[#00d2c4] via-[#ff5c16] to-[#10b981]'
            }`}
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[10px] text-[#7f889b]">
          <span>Launch t=0</span>
          <span>
            {progressPct >= 100 ? (
              <span className="text-[#10b981] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> DAMM v2 Graduated
              </span>
            ) : (
              <span>{(migrationQuoteThreshold - currentQuoteReserve).toFixed(2)} {quoteSymbol} remaining</span>
            )}
          </span>
        </div>
      </div>

      {/* Scrubber Range Slider */}
      <div className="space-y-1 my-3">
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={progressPct}
          onChange={handleSliderChange}
          className="w-full accent-[#ff5c16] cursor-pointer"
        />
      </div>

      {/* Transport Controls (Play / Pause / Reset / Speed) */}
      <div className="flex items-center justify-between pt-2 border-t border-[#181b24]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-[#ff5c16] hover:bg-[#ff7438] text-white flex items-center justify-center cursor-pointer shadow-glow"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#141722] hover:bg-[#1c202e] border border-[#232734] text-[#a5b0c4] hover:text-white cursor-pointer"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector Buttons */}
        <div className="flex items-center space-x-1 bg-[#12141c] p-1 rounded-lg border border-[#1f232f]">
          {[1, 5, 20].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                playbackSpeed === s
                  ? 'bg-[#ff5c16] text-white font-bold'
                  : 'text-[#7f889b] hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
