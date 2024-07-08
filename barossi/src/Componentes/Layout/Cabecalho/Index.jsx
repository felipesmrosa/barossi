import React, { useState } from "react";
import logo from "@/Complementos/Imagens/logo.png";
import { Menu } from "../Menu/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLarge } from "@fortawesome/free-solid-svg-icons";

export function Cabecalho() {
  const [abrirFecharMenu, setAbriFecharMenu] = useState(false);

  const abrirFechar = () => {
    setAbriFecharMenu(!abrirFecharMenu);
  };

  return (
    <header className="cabecalho">
      <div
        className={`cabecalho__menu ${abrirFecharMenu ? "open" : ""}`}
        onClick={abrirFechar}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="cabecalho__logo">
        <img className="cabecalho__logo--logo" src={logo} alt="Logo" />
      </div>
      <div className="cabecalho__user">
        <FontAwesomeIcon icon={faUserLarge} size="lg" />
      </div>
      <Menu isOpen={abrirFecharMenu} abrirFechar={abrirFechar} />
    </header>
  );
}
