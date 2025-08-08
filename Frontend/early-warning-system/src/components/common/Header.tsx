import React from "react";
import { cn } from "../../lib/cn";

interface HeaderProps {
  title?: string;
  right?: React.ReactNode; // acciones (botones, avatar, etc.)
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Academic EWS", right, className }) => {
  return (
    <header className={cn("sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b", className)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
};

