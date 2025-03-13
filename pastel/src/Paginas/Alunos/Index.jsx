import React, { useEffect, useState } from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faPhone,
  faSkullCrossbones,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { BotoesDeAcao } from "@/Componentes/FundoPadrao/BotoesDeAcao/Index";
import { useNavigate } from "react-router-dom";
import { bancoDeDados } from "@/firebase.js";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
  query,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "@/Componentes/Loading/Index";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/Componentes/Modal/ConfirmarDelete";

export function Alunos() {
  const alunosBD = collection(bancoDeDados, "alunos");
  const [alunos, setAlunos] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      try {
        const q = query(alunosBD, orderBy("timestamp", "desc"), limit(1000));
        const data = await getDocs(q);
        const alunosData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAlunos(alunosData);
        setLastVisible(data.docs[data.docs.length - 1]);
        setHasMore(data.docs.length === 3);
      } catch (error) {
        console.error("Erro ao buscar alunos: ", error);
        toast.error("Erro ao buscar alunos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    const fetchModalidades = async () => {
      try {
        const docRef = doc(
          bancoDeDados,
          "tabelavirtual",
          "V1g0AZ0EV0ZjLwViOYWb"
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setModalidades(data.itens);
        } else {
          console.error("Documento não encontrado!");
        }
      } catch (error) {
        toast.error("Erro ao buscar modalidades");
      }
    };

    fetchAlunos();
    fetchModalidades();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const q = query(
        alunosBD,
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(3)
      );
      const data = await getDocs(q);
      const alunosData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAlunos((prevAlunos) => [...prevAlunos, ...alunosData]);
      setLastVisible(data.docs[data.docs.length - 1]);
      setHasMore(data.docs.length === 3);
    } catch (error) {
      toast.error("Erro ao buscar mais alunos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleModalidadeChange = (e) => {
    setSelectedModalidade(e.target.value);
  };

  const normalizeText = (text) => text.replace(/\s+/g, "").toLowerCase();
  const removeMask = (text) => text.replace(/[^\d]/g, "");

  const filteredAlunos = alunos.filter((aluno) => {
    const normalizedSearch = normalizeText(search);
    const normalizedCpf = removeMask(aluno.cpf || "");
    const normalizedWhatsapp = removeMask(aluno.whatsapp || "");
    const normalizedNomeCompleto = normalizeText(aluno.nomeCompleto || "");

    // Verificar se a pesquisa corresponde ao CPF, WhatsApp ou Nome
    const searchMatch =
      normalizedCpf.includes(normalizedSearch) ||
      normalizedWhatsapp.includes(normalizedSearch) ||
      normalizedNomeCompleto.includes(normalizedSearch);

    // Verificação de modalidades: filtrar com base na seleção do usuário
    const modalidadeMatch = selectedModalidade
      ? aluno.modalidades?.some(
        (modalidade) => normalizeText(modalidade.label) === normalizeText(selectedModalidade)
      )
      : true;

    // Obter a role do localStorage e verificar se ela corresponde à condição
    const userRole = localStorage.getItem("role");
    const roleMatch = userRole
      ? aluno.modalidades?.some((modalidade) => {
        // Verifica se a role do usuário corresponde a uma modalidade do aluno
        switch (userRole) {
          case "admin":
            return true; // Admin pode ver todos os alunos
          case "karate":
            return ["2x Karatê", "3x Karatê"].includes(modalidade.label);
          case "pilates":
            return ["2x Pilates", "3x Pilates"].includes(modalidade.label);
          case "taekwondo":
            return ["Taekwondo"].includes(modalidade.label);
          case "ginastica":
            return ["Ginastica Ritmica"].includes(modalidade.label);
          case "jiujitsu":
            return ["Jiu Jítsu"].includes(modalidade.label);
          case "boxechines":
            return ["Boxe Chinês"].includes(modalidade.label);
          default:
            return false; // Caso a role não corresponda a nenhuma das modalidades
        }
      })
      : true;

    // Retornar os alunos que atendem a todos os critérios de busca, modalidades e role
    return searchMatch && modalidadeMatch && roleMatch;
  });


  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(bancoDeDados, "alunos", id));
      setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno.id !== id));
      toast.success("Aluno excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir aluno: ", error);
      toast.error("Erro ao excluir aluno. Tente novamente.");
    } finally {
      setIsModalOpen(false);
      setSelectedAluno(null);
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={false}
        click={() => navigate("/aluno/cadastrar")}
        titulo={"Alunos"}
        botao={"Cadastrar"}
      />

      <div className="filtro">
        <label htmlFor="pesquisar">Filtro</label>
        <input
          type="text"
          placeholder="Pesquisar por CPF, Telefone ou Nome"
          value={search}
          onChange={handleSearchChange}
          id="pesquisar"
        />
        {userRole === "admin" && (
          <select value={selectedModalidade} onChange={handleModalidadeChange}>
            <option value="">Todas Modalidades</option>
            {modalidades.map((modalidade) => (
              <option key={modalidade.id} value={modalidade.nome}>
                {modalidade.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="cardPadrao">
        {loading && alunos.length === 0 ? (
          <Loading />
        ) : filteredAlunos.length === 0 ? (
          <p>Não há nenhum aluno cadastrado com esses critérios.</p>
        ) : (
          filteredAlunos.map((aluno) => (
            <div className="cardPadrao__card" key={aluno.id}>
              <b className="cardPadrao__card__informacaoPrincipal">
                {aluno.nomeCompleto} -{" "}
                <b style={{ color: "#24702a" }}>{aluno.cpf}</b>
              </b>
              {aluno.responsavel && (
                <p className="cardPadrao__card__informacaoAdicional">
                  <FontAwesomeIcon icon={faUser} /> {aluno.responsavel}
                </p>
              )}
              <p className="cardPadrao__card__informacaoAdicional">
                <FontAwesomeIcon icon={faPhone} /> {aluno.whatsapp}
              </p>
              <p className="cardPadrao__card__informacaoAdicional">
                <FontAwesomeIcon icon={faMoneyBill} /> R$ {aluno.mensalidade}
              </p>
              {aluno.modalidades && aluno.modalidades.length > 0 && (
                <>
                  {aluno.modalidades.map((modalidade, index) => (
                    <p
                      className="cardPadrao__card__informacaoAdicional"
                      key={index}
                    >
                      <FontAwesomeIcon icon={faSkullCrossbones} />{" "}
                      {modalidade.label}
                    </p>
                  ))}
                </>
              )}
              <BotoesDeAcao
                onEdit={() => navigate(`/aluno/editar/${aluno.id}`)}
                onDelete={() => {
                  setSelectedAluno(aluno.id);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="fundoPadrao__carregarMais"
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      )}

      <Modal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedAluno && handleDelete(selectedAluno)}
        message="Você tem certeza que deseja excluir este aluno?"
      />
    </div>
  );
}
