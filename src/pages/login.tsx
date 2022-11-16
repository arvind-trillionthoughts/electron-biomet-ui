import React, { useState } from "react";

export default function Login({ setIsLogin, masterPin }: any) {
  const [pin, setPin] = useState("");
  return (
    <>
      <div
        className="bg-primary"
        style={{ textAlign: "start", padding: "1rem", height: "5vh" }}
      >
        <h1 style={{ fontSize: "1.5rem" }} className="text-white">
          Biomet UpLink Server
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          height: "80vh",
        }}
      >
        <h2>Login</h2>
        <p>Please enter pin to continue.</p>
        <input
          placeholder="Enter pin"
          className="input-style"
          type="password"
          onChange={(e) => {
            setPin(e.target.value);
          }}
        />
        <button
          className="button-submit"
          onClick={() => {
            if (pin === masterPin) {
              setIsLogin(true);
            }
          }}
        >
          Login
        </button>
      </div>
    </>
  );
}
