import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// Components
import Dashboard from "./pages/Dashboard";
import Person from "./pages/Person";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/person/:personId" element={<Person />} />
      <Route path="*" element={<h1>Error 404</h1>} />
    </Routes>
  );
}

export default App;
