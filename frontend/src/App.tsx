import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReservaEquipamentos from "./pages/ReservaEquipamentos";
import Equipamentos from "./pages/Equipamentos/Equipamentos";
import Salas from "./pages/Salas/Salas";
import SalasCriar from "./pages/Salas/SalasCriar";
import EquipamentosCriar from "./pages/Equipamentos/EquipamentosCriar";
import EditarSala from "./pages/Salas/SalasEditar";
import EditarEquipamento from "./pages/Equipamentos/EquipamentosEditar";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/reserva-equipamentos"
            element={<ReservaEquipamentos />}
          />
          <Route
            path="/reserva-equipamentos/equipamentos"
            element={<Equipamentos />}
          />
          <Route
            path="/reserva-equipamentos/equipamentos/criar"
            element={<EquipamentosCriar />}
          />
          <Route
            path="/reserva-equipamentos/equipamentos/editar/:id"
            element={<EditarEquipamento />}
          />
          <Route path="/reserva-equipamentos/salas" element={<Salas />} />
          <Route
            path="/reserva-equipamentos/salas/criar"
            element={<SalasCriar />}
          />
          <Route
            path="/reserva-equipamentos/salas/editar/:id"
            element={<EditarSala />}
          />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        richColors
        //expand={true}
        //closeButton
        duration={3000}
        //theme="dark"
        toastOptions={{
          style: {
            //background: "#111",
            //color: "#fff",
            borderRadius: "14px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}

export default App;
