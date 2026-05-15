import "./index.css";
import React from "react";
import { Outlet } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import CookieConsentBanner from "./components/privacy/CookieConsentBanner";

const App = () => {
  return (
    <div
      className="min-h-screen relative page-force-light"
      style={{ minHeight: "100vh", height: "auto" }}
    >
      <div className="relative z-10">
        <Outlet />
      </div>
      <Chatbot />
      <CookieConsentBanner />
    </div>
  );
};

export default App;
