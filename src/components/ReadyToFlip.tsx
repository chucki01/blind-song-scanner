import React, { useState } from "react";

interface ReadyToFlipProps {
  onReady: () => void;
  onCancel: () => void;
  isFree: boolean;
}

export const ReadyToFlip: React.FC<ReadyToFlipProps> = ({ onReady, onCancel, isFree }) => {
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === "granted") {
          onReady();
        } else {
          alert("Se necesita permiso para usar el giroscopio");
          setRequesting(false);
        }
      } catch {
        setRequesting(false);
      }
    } else {
      onReady();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto gap-6">

      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
        style={{
          background: "rgba(202,255,0,0.08)",
          border: "1.5px solid rgba(202,255,0,0.2)",
          animation: "acidPulse 2.5s ease-in-out infinite",
        }}
      >
        📱
      </div>

      <div className="text-center">
        <h2
          className="text-2xl tracking-wide mb-1"
          style={{ fontFamily: "'Russo One', sans-serif", color: "#CAFF00" }}
        >
          ¡PREPÁRATE!
        </h2>
        {isFree && (
          <p className="text-xs font-bold mt-2" style={{ color: "rgba(0,194,255,0.7)", fontFamily: "Raleway, sans-serif" }}>
            Cuenta Free · 30 segundos de preview
          </p>
        )}
      </div>

      {/* Steps */}
      <div
        className="w-full rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {[
          { n: "1", text: "Toca el botón de abajo" },
          { n: "2", text: "Gira el móvil boca abajo", highlight: true },
          { n: "3", text: "La canción empieza sola" },
          { n: "4", text: "Escucha sin mirar 😉" },
        ].map(({ n, text, highlight }) => (
          <div key={n} className="flex items-center gap-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{
                background: highlight ? "#CAFF00" : "rgba(202,255,0,0.1)",
                color: highlight ? "#000" : "#CAFF00",
                fontFamily: "'Russo One', sans-serif",
              }}
            >
              {n}
            </div>
            <span
              className="text-sm font-bold"
              style={{
                color: highlight ? "#CAFF00" : "rgba(245,242,235,0.6)",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleRequestPermission}
        disabled={requesting}
        className="w-full py-4 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        style={{
          background: "#CAFF00",
          color: "#000",
          fontFamily: "'Russo One', sans-serif",
          fontSize: "15px",
          letterSpacing: "0.1em",
          boxShadow: "0 8px 30px rgba(202,255,0,0.25)",
        }}
      >
        {requesting ? "PREPARANDO..." : "🔄 ¡LISTO!"}
      </button>

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
