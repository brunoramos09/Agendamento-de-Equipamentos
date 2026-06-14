import type { CSSProperties } from "react";

export const pageContainerStyle: CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "0 16px",
};

export const headerStyle: CSSProperties = {
  marginBottom: "32px",
  paddingBottom: "20px",
  borderBottom: "1px solid #e5e7eb",
};

export const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 700,
  color: "#111827",
};

export const subtitleStyle: CSSProperties = {
  marginTop: "8px",
  color: "#6b7280",
};

export const formGridStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
};

export const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  color: "#374151",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#f9fafb",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "all .2s ease",
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

export const datesGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

export const equipmentHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
  flexWrap: "wrap",
  fontWeight: 600,
  color: "#374151",
};

export const selectedCountStyle: CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
};

export const equipmentListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  maxHeight: "400px",
  overflowY: "auto",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "14px",
  background: "#fafafa",
};

export const emptyListStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "12px",
  background: "#fff",
  color: "#6b7280",
  textAlign: "center",
  border: "1px dashed #d1d5db",
};

export function equipmentCardStyle(selected: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    border: selected ? "2px solid #22c55e" : "1px solid #e5e7eb",
    background: selected ? "#f0fdf4" : "#fff",
    transition: "all .2s ease",
  };
}

export const actionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "12px",
  flexWrap: "wrap",
};

export const cancelButtonStyle: CSSProperties = {
  padding: "12px 20px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

export const submitButtonStyle: CSSProperties = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "12px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "160px",
};
