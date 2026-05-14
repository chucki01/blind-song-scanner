import React from "react";

interface ReadyToOpenSpotifyProps {
  onOpenSpotify: () => void;
  onCancel: () => void;
}

export const ReadyToOpenSpotify: React.FC<ReadyToOpenSpotifyProps> = ({ onOpenSpotify, onCancel }) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">
    <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
      style={{ background: "rgba(232,23,93,0.07)", border: "1.5px solid rgba(232,23,93,0.2)", animation: "redPulse 2.5s ease-in-out infinite" }}>
      🎵
    </div>
    <div className="text-center">
      <h2 className="text-3xl tracking-wide mb-2"
        style={{ fontFamily: "'Russo One', sans-serif", color: "#E8175D" }}>
        ¿LISTO?
      </h2>
      <p className="text-base" style={{ color: "rgba(0,0,0,0.35)" }}>
        Al tocar el botón se abrirá Spotify
      </p>
    </div>
    <div className="w-full rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#EFEFEF", border: "1px solid rgba(0,0,0,0.07)" }}>
      {[
        { n: "1", text: "Toca el botón de abajo" },
        { n: "2", text: "Gira el móvil boca abajo", highlight: true },
        { n: "3", text: "Spotify se abrirá solo" },
        { n: "4", text: "Escucha sin mirar 😉" },
      ].map(({ n, text, highlight }) => (
        <div key={n} className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: highlight ? "#E8175D" : "rgba(232,23,93,0.1)", color: highlight ? "#000" : "#E8175D", fontFamily: "'Russo One', sans-serif" }}>
            {n}
          </div>
          <span className="text-base font-bold"
            style={{ color: highlight ? "#E8175D" : "rgba(0,0,0,0.35)" }}>
            {text}
          </span>
        </div>
      ))}
    </div>
    <button onClick={onOpenSpotify}
      className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: "#E8175D", color: "#fff", fontFamily: "'Russo One', sans-serif", fontSize: "16px", letterSpacing: "0.1em", boxShadow: "0 8px 30px rgba(232,23,93,0.2)" }}>
      ▶ ¡EMPEZAR!
    </button>
    <button onClick={onCancel}
      className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
      style={{ color: "rgba(0,0,0,0.35)" }}>
      Cancelar
    </button>
  </div>
);
