import React from "react";

export const Logo: React.FC = () => (
  <div className="flex flex-col items-center">
    <div style={{ lineHeight: 1 }}>
      <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: "52px", color: "#111111", letterSpacing: "-1px" }}>
        SCAN
      </span>
      <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: "52px", color: "#E8175D", letterSpacing: "-1px" }}>
        HITS
      </span>
    </div>
    <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, fontSize: "11px", color: "#1B4F9B", letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "6px" }}>
      Escanea · Escucha · Adivina
    </p>
  </div>
);
