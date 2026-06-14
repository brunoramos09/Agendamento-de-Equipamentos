import {
  headerStyle,
  subtitleStyle,
  titleStyle,
} from "../../src/styles/criarReservaStyles";

export default function CriarReservaHeader() {
  return (
    <div style={headerStyle}>
      <h2 style={titleStyle}>Nova Reserva</h2>

      <p style={subtitleStyle}>
        Preencha os dados abaixo para criar uma nova reserva.
      </p>
    </div>
  );
}
