import React from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";

const alunos = [
  {
    id: 1,
    aluno: "Guilherme Barossi",
    cpf: "012.345.678-90",
    telefone: "(99) 99999-9999",
    data_matricula: "08/07/2024",
    ativo: true,
  },
];

export function Alunos() {
  return (
    <div className="fundoPadrao">
      <Titulo titulo={"Alunos"} botao={"Cadastrar"} />

      {alunos.map((aluno) => (
        // <Card />

        <div className="cardPadrao" key={aluno.id}>
          <b>{aluno.aluno} - <b style={{color: "#24702a"}}>{aluno.cpf}</b></b>
        </div>
      ))}
    </div>
  );
}
