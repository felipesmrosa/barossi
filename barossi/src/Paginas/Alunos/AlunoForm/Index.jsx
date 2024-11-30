import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import InputMask from "react-input-mask";
import { NumberFormatBase } from "react-number-format";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { customStyles, maiorDeIdadeData } from "@/utils/data";
import { validarCPF } from "@/utils/validaCPF";
import { bancoDeDados } from "@/firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FormInputCard } from "@/Componentes/FundoPadrao/FormInputCard/Index";

export function AlunoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [mensalidade, setMensalidade] = useState("");
  const [desconto, setDesconto] = useState("");
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    responsavel: "",
    whatsapp: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    complemento: "",
  });
  const [maiorDeIdade, setMaiorDeIdade] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [modalidades, setModalidades] = useState([]);

  useEffect(() => {
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
          const items = data.itens || []; // Supondo que 'itens' seja o array no documento

          const options = items.map((item) => ({
            value: item.valor,
            label: item.nome,
          }));

          setModalidades(options);
        } else {
          console.log("Documento não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchModalidades();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchAluno = async () => {
        const alunoDoc = doc(bancoDeDados, "alunos", id);
        const alunoSnap = await getDoc(alunoDoc);
        const alunoData = alunoSnap.data();
        setFormData({
          nomeCompleto: alunoData.nomeCompleto,
          whatsapp: alunoData.whatsapp,
          responsavel: alunoData.responsavel || "",
          cep: alunoData.cep,
          endereco: alunoData.endereco,
          numero: alunoData.numero,
          bairro: alunoData.bairro,
          cidade: alunoData.cidade,
          complemento: alunoData.complemento,
        });
        setCpf(alunoData.cpf);
        setSelectedModalidades(alunoData.modalidades || []);
        setMensalidade(alunoData.mensalidade || "");
        setDesconto(alunoData.desconto || "");
        setMaiorDeIdade(alunoData.maiorDeIdade ?? true);
        setIsDataLoaded(true);
      };

      fetchAluno();
    } else {
      setIsDataLoaded(true); // Para garantir que o cálculo da mensalidade funcione durante o cadastro
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isDataLoaded) {
      atualizarMensalidade();
    }
  }, [selectedModalidades, desconto, isDataLoaded]);

  const atualizarMensalidade = () => {
    const totalMensalidade = calcularTotalMensalidade();
    const valorComDesconto = aplicarDesconto(totalMensalidade);
    setMensalidade(valorComDesconto >= 0 ? valorComDesconto : 0);
  };

  const calcularTotalMensalidade = () => {
    return selectedModalidades.reduce((total, option) => {
      const modalidade = modalidades.find((m) => m.value === option.value);
      return total + (modalidade ? parseFloat(modalidade.value) : 0);
    }, 0);
  };

  const aplicarDesconto = (total) => {
    const descontoValor = desconto ? parseFloat(desconto) / 100 : 0;
    return total * (1 - descontoValor);
  };

  const handleCpfChange = (event) => {
    const newCpf = event.target.value;
    setCpf(newCpf);
    const cpfValido = validarCPF(newCpf);
    setCpfError(cpfValido ? "" : "CPF inválido");
  };

  const handleModalidadeChange = (selectedOptions) => {
    setSelectedModalidades(selectedOptions);
    if (isDataLoaded) {
      atualizarMensalidade();
    }
  };

  const handleMaiorDeIdadeChange = (selectedOption) => {
    const value = selectedOption?.value === "sim";
    setMaiorDeIdade(value);
    if (value) {
      setFormData((prevData) => ({ ...prevData, responsavel: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const cepFormatado = cep.replace(/\D/g, "");
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepFormatado}/json/`
      );
      if (response.data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      const { logradouro, bairro, localidade, complemento } = response.data;
      setFormData((prevData) => ({
        ...prevData,
        endereco: logradouro || "",
        bairro: bairro || "",
        cidade: localidade || "",
        complemento: complemento || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar endereço: ", error);
      toast.error("Erro ao buscar endereço. Tente novamente.");
    }
  };

  const handleCepChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, cep: value });
    if (value.replace(/\D/g, "").length === 8) {
      buscarEnderecoPorCep(value);
    }
  };

  const labelMapping = {
    nomeCompleto: "Nome completo",
    cpf: "CPF",
    responsavel: "Responsável",
    whatsapp: "Whatsapp",
    cep: "CEP",
    endereco: "Endereço",
    numero: "Número",
    bairro: "Bairro",
    cidade: "Cidade",
    complemento: "Complemento",
  };

  const validarCampos = () => {
    const camposObrigatorios = [
      "nomeCompleto",
      "whatsapp",
      "cep",
      "endereco",
      "numero",
      "bairro",
      "cidade",
      "complemento",
    ];

    for (let campo of camposObrigatorios) {
      if (!formData[campo]) {
        toast.error(`O campo ${labelMapping[campo]} é obrigatório`);
        return false;
      }
    }

    if (!cpf || !validarCPF(cpf)) {
      toast.error("CPF inválido ou não preenchido");
      return false;
    }

    if (!selectedModalidades.length) {
      toast.error("Selecione pelo menos uma modalidade");
      return false;
    }

    if (mensalidade === undefined || mensalidade === null) {
      toast.error("O campo mensalidade é obrigatório");
      return false;
    }

    if (!maiorDeIdade && !formData.responsavel) {
      toast.error("O campo responsável é obrigatório para menores de idade");
      return false;
    }

    return true;
  };

  const verificarCpfRepetido = async () => {
    const q = query(
      collection(bancoDeDados, "alunos"),
      where("cpf", "==", cpf)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const cadastrarAluno = async () => {
    if (!validarCampos()) return;

    const cpfRepetido = await verificarCpfRepetido();
    if (cpfRepetido) {
      toast.error("CPF já cadastrado");
      return;
    }

    const alunoData = {
      ...formData,
      cpf,
      modalidades: selectedModalidades,
      mensalidade,
      maiorDeIdade,
      mensalidadeStatus: "pendente", // Status inicial
      ultimoPagamento: null, // Nenhum pagamento registrado
      timestamp: new Date(), // Adiciona o timestamp atual
    };

    try {
      const alunosCollection = collection(bancoDeDados, "alunos");
      await addDoc(alunosCollection, alunoData);
      toast.success("Aluno cadastrado com sucesso!");

      setCpf("");
      setCpfError("");
      setSelectedModalidades([]);
      setMensalidade("");
      setDesconto("");
      setFormData({
        nomeCompleto: "",
        responsavel: "",
        whatsapp: "",
        cep: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        complemento: "",
      });
      setMaiorDeIdade(true); // Ajuste para definir como verdadeiro ao cadastrar um novo aluno
    } catch (error) {
      console.error("Erro ao cadastrar aluno: ", error);
      toast.error("Erro ao cadastrar aluno. Tente novamente.");
    }
  };

  const editarAluno = async () => {
    if (!validarCampos()) return;

    const alunoData = {
      ...formData,
      cpf,
      modalidades: selectedModalidades,
      mensalidade,
      desconto,
      maiorDeIdade,
      mensalidadeStatus: "pendente", // Opcional, caso queira atualizar no modo de edição
      ultimoPagamento: null, // Opcional, caso queira atualizar no modo de edição
    };

    try {
      const alunoDocRef = doc(bancoDeDados, "alunos", id);
      await updateDoc(alunoDocRef, alunoData);
      toast.success("Aluno atualizado com sucesso!");
      navigate("/listagem");
    } catch (error) {
      console.error("Erro ao atualizar aluno: ", error);
      toast.error("Erro ao atualizar aluno. Tente novamente.");
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} />
      <Titulo
        voltarPagina={true}
        link={"/alunos"}
        titulo={isEditMode ? "Editar aluno" : "Novo aluno"}
        botao={isEditMode ? "Atualizar" : "Cadastrar"}
        click={isEditMode ? editarAluno : cadastrarAluno}
      />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <FormInputCard
              label="Nome completo"
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
            />
            <FormInputCard
              label="CPF"
              type="text"
              component={
                <InputMask
                  mask="999.999.999-99"
                  value={cpf}
                  onChange={handleCpfChange}
                >
                  {(inputProps) => <input type="text" {...inputProps} />}
                </InputMask>
              }
              error={cpfError}
            />
            <FormInputCard
              label="Maior de idade?"
              component={
                <Select
                  options={maiorDeIdadeData}
                  value={maiorDeIdadeData.find(
                    (option) => option.value === (maiorDeIdade ? "sim" : "nao")
                  )}
                  onChange={handleMaiorDeIdadeChange}
                  styles={customStyles}
                />
              }
            />

            {!maiorDeIdade && (
              <FormInputCard
                label="Responsável"
                type="text"
                id="responsavel"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleInputChange}
                disabled={maiorDeIdade}
              />
            )}
            <FormInputCard
              label="Whatsapp"
              type="text"
              name="whatsapp"
              component={
                <InputMask
                  mask="(99) 9 9999-9999"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  name="whatsapp"
                />
              }
            />
            <FormInputCard
              label="Modalidade"
              component={
                <Select
                  styles={customStyles}
                  isMulti
                  name="modalidades"
                  options={modalidades}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Selecione a(s) modalidade(s)"
                  onChange={handleModalidadeChange}
                  value={selectedModalidades}
                />
              }
            />
            <FormInputCard
              label="Mensalidade"
              component={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={mensalidadeLabelStyle}>R$</div>
                  <NumberFormatBase
                    value={mensalidade}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    onValueChange={(values) => {
                      const { value } = values;
                      setMensalidade(value);
                    }}
                    style={mensalidadeInputStyle}
                  />
                </div>
              }
            />

            <EnderecoForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleCepChange={handleCepChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares

const EnderecoForm = ({ formData, handleInputChange, handleCepChange }) => (
  <>
    <div id="separacao" className="cardPadrao__card__formulario--titulo">
      <p>Endereço</p>
    </div>
    <FormInputCard
      label="CEP"
      type="text"
      component={
        <InputMask
          mask="99999-999"
          value={formData.cep}
          onChange={handleCepChange}
        >
          {(inputProps) => <input type="text" {...inputProps} />}
        </InputMask>
      }
    />
    {[
      { label: "Endereço", name: "endereco" },
      { label: "Número", name: "numero" },
      { label: "Bairro", name: "bairro" },
      { label: "Cidade", name: "cidade" },
      { label: "Complemento", name: "complemento" },
    ].map((field) => (
      <FormInputCard
        key={field.label}
        label={field.label}
        type="text"
        name={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
      />
    ))}
  </>
);

const mensalidadeLabelStyle = {
  backgroundColor: "#cbcbcb",
  padding: "0 10px",
  height: "1.8rem",
  display: "flex",
  alignItems: "center",
  borderTopLeftRadius: "4px",
  borderBottomLeftRadius: "4px",
  color: "#f8a11e",
};

const mensalidadeInputStyle = {
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
  borderLeft: "0",
  padding: "0 10px",
  boxSizing: "border-box",
  background: "transparent",
};
