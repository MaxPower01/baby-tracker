import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Navigate replace to="/home" />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
        {/* <Route path="/home" element={<Home />} />
        <Route path="/arcade" element={<Arcade />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
