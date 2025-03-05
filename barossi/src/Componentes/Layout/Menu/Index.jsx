import React from "react";

import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Menu() {
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState(null);

  const redirecionador = (path, index) => {
    navigate(path);
    setClickedItem(index);
    setTimeout(() => setClickedItem(null), 300);
  };

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      const lembrarConta = localStorage.getItem("lembrarme");

      if (!lembrarConta) {
        localStorage.removeItem("emailAutenticado");
        localStorage.removeItem("senhaAutenticada");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar__links">
        <li
          onClick={() => redirecionador("/dashboard", 0)}
          className={clickedItem === 0 ? "active" : ""}
        >
          Início
        </li>
        <li
          onClick={() => redirecionador("/alunos", 1)}
          className={clickedItem === 1 ? "active" : ""}
        >
          Alunos
        </li>
        <li
          onClick={() => redirecionador("/financeiro", 2)}
          className={clickedItem === 2 ? "active" : ""}
        >
          Financeiro
        </li>
        <li
          onClick={() => redirecionador("/tabela-virtual", 3)}
          className={clickedItem === 3 ? "active" : ""}
        >
          Tabela Virtual
        </li>
        <li onClick={handleLogout} className="logout">
          Deslogar
        </li>
      </ul>
    </aside>
  );
}
