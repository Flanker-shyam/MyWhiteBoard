import React from "react";
import Home from "./pages/home";
import WhiteBoard from "./pages/whiteBoard";
import WhiteBoardSessionPage from "./pages/whiteBoardSessionPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./pages/test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whiteBoard" element={<WhiteBoardSessionPage />} />
        <Route path="/whiteboard/:sessionId" element={<WhiteBoard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
