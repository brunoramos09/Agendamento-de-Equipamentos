import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListaEquipamentos from "./equipaments/pages/Listar";
import CadastrarEquipamento from "./equipaments/pages/Cadastrar";
import EditarEquipamento from "./equipaments/pages/Editar";
import ExcluirEquipamento from "./equipaments/pages/Excluir";
import CadastrarReserva from "./reservations/pages/Cadastrar";
import ListaReservas from "./reservations/pages/Listar";
import ListarSalas from "./rooms/pages/Listar";
import CadastrarSala from "./rooms/pages/Cadastrar";
import EditarSala from "./rooms/pages/Editar";
import ExcluirSala from "./rooms/pages/Excluir";

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
        <Route path="/reservas" element={<ListaReservas />} />
        <Route path="/reservas/cadastrar" element={<CadastrarReserva />} />
        // Salas
        <Route path="/salas" element={<ListarSalas />} />
        <Route path="/salas/cadastrar" element={<CadastrarSala />} />
        <Route path="/salas/editar/:id" element={<EditarSala />} />
        <Route path="/salas/excluir/:id" element={<ExcluirSala />} />
      </Routes>
    </BrowserRouter>
  );
}
