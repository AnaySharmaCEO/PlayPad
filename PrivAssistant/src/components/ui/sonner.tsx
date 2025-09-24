"use client";

import { useTheme } from "../../context/ThemeContext";
import { Toaster as Sonner } from "sonner@2.0.3";

interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  hotkey?: string[];
  theme?: 'light' | 'dark' | 'system';
  richColors?: boolean;
  expand?: boolean;
  duration?: number;
  gap?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  toastOptions?: any;
  className?: string;
  style?: React.CSSProperties;
  offset?: string | number;
  dir?: 'rtl' | 'ltr' | 'auto';
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
