import React from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  const logar = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1> Login </h1>
      <button onClick={logar}>Dashboard</button>
    </div>
  );
}
