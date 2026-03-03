import React from "react";
import { BlackSpotifyIcon } from "./icons/BlackSpotifyIcon.tsx";

interface LoginButtonProps {
  href: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ href }) => (
  <div className="flex flex-col items-center gap-6 w-full">

    {/* QR decorative icon */}
    <div
      className="w-24 h-24 rounded-2xl flex items-center justify-center animate-float"
      style={{
        background: "rgba(202,255,0,0.07)",
        border: "1.5px solid rgba(202,255,0,0.2)",
        animation: "acidPulse 2.5s ease-in-out infinite",
      }}
    >
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
        <rect x="8" y="8" width="8" height="8" rx="1" fill="#CAFF00"/>
        <rect x="28" y="4" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
        <rect x="32" y="8" width="8" height="8" rx="1" fill="#CAFF00"/>
        <rect x="4" y="28" width="16" height="16" rx="2" stroke="#CAFF00" strokeWidth="2" fill="none"/>
        <rect x="8" y="32" width="8" height="8" rx="1" fill="#CAFF00"/>
        <text x="36" y="42" textAnchor="middle" fontSize="14" fill="#CAFF00" opacity="0.9">♪</text>
        <rect x="28" y="28" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.7"/>
        <rect x="35" y="28" width="5" height="5" rx="1" fill="#CAFF00" opacity="0.4"/>
        <rect x="28" y="35" width="12" height="5" rx="1" fill="#CAFF00" opacity="0.6"/>
      </svg>
    </div>

    {/* Login button */}
    <a
      href={href}
      className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "#CAFF00",
        color: "#000",
        fontFamily: "'Russo One', sans-serif",
        fontSize: "15px",
        letterSpacing: "0.1em",
        boxShadow: "0 8px 30px rgba(202,255,0,0.25)",
        textDecoration: "none",
      }}
    >
      <BlackSpotifyIcon className="w-5 h-5" />
      CONECTAR CON SPOTIFY
    </a>

    {/* Fine print */}
    <p
      className="text-xs text-center leading-relaxed"
      style={{ color: "rgba(245,242,235,0.25)", fontFamily: "Raleway, sans-serif" }}
    >
      Funciona con cuenta Spotify Free y Premium
    </p>
  </div>
);
