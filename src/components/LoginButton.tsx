import { Logo } from "./Logo.tsx";
import React from "react";
import { BlackSpotifyIcon } from "./icons/BlackSpotifyIcon.tsx";

interface LoginButtonProps {
  href: string;
  onInstructions: () => void;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ href, onInstructions }) => (
  <div className="flex flex-col items-center gap-6 w-full">

    <Logo />

    {/* Login button */}
    <a
      href={href}
      className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "#E8175D",
        color: "#fff",
        fontFamily: "'Russo One', sans-serif",
        fontSize: "15px",
        letterSpacing: "0.1em",
        boxShadow: "0 8px 30px rgba(232,23,93,0.2)",
        textDecoration: "none",
      }}
    >
      <BlackSpotifyIcon className="w-5 h-5" />
      CONECTAR CON SPOTIFY
    </a>

    {/* Fine print */}
    <p
      className="text-xs text-center leading-relaxed"
      style={{ color: "rgba(0,0,0,0.35)", fontFamily: "Raleway, sans-serif" }}
    >
      Funciona con cuenta Spotify Free y Premium
    </p>

    {/* Instructions button */}
    <button
      onClick={onInstructions}
      className="w-full py-4 rounded-2xl font-bold tracking-wide transition-all hover:opacity-80"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(0,0,0,0.35)",
        fontFamily: "'Russo One', sans-serif",
        fontSize: "14px",
        letterSpacing: "0.1em",
      }}
    >
      ? CÓMO SE JUEGA
    </button>
  </div>
);
