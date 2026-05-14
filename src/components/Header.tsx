import React from "react";
import { Logo } from "./Logo.tsx";

interface HeaderProps {
  onLogoClick: () => void;
  small: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, small }) => (
  <div
    className={`flex flex-col items-center transition-all duration-500 cursor-pointer ${small ? "mb-4" : "mb-10"}`}
    onClick={onLogoClick}
    style={{ transform: small ? "scale(0.55)" : "scale(1)", transformOrigin: "top center" }}
  >
    <Logo />
  </div>
);
