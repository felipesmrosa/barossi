import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Menu({ isOpen, abrirFechar }) {
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState(null);

  const redirecionador = (path, index) => {
    abrirFechar();
    navigate(path);
    setClickedItem(index);
    setTimeout(() => setClickedItem(null), 300); // Remove a classe após a animação
  };

  return (
    <div className={`menu ${isOpen ? "open" : ""}`}>
      <ul>
        <li
          onClick={() => redirecionador("/dashboard", 0)}
          className={clickedItem === 0 ? "clicked" : ""}
        >
          Inicio
        </li>
        <li
          onClick={() => redirecionador("/alunos", 1)}
          className={clickedItem === 1 ? "clicked" : ""}
        >
          Alunos
        </li>
        <li
          onClick={() => redirecionador("/alunos", 2)}
          className={clickedItem === 2 ? "clicked" : ""}
        >
          Paga Ohana aí
        </li>
      </ul>
    </div>
  );
}
