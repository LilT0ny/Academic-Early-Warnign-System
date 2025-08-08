import React from "react";
import { cn } from "../../lib/cn";

interface Props {
  size?: number; // px
  className?: string;
  label?: string;
}

import "./LoadingSpinner.css";

export const LoadingSpinner: React.FC<Props> = ({ size = 24, className, label }) => {
  const spinnerClass = `loading-spinner loading-spinner--${size}`;
  return (
    <div className={cn("flex items-center gap-2", className)} role="status" aria-live="polite">
      <span
        className={cn(
          "inline-block animate-spin rounded-full border-2 border-current border-r-transparent",
          spinnerClass
        )}
      />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
};
