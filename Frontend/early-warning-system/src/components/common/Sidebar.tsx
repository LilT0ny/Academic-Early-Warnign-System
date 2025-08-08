import React from "react";
import { cn } from "../../lib/cn";

interface SidebarProps {
  items: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  collapsed?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, collapsed = false, className }) => {
  return (
    <aside
      className={cn(
        "h-screen border-r bg-white px-3 py-4 transition-all",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      <nav className="space-y-1">
        {items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="shrink-0">{it.icon}</span>
            {!collapsed && <span className="truncate">{it.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};
