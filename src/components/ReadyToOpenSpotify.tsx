import React from "react";

interface ReadyToOpenSpotifyProps {
  onOpenSpotify: () => void;
  onCancel: () => void;
}

export const ReadyToOpenSpotify: React.FC<ReadyToOpenSpotifyProps> = ({ onOpenSpotify, onCancel }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">
    <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
      style={{ background: "rgba(202,255,0,0.08)", border: "1.5px solid rgba(202,255,0,0.2)", animation: "acidPulse 2.5s ease-in-out infinite" }}>
      🎵
    </div>
    <div className="text-center">
      <h2 className="text-3xl tracking-wide mb-2"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}>
        ¿LISTO?
      </h2>
      <p className="text-base" style={{ color: "rgba(245,242,235,0.5)" }}>
        Al tocar el botón se abrirá Spotify
      </p>
    </div>
    <div className="w-full rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
      {[
        { n: "1", text: "Toca el botón de abajo" },
        { n: "2", text: "Gira el móvil boca abajo", highlight: true },
        { n: "3", text: "Spotify se abrirá solo" },
        { n: "4", text: "Escucha sin mirar 😉" },
      ].map(({ n, text, highlight }) => (
        <div key={n} className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: highlight ? "#CAFF00" : "rgba(202,255,0,0.1)", color: highlight ? "#000" : "#CAFF00", fontFamily: "'Russo One', sans-serif" }}>
            {n}
          </div>
          <span className="text-base font-bold"
            style={{ color: highlight ? "#CAFF00" : "rgba(245,242,235,0.6)" }}>
            {text}
          </span>
        </div>
      ))}
    </div>
    <button onClick={onOpenSpotify}
      className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: "#CAFF00", color: "#000", fontFamily: "'Russo One', sans-serif", fontSize: "16px", letterSpacing: "0.1em", boxShadow: "0 8px 30px rgba(202,255,0,0.25)" }}>
      ▶ ¡EMPEZAR!
    </button>
    <button onClick={onCancel}
      className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
      style={{ color: "rgba(245,242,235,0.25)" }}>
      Cancelar
    </button>
  </div>
);
