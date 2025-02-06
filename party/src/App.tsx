import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Router } from "router/Router";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Router />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
