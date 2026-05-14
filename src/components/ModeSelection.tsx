import React from "react";

interface ModeSelectionProps {
  onSelectNormal: () => void;
  onSelectBingo: () => void;
  onInstructions: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelectNormal,
  onSelectBingo,
  onInstructions,
}) => (
  <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto">

    <p className="text-base font-bold tracking-widest uppercase mb-8 text-center"
      style={{ color: "#1B4F9B" }}>
      Elige modo de juego
    </p>

    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={onSelectNormal}
        className="w-full py-5 px-5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "#E8175D", boxShadow: "0 8px 30px rgba(232,23,93,0.25)" }}
      >
        <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: "20px", color: "#fff" }}>
          MODO NORMAL
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
          Escanea &middot; Escucha &middot; Adivina
        </div>
      </button>

      <button
        onClick={onSelectBingo}
        className="w-full py-5 px-5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "rgba(27,79,155,0.07)", border: "1.5px solid rgba(27,79,155,0.2)" }}
      >
        <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: "20px", color: "#1B4F9B" }}>
          MODO BINGO
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(27,79,155,0.6)", marginTop: "4px" }}>
          Tu cart&oacute;n de bingo musical
        </div>
      </button>
    </div>

    <button
      onClick={onInstructions}
      className="w-full mt-4 py-4 rounded-2xl font-bold tracking-wide transition-all hover:opacity-80"
      style={{
        background: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.08)",
        color: "rgba(0,0,0,0.3)",
        fontFamily: "'Russo One', sans-serif",
        fontSize: "14px",
        letterSpacing: "0.1em",
      }}
    >
      CÓMO SE JUEGA
    </button>
  </div>
);