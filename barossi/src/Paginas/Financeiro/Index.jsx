import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { bancoDeDados } from "@/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { Loading } from "@/Componentes/Loading/Index";

const buscarAlunosPorModalidade = async () => {
  const modalidades = {};
  try {
    const snapshot = await getDocs(collection(bancoDeDados, "alunos"));
    snapshot.forEach((doc) => {
      const aluno = doc.data();
      aluno.modalidades.forEach((modalidade) => {
        const nomeModalidade = modalidade.label;
        const valorModalidade = Number(modalidade.value);
        if (!modalidades[nomeModalidade]) {
          modalidades[nomeModalidade] = {
            nome: nomeModalidade,
            preco: valorModalidade,
            alunos: [],
          };
        }
        modalidades[nomeModalidade].alunos.push(aluno.nomeCompleto);
      });
    });

    Object.values(modalidades).forEach((modalidade) => {
      modalidade.totalAlunos = modalidade.alunos.length;
      modalidade.precoTotal = modalidade.totalAlunos * modalidade.preco;
    });

    return Object.values(modalidades);
  } catch (error) {
    console.error("Erro ao buscar alunos: ", error);
    return [];
  }
};

export function Financeiro() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [modalidades, setModalidades] = useState([]);
  const [precoGeral, setPrecoGeral] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await buscarAlunosPorModalidade();
      setModalidades(data);
      const total = data.reduce(
        (acc, modalidade) => acc + modalidade.precoTotal,
        0
      );
      setPrecoGeral(total);
      setLoading(false);
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

      {loading ? (
        <Loading />
      ) : (
        <div className="modalidades">
          {modalidades.map((modalidade, index) => (
            <div key={index} className="modalidades__modalidade">
              <h4
                className="modalidades__modalidade--title"
                onClick={() => toggleOpen(index)}
              >
                {modalidade.nome} | R$ {modalidade.precoTotal.toFixed(2)}
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
          <div className="precoGeral">
            <h4>Preço Geral: R$ {precoGeral.toFixed(2)}</h4>
          </div>
        </div>
      )}
    </div>
  );
}
