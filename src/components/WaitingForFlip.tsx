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
      <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-7xl"
        style={{ background: "rgba(202,255,0,0.08)", border: "1.5px solid rgba(202,255,0,0.25)", animation: "acidPulse 1.5s ease-in-out infinite" }}>
        🔄
      </div>
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-5xl tracking-wide"
          style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00", textShadow: "0 0 30px rgba(202,255,0,0.4)" }}>
          ¡GIRA!
        </h2>
        <p className="text-xl font-bold" style={{ color: "rgba(245,242,235,0.7)" }}>
          Pon el móvil boca abajo
        </p>
        <p className="text-base" style={{ color: "rgba(245,242,235,0.4)" }}>
          La música empieza automáticamente
        </p>
      </div>
      <div className="w-full rounded-2xl p-4 text-center"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-sm font-bold" style={{ color: "rgba(245,242,235,0.3)" }}>
          💡 Gira completamente hasta que quede horizontal
        </p>
      </div>
      <button onClick={onCancel}
        className="text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ color: "rgba(245,242,235,0.25)" }}>
        Cancelar
      </button>
    </div>
  );
};
