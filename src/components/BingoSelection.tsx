import React, { useEffect, useState } from "react";

interface BingoEdition {
  name: string;
  description: string;
  playlistUrl: string;
  emoji: string;
}

const BINGO_EDITIONS: BingoEdition[] = [
  {
    name: "FRIKIPOP",
    description: "Los hits más frikis del pop",
    playlistUrl: "https://open.spotify.com/playlist/2mfcUBJmNCX0Hw3s0Mk0m3",
    emoji: "🎸",
  },
  {
    name: "¿TE SUENA?",
    description: "Canciones que todo el mundo conoce",
    playlistUrl: "https://open.spotify.com/playlist/6yLMzwzQFGgMyLS6KK1rAR",
    emoji: "🎵",
  },
];

interface BingoSelectionProps {
  onSelect: (playlistUrl: string) => void;
  onCancel: () => void;
}

export const BingoSelection: React.FC<BingoSelectionProps> = ({ onSelect, onCancel }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-6 w-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div className="text-center">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          MODO BINGO
        </p>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}
        >
          Elige tu edición
        </h2>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {BINGO_EDITIONS.map((edition) => (
          <button
            key={edition.name}
            onClick={() => onSelect(edition.playlistUrl)}
            className="w-full py-5 px-5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(232,23,93,0.06)",
              border: "1.5px solid rgba(232,23,93,0.2)",
              boxShadow: "0 4px 20px rgba(232,23,93,0.06)",
            }}
          >
            <div className="flex items-center gap-4">
              <span style={{ fontSize: "32px" }}>{edition.emoji}</span>
              <p
                className="font-bold"
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  color: "#E8175D",
                  fontSize: "16px",
                  letterSpacing: "0.08em",
                }}
              >
                {edition.name}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onCancel}
        className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(0,0,0,0.25)" }}
      >
        ← Cambiar modo
      </button>
    </div>
  );
};
