import { faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function Paginacao({ paginaAtual, paginasTotais, mudarDePagina }) {
  const pages = [];

  for (let i = 1; i <= paginasTotais; i++) {
    pages.push(i);
  }

  return (
    <ul className="paginacao">
      <li className={paginaAtual === 1 ? "close" : ""}>
        <a href="#!" onClick={() => mudarDePagina(paginaAtual - 1)}>
          <FontAwesomeIcon icon={faChevronCircleLeft} />
        </a>
      </li>
      {pages.map((page) => (
        <li key={page} className={paginaAtual === page ? "open" : ""}>
          <a href="#!" onClick={() => mudarDePagina(page)}>
            {page}
          </a>
        </li>
      ))}
      <li className={paginaAtual === paginasTotais ? "close" : ""}>
        <a href="#!" onClick={() => mudarDePagina(paginaAtual + 1)}>
          <FontAwesomeIcon icon={faChevronCircleRight} />
        </a>
      </li>
    </ul>
  );
}
