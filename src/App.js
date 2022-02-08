import React from "react";

import { Routes, Route, HashRouter } from "react-router-dom";

import Landing from "./pages/Landing";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div>
      <div className="gradient-bg-welcome w-full min-h-screen">
        <HashRouter>
          {/* <Header /> */}
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;
