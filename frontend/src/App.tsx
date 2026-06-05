import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReservaEquipamentos from "./pages/ReservaEquipamentos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reserva-equipamentos" element={<ReservaEquipamentos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
