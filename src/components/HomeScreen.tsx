import React, { useEffect, useState } from "react";
import { Logo } from "./Logo.tsx";

interface HomeScreenProps {
  onStart: () => void;
  onInstructions: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onInstructions }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-10 w-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <Logo />

      <button
        onClick={onStart}
        className="w-full py-5 rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.03] active:scale-[0.97]"
        style={{ background: "#E8175D", color: "#fff", fontFamily: "'Russo One', sans-serif", fontSize: "18px", letterSpacing: "0.15em", boxShadow: "0 8px 40px rgba(232,23,93,0.3)" }}
      >
        ▶ JUGAR
      </button>

      <button
        onClick={() => window.open("/manual.pdf", "_blank")}
        className="w-full py-4 rounded-2xl font-bold tracking-wide transition-all hover:opacity-80"
        style={{ background: "rgba(27,79,155,0.06)", border: "1px solid rgba(27,79,155,0.15)", color: "#1B4F9B", fontFamily: "'Russo One', sans-serif", fontSize: "14px", letterSpacing: "0.1em" }}
      >
        CÓMO SE JUEGA
      </button>
    </div>
  );
};
