import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReservaEquipamentos from "./pages/ReservaEquipamentos";
import Equipamentos from "./pages/Equipamentos";
import Salas from "./pages/Salas";
import SalasCriar from "./pages/SalasCriar";
import EquipamentosCriar from "./pages/EquipamentosCriar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reserva-equipamentos" element={<ReservaEquipamentos />} />
        <Route
          path="/reserva-equipamentos/equipamentos"
          element={<Equipamentos />}
        />
        <Route
          path="/reserva-equipamentos/equipamentos/criar"
          element={<EquipamentosCriar />}
        />
        <Route path="/reserva-equipamentos/salas" element={<Salas />} />
        <Route
          path="/reserva-equipamentos/salas/criar"
          element={<SalasCriar />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
