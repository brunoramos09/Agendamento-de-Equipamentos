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

export const modalStyle: CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "650px",
  maxHeight: "85vh",
  overflowY: "auto",
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
};

export const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "150px 1fr",
  gap: "10px 14px",
  fontSize: "14px",
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
