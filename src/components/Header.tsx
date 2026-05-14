import React from "react";
import logo from "../assets/img/logo.png";

interface HeaderProps {
  onLogoClick: () => void;
  small: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, small }) => (
  <div
    className={`flex flex-col items-center transition-all duration-500 ${small ? "mb-4" : "mb-10"}`}
  >
    <img
      src={logo}
      alt="ScanHits"
      onClick={onLogoClick}
      className="cursor-pointer select-none transition-all duration-500"
      style={{ width: small ? "120px" : "220px" }}
    />
  </div>
);
