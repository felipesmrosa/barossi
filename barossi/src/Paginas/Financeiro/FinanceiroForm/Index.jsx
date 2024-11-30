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

export function FinanceiroForm() {
  const [alunosPendentes, setAlunosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlunosPendentes = async () => {
      try {
        // Consultando alunos com status "pendente" ou "atrasado"
        const alunosCollection = collection(bancoDeDados, "alunos");
        const q = query(
          alunosCollection,
          where("mensalidadeStatus", "in", ["pendente", "atrasado"])
        );

        const querySnapshot = await getDocs(q);
        const alunos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlunosPendentes(alunos);
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
    return <p>Carregando...</p>;
  }

  if (alunosPendentes.length === 0) {
    return <p>Nenhum aluno com status pendente ou atrasado.</p>;
  }

  const marcarComoPago = async (alunoId) => {
    try {
      // Referência ao documento do aluno
      const alunoRef = doc(bancoDeDados, "alunos", alunoId);

      // Atualizar o status para "Pago" e o último pagamento para a data atual
      await updateDoc(alunoRef, {
        mensalidadeStatus: "pago",
        ultimoPagamento: new Date().toISOString(), // Formato ISO para armazenar datas
      });

      toast.success("Mensalidade marcada como paga com sucesso!");
    } catch (error) {
      console.error("Erro ao marcar como pago: ", error);
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
        {alunosPendentes.map((aluno) => (
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
              <p className="cardPadrao__card__informacaoPrincipal">
                <strong>Nome:</strong> {aluno.nomeCompleto}
              </p>
              <p className="cardPadrao__card__informacaoAdicional">
                <strong>Status Pagamento:</strong> {aluno.mensalidadeStatus}
              </p>
              <p className="cardPadrao__card__informacaoAdicional">
                <strong>Mensalidade:</strong> R${" "}
                {parseFloat(aluno.mensalidade).toFixed(2)}
              </p>
            </span>
            <button
              onClick={() => marcarComoPago(aluno.id)}
              className="cardPadrao__card__marcarComoPago"
            >
              <FontAwesomeIcon icon={faCheckSquare} size="2xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
