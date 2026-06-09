import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReservaEquipamentos from "./pages/ReservaEquipamentos";
import Equipamentos from "./pages/Equipamentos";
import Salas from "./pages/Salas";
import SalasCriar from "./pages/SalasCriar";
import EquipamentosCriar from "./pages/EquipamentosCriar";

import { Toaster } from "sonner";

function App() {
  return (
    <>
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
