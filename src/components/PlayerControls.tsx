import React from "react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
}) => (
  <div className="flex flex-col items-center justify-center mb-8 p-4">
    <button
      onClick={onPlayPause}
      className="w-24 h-24 rounded-full bg-[#1DB954] hover:bg-[#1ed760] transition-all flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-lg"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        // Pause icon
        <svg
          className="w-12 h-12 text-black"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        // Play icon
        <svg
          className="w-12 h-12 text-black ml-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
    <p className="text-gray-400 mt-4 text-sm">
      {isPlaying ? "Playing..." : "Paused"}
    </p>
  </div>
);
