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
    setTimeout(() => setClickedItem(null), 300); // Remove a classe após a animação
  };

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      const lembrarConta = localStorage.getItem("lembrarme");

      // Se "Lembrar-me" estiver ativado, mantenha os dados no localStorage
      if (!lembrarConta) {
        localStorage.removeItem("emailAutenticado");
        localStorage.removeItem("senhaAutenticada");
      }

      // Redirecionar para a página de login após logout
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
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
          onClick={handleLogout}
          className={clickedItem === 2 ? "clicked" : ""}
        >
          Deslogar
        </li>
      </ul>
    </div>
  );
}
