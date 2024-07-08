import React from "react";

export function Menu({ isOpen, abrirFechar }) {
  return (
    <div className={`menu ${isOpen ? "open" : ""}`}>
      <ul>
        <li onClick={abrirFechar}>Inicio</li>
        <li onClick={abrirFechar}>Alunos</li>
      </ul>
    </div>
  );
}
