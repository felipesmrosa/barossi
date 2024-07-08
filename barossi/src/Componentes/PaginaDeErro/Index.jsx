import React from "react";
import { useNavigate } from "react-router-dom";

export function PaginaDeErro() {
  const navigate = useNavigate();

  const voltarPagina = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1> PaginaDeErro </h1>
      <button onClick={voltarPagina}>Voltar</button>
    </div>
  );
}
