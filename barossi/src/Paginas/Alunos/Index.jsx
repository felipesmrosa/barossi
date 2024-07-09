import React from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { BotoesDeAcao } from "@/Componentes/FundoPadrao/BotoesDeAcao/Index";

const alunos = [
  {
    id: 1,
    aluno: "Guilherme Barossi",
    cpf: "012.345.678-90",
    telefone: "(99) 99999-9999",
    data_matricula: "08/07/2024",
    ativo: true,
  },
  {
    id: 2,
    aluno: "Felipe Miranda",
    cpf: "018.850.270.01",
    telefone: "(47) 99142-4212",
    data_matricula: "17/02/2022",
    ativo: true,
  },
];

export function Alunos() {
  return (
    <div className="fundoPadrao">
      <Titulo titulo={"Alunos"} botao={"Cadastrar"} />

      <div className="cardPadrao">
        {alunos.map((aluno) => (
          <div className="cardPadrao__card" key={aluno.id}>
            <b className="cardPadrao__card__informacaoPrincipal">
              {aluno.aluno} - <b style={{ color: "#24702a" }}>{aluno.cpf}</b>
            </b>
            <p className="cardPadrao__card__informacaoAdicional">
              <FontAwesomeIcon icon={faPhone} /> {aluno.telefone}
            </p>
            <BotoesDeAcao />
          </div>
        ))}
      </div>
    </div>
  );
}
