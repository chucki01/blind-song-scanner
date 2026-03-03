import React, { useEffect, useState } from "react";

interface WaitingForFlipProps {
  onFlipped: () => void;
  onCancel: () => void;
}

export const WaitingForFlip: React.FC<WaitingForFlipProps> = ({ onFlipped, onCancel }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      if (Math.abs(beta) > 150 && !isFlipped) {
        setIsFlipped(true);
        onFlipped();
      }
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isFlipped, onFlipped]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-8 min-h-[60vh]">

      {/* Animated flip icon */}
      <div
        className="w-28 h-28 rounded-2xl flex items-center justify-center text-6xl"
        style={{
          background: "rgba(202,255,0,0.08)",
          border: "1.5px solid rgba(202,255,0,0.25)",
          animation: "acidPulse 1.5s ease-in-out infinite",
        }}
      >
        🔄
      </div>

      <div className="text-center flex flex-col gap-2">
        <h2
          className="text-4xl tracking-wide"
          style={{
            fontFamily: "'Russo One', sans-serif",
            color: "#CAFF00",
            textShadow: "0 0 30px rgba(202,255,0,0.4)",
            animation: "acidPulse 2s ease-in-out infinite",
          }}
        >
          ¡GIRA!
        </h2>
        <p
          className="text-lg font-bold"
          style={{ color: "rgba(245,242,235,0.7)", fontFamily: "Raleway, sans-serif" }}
        >
          Pon el móvil boca abajo
        </p>
        <p
          className="text-sm"
          style={{ color: "rgba(245,242,235,0.3)", fontFamily: "Raleway, sans-serif" }}
        >
          La música empieza automáticamente
        </p>
      </div>

      {/* Tip */}
      <div
        className="w-full rounded-2xl p-4 text-center"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-xs font-bold" style={{ color: "rgba(245,242,235,0.3)", fontFamily: "Raleway, sans-serif" }}>
          💡 Gira completamente hasta que quede horizontal
        </p>
      </div>

      <button
        onClick={onCancel}
        className="text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.2)", fontFamily: "Raleway, sans-serif" }}
      >
        Cancelar
      </button>
    </div>
  );
};
