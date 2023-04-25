import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../../../pages/Home";
import "./App.scss";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="*" element={<Navigate replace to="" />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
