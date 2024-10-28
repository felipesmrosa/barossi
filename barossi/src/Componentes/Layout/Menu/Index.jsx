import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Menu({ isOpen, abrirFechar }) {
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState(null);

  const redirecionador = (path, index) => {
    abrirFechar();
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
    <div className={`menu ${isOpen ? "open" : ""}`}>
      <div className="links">
        <ul className="links__lista">
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
            onClick={() => redirecionador("/financeiro", 2)}
            className={clickedItem === 2 ? "clicked" : ""}
          >
            Financeiro
          </li>
          <li
            onClick={() => redirecionador("/tabela-virtual", 3)}
            className={clickedItem === 3 ? "clicked" : ""}
          >
            Tabela Virtual
          </li>
          <li
            onClick={handleLogout}
            className={clickedItem === 4 ? "clicked" : ""}
          >
            Deslogar
          </li>
        </ul>
      </div>
    </div>
  );
}
