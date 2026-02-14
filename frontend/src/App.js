import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UpdatesPage from "./pages/UpdatesPage";
import BuyPage from "./pages/BuyPage";
import SalePage from "./pages/SalePage";
import SupportPage from "./pages/SupportPage";
import FixPage from "./pages/FixPage";
import AccountsPage from "./pages/AccountsPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import Nav from "./components/Nav";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/fix" element={<FixPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;