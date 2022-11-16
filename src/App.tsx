import React, { useState } from "react";
import DeviceLogs from "./pages";
import Login from "./pages/login";
import "./pages/index.css";

function App() {
  const masterPin = "1234";
  const [isLogin, setIsLogin] = useState(false);
  return isLogin ? (
    <DeviceLogs />
  ) : (
    <Login setIsLogin={setIsLogin} masterPin={masterPin} />
  );
}

export default App;
