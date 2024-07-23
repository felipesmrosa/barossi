import React, { useEffect, useState } from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { BotoesDeAcao } from "@/Componentes/FundoPadrao/BotoesDeAcao/Index";
import { useNavigate } from "react-router-dom";
import { bancoDeDados } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

export function Alunos() {
  const alunosBD = collection(bancoDeDados, "alunos");
  const [alunos, setAlunos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAlunos = async () => {
      const data = await getDocs(alunosBD);
      setAlunos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getAlunos();
  }, []);

  const cadastrarAluno = () => {
    navigate("/aluno/cadastrar");
  };

  return (
    <div className="fundoPadrao">
      <Titulo
        voltarPagina={false}
        click={cadastrarAluno}
        titulo={"Alunos"}
        botao={"Cadastrar"}
      />

      <div className="cardPadrao">
        {alunos.map((aluno) => (
          <div className="cardPadrao__card" key={aluno.id}>
            <b className="cardPadrao__card__informacaoPrincipal">
              {aluno.nomeCompleto} -{" "}
              <b style={{ color: "#24702a" }}>{aluno.cpf}</b>
            </b>
            <p className="cardPadrao__card__informacaoAdicional">
              <FontAwesomeIcon icon={faPhone} /> {aluno.whatsapp}
            </p>
            <BotoesDeAcao />
          </div>
        ))}
      </div>
    </div>
  );
}
