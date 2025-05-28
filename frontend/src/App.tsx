import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import SimulationA from "./routes/SimulationA.tsx";
import SimulationB from "./routes/SimulationB.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation-a" element={<SimulationA />} />
        <Route path="/simulation-b" element={<SimulationB />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
