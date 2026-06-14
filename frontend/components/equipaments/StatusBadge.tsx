import {
  getStatusStyle,
  statusLabels,
} from "../../src/utils/equipamentosUtils";

type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const { bg, color } = getStatusStyle(status);

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 800,
        background: bg,
        color,
      }}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
