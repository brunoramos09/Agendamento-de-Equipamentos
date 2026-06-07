import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReservaEquipamentos from "./pages/ReservaEquipamentos";
import Equipamentos from "./pages/Equipamentos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reserva-equipamentos" element={<ReservaEquipamentos />} />
        <Route
          path="/reserva-equipamentos/equipamentos"
          element={<Equipamentos />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
