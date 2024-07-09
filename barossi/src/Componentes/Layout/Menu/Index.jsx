import React from "react";
import { useNavigate } from "react-router-dom";

export function Menu({ isOpen, abrirFechar }) {
  const navigate = useNavigate();

  const redirecionador = (path) => {
    abrirFechar();
    navigate(path);
  };

  return (
    <div className={`menu ${isOpen ? "open" : ""}`}>
      <ul>
        <li onClick={() => redirecionador('/dashboard')}>Inicio</li>
        <li onClick={() => redirecionador('/alunos')}>Alunos</li>
        <li onClick={() => redirecionador('/alunos')}>Paga Ohana aí</li>
      </ul>
    </div>
  );
}
