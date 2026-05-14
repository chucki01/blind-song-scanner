import React from "react";

interface HeaderProps {
  onLogoClick: () => void;
  small: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, small }) => (
  <div
    className={`flex flex-col items-center transition-all duration-500 ${small ? "mb-4" : "mb-10"}`}
    onClick={onLogoClick}
    style={{ cursor: "pointer" }}
  >
    <div style={{ lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "'Russo One', sans-serif",
          fontSize: small ? "28px" : "52px",
          color: "#111111",
          letterSpacing: "-1px",
        }}
      >
        SCAN
      </span>
      <span
        style={{
          fontFamily: "'Russo One', sans-serif",
          fontSize: small ? "28px" : "52px",
          color: "#E8175D",
          letterSpacing: "-1px",
        }}
      >
        HITS
      </span>
    </div>
    {!small && (
      <p
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          color: "#1B4F9B",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginTop: "6px",
        }}
      >
        Escanea · Escucha · Adivina
      </p>
    )}
  </div>
);
