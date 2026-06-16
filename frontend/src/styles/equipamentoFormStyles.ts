import type { CSSProperties } from "react";

export const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontWeight: 700,
  fontSize: "14px",
  color: "#111827",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#f9fafb",
  fontSize: "14px",
  boxSizing: "border-box",
};

export const textAreaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

export const actionsStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "flex-end",
  gap: "14px",
  marginTop: "24px",
  flexWrap: "wrap",
};

export const cancelButton: CSSProperties = {
  padding: "13px 22px",
  border: "1px solid #d1d5db",
  borderRadius: "14px",
  background: "#fff",
  cursor: "pointer",
  minWidth: "140px",
};

export const saveButton: CSSProperties = {
  padding: "13px 28px",
  border: "none",
  borderRadius: "14px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  minWidth: "140px",
};

export const imageStyle: CSSProperties = {
  width: "100%",
  maxWidth: "160px",
  height: "160px",
  objectFit: "cover",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
};
