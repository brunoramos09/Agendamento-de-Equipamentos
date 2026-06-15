import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function entrarComoAdmin() {
    localStorage.setItem("role", "ADMIN");

    navigate("/reserva-equipamentos");

    setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  function entrarComoUsuario() {
    localStorage.setItem("role", "USER");

    navigate("/reserva-equipamentos");

    setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: "12px",
            fontSize: "28px",
          }}
        >
          Reserva de Equipamentos
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "32px",
          }}
        >
          Selecione o perfil para acessar o sistema
        </p>

        <button
          onClick={entrarComoUsuario}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          Entrar como Usuário Padrão
        </button>

        <button
          onClick={entrarComoAdmin}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#111827",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Entrar como Administrador
        </button>
      </div>
    </div>
  );
}
