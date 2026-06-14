import type { CSSProperties } from "react";

export const buttonStyle: CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "9px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

export const paginaBtnStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#374151",
  padding: "7px 12px",
  borderRadius: "9px",
  fontSize: "13px",
  cursor: "pointer",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
};

export const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

export const modalBoxStyle: CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  width: "100%",
  padding: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,.2)",
};
