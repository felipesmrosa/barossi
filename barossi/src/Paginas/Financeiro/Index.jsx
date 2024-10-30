import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { bancoDeDados } from "@/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const buscarAlunosPorModalidade = async () => {
  const modalidades = {}; // Objeto para armazenar modalidades e alunos
  try {
    const snapshot = await getDocs(collection(bancoDeDados, "alunos"));
    snapshot.forEach((doc) => {
      const aluno = doc.data();

      // Itera sobre as modalidades do aluno
      aluno.modalidades.forEach((modalidade) => {
        const nomeModalidade = modalidade.label; // Acesso ao nome da modalidade
        const valorModalidade = Number(modalidade.value); // Acesso ao valor da modalidade (como número)

        // Verifica se a modalidade já existe no objeto
        if (!modalidades[nomeModalidade]) {
          modalidades[nomeModalidade] = {
            nome: nomeModalidade,
            preco: valorModalidade,
            alunos: [],
          };
        }
        // Adiciona o nome completo do aluno à lista de alunos da modalidade
        modalidades[nomeModalidade].alunos.push(aluno.nomeCompleto);
      });
    });

    // Atualiza o preço total com base no número de alunos
    Object.values(modalidades).forEach((modalidade) => {
      modalidade.totalAlunos = modalidade.alunos.length; // Conta os alunos
      modalidade.precoTotal = modalidade.totalAlunos * modalidade.preco; // Calcula o preço total
    });

    return Object.values(modalidades); // Retorna como array para facilitar o uso no React
  } catch (error) {
    console.error("Erro ao buscar alunos: ", error);
    return [];
  }
};

export function Financeiro() {
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(null);
  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await buscarAlunosPorModalidade();
      setModalidades(data);
    };
    fetchData();
  }, []);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/aluno/cadastrar")}
        titulo={"Financeiro"}
        botao={"Controlar"}
      />

      <div className="modalidades">
        {modalidades.map((modalidade, index) => (
          <div key={index} className="modalidades__modalidade">
            <h4
              className="modalidades__modalidade--title"
              onClick={() => toggleOpen(index)}
            >
              {modalidade.nome} | R$ {modalidade.precoTotal}
              <FontAwesomeIcon
                size="lg"
                icon={openIndex === index ? faChevronUp : faChevronDown}
              />
            </h4>
            <div
              className={`modalidades__modalidade__content ${
                openIndex === index ? "open" : ""
              }`}
              style={{
                maxHeight: openIndex === index ? "100vh" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              {modalidade.alunos.map((aluno, alunoIndex) => (
                <div key={alunoIndex} className="modalidades__aluno">
                  <p>• {aluno}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
