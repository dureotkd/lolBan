import React from "react";
import "./assets/default/default.css";
import Main from "./controller/Main/Main";
import Draft from "./controller/Draft/Draft";
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="/draft/:seq/:id" element={<Draft />} />
    </Routes>
  );
}

export default App;
