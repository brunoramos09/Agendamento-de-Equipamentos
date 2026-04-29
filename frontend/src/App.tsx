import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListaEquipamentos from "./equipaments/pages/Listar";
import CadastrarEquipamento from "./equipaments/pages/Cadastrar";
import EditarEquipamento from "./equipaments/pages/Editar";
import ExcluirEquipamento from "./equipaments/pages/Excluir";
import CadastrarReserva from "./reservations/pages/Cadastrar";
import ListaReservas from "./reservations/pages/Listar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/equipamentos" />} />
        // Equipamentos
        <Route path="/equipamentos" element={<ListaEquipamentos />} />
        <Route
          path="/equipamentos/cadastrar"
          element={<CadastrarEquipamento />}
        />
        <Route
          path="/equipamentos/editar/:id"
          element={<EditarEquipamento />}
        />
        <Route
          path="/equipamentos/excluir/:id"
          element={<ExcluirEquipamento />}
        />
        // Reservas
        <Route path="/reservas/cadastrar" element={<CadastrarReserva />} />
        <Route path="/reservas" element={<ListaReservas />} />
      </Routes>
    </BrowserRouter>
  );
}
