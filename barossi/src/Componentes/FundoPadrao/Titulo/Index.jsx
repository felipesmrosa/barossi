import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Titulo({ titulo, botao, click, voltarPagina }) {
  const navigate = useNavigate();

  const voltar = () => {
    navigate("/alunos");
  };

  return (
    <div className="titulo">
      <div className="titulo__tituloEIcone">
        {voltarPagina ? (
          <FontAwesomeIcon size="lg" onClick={voltar} icon={faLeftLong} />
        ) : null}
        <h2>{titulo}</h2>
      </div>
      <button onClick={click} className="titulo__botao">
        {botao}
      </button>
    </div>
  );
}
