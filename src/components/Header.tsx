import React from "react";

interface HeaderProps {
  onLogoClick: () => void;
  small: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, small }) => (
  <div
    className={`flex flex-col items-center transition-all duration-500 ${small ? "mb-4" : "mb-10"}`}
  >
    {/* Logo */}
    <h1
      className="font-russo cursor-pointer select-none tracking-tight leading-none"
      style={{ fontFamily: "'Russo One', sans-serif" }}
      onClick={onLogoClick}
    >
      <span
        className={`block text-center transition-all duration-500 text-[#f5f2eb] ${small ? "text-2xl" : "text-5xl"}`}
      >
        SCAN
      </span>
      <span
        className={`block text-center transition-all duration-500 ${small ? "text-2xl" : "text-5xl"}`}
        style={{ color: "#CAFF00", textShadow: "0 0 30px rgba(202,255,0,0.5)" }}
      >
        HITS
      </span>
    </h1>

    {/* Tagline — only when big */}
    {!small && (
      <p
        className="text-xs tracking-widest uppercase mt-3 font-bold"
        style={{ color: "rgba(245,242,235,0.3)", letterSpacing: "0.3em" }}
      >
        Escanea · Escucha · Adivina
      </p>
    )}
  </div>
);
