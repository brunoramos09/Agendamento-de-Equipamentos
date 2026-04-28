import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListaEquipamentos from "./equipaments/pages/Listar";
import CadastrarEquipamento from "./equipaments/pages/Cadastrar";
import EditarEquipamento from "./equipaments/pages/Editar";
import ExcluirEquipamento from "./equipaments/pages/Excluir";

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
      </Routes>
    </BrowserRouter>
  );
}
