import React from "react";

interface HeaderProps {
  onLogoClick: () => void;
  small: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, small }) => (
  <div
    className={`flex flex-col items-center transition-all duration-500 ${small ? "mb-4" : "mb-10"}`}
  >
    <h1
      className="font-russo cursor-pointer select-none tracking-tight leading-none"
      style={{ fontFamily: "'Russo One', sans-serif" }}
      onClick={onLogoClick}
    >
      <span className={`transition-all duration-500 ${small ? "text-2xl" : "text-5xl"}`}
        style={{ color: "#111111" }}>
        SCAN
      </span>
      <span className={`transition-all duration-500 ${small ? "text-2xl" : "text-5xl"}`}
        style={{ color: "#E8175D" }}>
        HITS
      </span>
    </h1>

    {!small && (
      <p
        className="text-xs uppercase mt-3 font-bold whitespace-nowrap"
        style={{ color: "#1B4F9B", letterSpacing: "0.2em", fontFamily: "Raleway, sans-serif" }}
      >
        Escanea · Escucha · Adivina
      </p>
    )}
  </div>
);
