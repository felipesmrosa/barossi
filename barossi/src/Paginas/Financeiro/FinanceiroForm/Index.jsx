import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { bancoDeDados } from "@/firebase";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "@/Componentes/Modal/ConfirmarDelete";
import { Loading } from "@/Componentes/Loading/Index";

export function FinanceiroForm() {
  const [alunosPendentes, setAlunosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const navigate = useNavigate();

  // Obtém o mês e o ano atuais
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.toLocaleString("pt-BR", { month: "long" }).toLowerCase(); // "janeiro", "fevereiro"...

  useEffect(() => {
    const fetchAlunosPendentes = async () => {
      try {
        const alunosCollection = collection(bancoDeDados, "alunos");
        const querySnapshot = await getDocs(alunosCollection);
        
        const alunos = querySnapshot.docs
        .map((doc) => {
          const aluno = { id: doc.id, ...doc.data() };
          const mensalidades = aluno.mensalidades || {};
          const statusMesAtual = mensalidades[anoAtual]?.[mesAtual] || "pendente";
          
          // Retorna apenas alunos com mensalidade pendente
          if (statusMesAtual !== "pago") {
            return { ...aluno, statusMesAtual };
          }
          return null;
        })
        .filter(Boolean); // Remove valores nulos
        
        setAlunosPendentes(alunos);
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar alunos pendentes: ", error);
        toast.error("Erro ao buscar alunos pendentes. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunosPendentes();
  }, []);

  if (loading) {
    return Loading;
  }

  // if (alunosPendentes.length === 0) {
  //   return <p>Todos os alunos pagaram a mensalidade deste mês!</p>;
  // }

  const marcarComoPago = async (alunoId, alunoMensalidades) => {
    try {
      const alunoRef = doc(bancoDeDados, "alunos", alunoId);

      // Atualiza a mensalidade do mês atual para "pago"
      const mensalidadesAtualizadas = {
        ...alunoMensalidades,
        [anoAtual]: {
          ...(alunoMensalidades[anoAtual] || {}),
          [mesAtual]: "pago",
        },
      };

      await updateDoc(alunoRef, {
        mensalidades: mensalidadesAtualizadas,
        ultimoPagamento: dataAtual.toISOString(),
      });

      toast.success(`Mensalidade de ${mesAtual} marcada como paga!`);

      // Remove o aluno da lista após marcar como pago
      setAlunosPendentes((prevAlunos) =>
        prevAlunos.filter((aluno) => aluno.id !== alunoId)
      );
    } catch (error) {
      toast.error("Erro ao atualizar o status. Tente novamente.");
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/financeiro")}
        titulo={"Pendentes"}
        botao={"Voltar"}
      />
      <div className="cardPadrao">
        {alunosPendentes.length === 0 ? (
          <p>Todos os alunos pagaram a mensalidade deste mês!</p>
        ) : (
          alunosPendentes.map((aluno) => (
            <div
              key={aluno.id}
              className="cardPadrao__card"
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <span>
                <p style={{ textTransform: "none" }} className="cardPadrao__card__informacaoPrincipal">
                  <strong>Nome:</strong> {aluno.nomeCompleto}
                </p>
                <p className="cardPadrao__card__informacaoAdicional">
                  <strong>Status Pagamento ({mesAtual}):</strong> {aluno.statusMesAtual}
                </p>
                <p className="cardPadrao__card__informacaoAdicional">
                  <strong>Mensalidade:</strong> R${" "}
                  {parseFloat(aluno.mensalidade).toFixed(2)}
                </p>
              </span>
              <button
                onClick={() => {
                  setSelectedAluno(aluno); // Guarda todo o objeto do aluno
                  setIsModalOpen(true);
                }}
                className="cardPadrao__card__marcarComoPago"
              >
                <FontAwesomeIcon icon={faCheckSquare} size="2xl" />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Confirmar pagamento"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (selectedAluno) {
            marcarComoPago(selectedAluno.id, selectedAluno.mensalidades);
            setIsModalOpen(false);
          }
        }}
        message="Você tem certeza que este aluno pagou?"
      />

    </div>
  );
}
