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
import { bancoDeDados } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "@/Componentes/Loading/Index";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/Componentes/Modal/ConfirmarDelete";
import { modalidades } from "@/utils/data"; // Importa as modalidades

const normalizeText = (text) => text.replace(/\D/g, "");

export function Alunos() {
  const alunosBD = collection(bancoDeDados, "alunos");
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlunos = async () => {
      setLoading(true);
      try {
        const q = query(
          alunosBD,
          orderBy("timestamp", "desc"),
          limit(100) // Aumente o limite se necessário, para garantir que todos os alunos sejam carregados
        );
        const data = await getDocs(q);
        const alunosData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAlunos(alunosData);
        setLastVisible(data.docs[data.docs.length - 1]);
        setHasMore(data.docs.length === 4);
      } catch (error) {
        console.error("Erro ao buscar alunos: ", error);
        toast.error("Erro ao buscar alunos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const q = query(
        alunosBD,
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(4)
      );
      const data = await getDocs(q);
      const alunosData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAlunos((prevAlunos) => [...prevAlunos, ...alunosData]);
      setLastVisible(data.docs[data.docs.length - 1]);
      setHasMore(data.docs.length === 4);
    } catch (error) {
      console.error("Erro ao buscar mais alunos: ", error);
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

  const filteredAlunos = alunos.filter((aluno) => {
    const normalizedSearch = normalizeText(search);
    const normalizedCpf = normalizeText(aluno.cpf);
    const normalizedWhatsapp = normalizeText(aluno.whatsapp);

    const searchMatch =
      normalizedCpf.includes(normalizedSearch) ||
      normalizedWhatsapp.includes(normalizedSearch) ||
      aluno.nomeCompleto.toLowerCase().includes(search.toLowerCase());

    const modalidadeMatch = selectedModalidade
      ? aluno.modalidades?.some(
          (modalidade) => modalidade.label === selectedModalidade
        )
      : true;

    return searchMatch && modalidadeMatch;
  });

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} pauseOnHover draggable />
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
        <select value={selectedModalidade} onChange={handleModalidadeChange}>
          <option value="">Todas Modalidades</option>
          {modalidades.map((modalidade) => (
            <option key={modalidade.value} value={modalidade.label}>
              {modalidade.label}
            </option>
          ))}
        </select>
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
                onDelete={() => setSelectedAluno(aluno.id)}
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
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          if (selectedAluno) {
            await deleteDoc(doc(bancoDeDados, "alunos", selectedAluno));
            setAlunos(alunos.filter((aluno) => aluno.id !== selectedAluno));
            toast.success("Aluno excluído com sucesso!");
            setIsModalOpen(false);
            setSelectedAluno(null);
          }
        }}
        message="Você tem certeza que deseja excluir este aluno?"
      />
    </div>
  );
}
