import { useState } from "react";
import type { ReactNode } from "react";

import {
  iconButtonStyle,
  iconButtonVariants,
} from "../../src/styles/iconButtonStyles";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "report";

type Props = {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: Variant;
};

export default function IconActionButton({
  icon,
  title,
  onClick,
  disabled = false,
  variant = "default",
}: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...iconButtonStyle,
          ...iconButtonVariants[variant],
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {icon}
      </button>

      {hover && !disabled && (
        <div
          style={{
            position: "absolute",
            bottom: "120%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111827",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 25px rgba(0,0,0,.2)",
            zIndex: 9999,
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
