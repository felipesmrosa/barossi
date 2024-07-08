import React from "react";

export function Titulo({ titulo, botao }) {
  return (
    <div className="titulo">
      <h2> {titulo} </h2>
      <button className="titulo__botao">{botao}</button>
    </div>
  );
}
