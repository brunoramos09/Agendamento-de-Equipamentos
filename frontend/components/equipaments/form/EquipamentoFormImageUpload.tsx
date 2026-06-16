import { equipmentFileUrl } from "../../../src/services/api";
import type { EquipamentoFormData } from "../../../src/interfaces/equipamentoFormData";
import {
  imageStyle,
  labelStyle,
} from "../../../src/styles/equipamentoFormStyles";

type Props = {
  equipamento: EquipamentoFormData;
  setEquipamento: React.Dispatch<React.SetStateAction<EquipamentoFormData>>;
};

export default function EquipamentoImageUpload({
  equipamento,
  setEquipamento,
}: Props) {
  return (
    <div>
      <label style={labelStyle}>Imagem do Equipamento</label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          padding: "18px",
          border: "1px solid #e5e7eb",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {equipamento.photo ? (
          <img
            src={URL.createObjectURL(equipamento.photo)}
            alt="Preview"
            style={imageStyle}
          />
        ) : equipamento.photoUrl ? (
          <img
            src={equipmentFileUrl(equipamento.photoUrl)}
            alt="Preview"
            style={imageStyle}
          />
        ) : (
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "14px",
              border: "2px dashed #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              background: "#f9fafb",
              flexShrink: 0,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {equipamento.photo
              ? equipamento.photo.name
              : equipamento.photoUrl
                ? equipamento.photoUrl.replace(/^\d+-/, "")
                : "Nenhuma imagem selecionada"}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            {equipamento.photo
              ? `${(equipamento.photo.size / 1024).toFixed(1)} KB`
              : ""}
          </div>

          <label
            style={{
              marginTop: "8px",
              width: "fit-content",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              cursor: "pointer",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {equipamento.photo ? "Trocar imagem" : "Selecionar imagem"}

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  photo: e.target.files?.[0] ?? null,
                })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
