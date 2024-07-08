import React from 'react'
import logo from "@/Complementos/Imagens/logo.png";

export function Cabecalho() {
  return (
    <div className="cabecalho">
      <img className="cabecalho--logo" src={logo} alt="Logo" />
    </div>
  );
}
