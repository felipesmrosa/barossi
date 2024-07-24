import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import InputMask from "react-input-mask";
import { NumberFormatBase } from "react-number-format";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { modalidades, customStyles, maiorDeIdadeData } from "@/utils/data";
import { validarCPF } from "@/utils/validaCPF";
import { bancoDeDados } from "../../../../firebase";
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

  useEffect(() => {
    if (isEditMode) {
      const fetchAluno = async () => {
        const alunoDoc = doc(bancoDeDados, "alunos", id);
        const alunoSnap = await getDoc(alunoDoc);
        const alunoData = alunoSnap.data();
        setFormData({
          nomeCompleto: alunoData.nomeCompleto,
          whatsapp: alunoData.whatsapp,
          responsavel: alunoData.responsavel,
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
        setMaiorDeIdade(alunoData.maiorDeIdade ?? true); // Defina como true se desejar "Sim" como padrão
      };

      fetchAluno();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    atualizarMensalidade();
  }, [selectedModalidades, desconto]);

  const atualizarMensalidade = () => {
    const totalMensalidade = calcularTotalMensalidade();
    const valorComDesconto = aplicarDesconto(totalMensalidade);
    setMensalidade(valorComDesconto >= 0 ? valorComDesconto : 0);
  };

  const calcularTotalMensalidade = () => {
    return selectedModalidades.reduce((total, option) => {
      const modalidade = modalidades.find((m) => m.value === option.value);
      return (
        total +
        (modalidade
          ? parseFloat(
              modalidade.mensalidade.replace(".", "").replace(",", ".")
            )
          : 0)
      );
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
    atualizarMensalidade();
  };

  const handleMaiorDeIdadeChange = (selectedOption) => {
    const value = selectedOption.value === "sim";
    setMaiorDeIdade(value);
    if (value) {
      setFormData((prevData) => ({ ...prevData, responsavel: "" }));
    }
  };

  const handleDescontoChange = (event) => {
    let newDesconto = event.target.value;
    if (parseFloat(newDesconto) > 100) newDesconto = "100";
    setDesconto(newDesconto);
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
      "responsavel",
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
      desconto,
      maiorDeIdade,
      timestamp: new Date(),
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
      setMaiorDeIdade(null);
    } catch (error) {
      console.error("Erro ao cadastrar aluno: ", error);
      toast.error("Erro ao cadastrar aluno. Tente novamente.");
    }
  };

  const atualizarAluno = async () => {
    if (!validarCampos()) return;

    const alunoData = {
      ...formData,
      cpf,
      modalidades: selectedModalidades,
      mensalidade,
      desconto,
      maiorDeIdade,
    };

    try {
      const alunoDoc = doc(bancoDeDados, "alunos", id);
      await updateDoc(alunoDoc, alunoData);
      navigate("/alunos");
    } catch (error) {
      toast.error("Erro ao atualizar aluno. Tente novamente.");
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer autoClose={500} pauseOnHover draggable />
      <Titulo
        voltarPagina={true}
        titulo={isEditMode ? "Editar aluno" : "Novo aluno"}
        botao={isEditMode ? "Atualizar" : "Cadastrar"}
        click={isEditMode ? atualizarAluno : cadastrarAluno}
      />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <FormInput
              label="Nome completo"
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
            />
            <FormInput
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
            <FormInput
              label="Maior de idade?"
              component={
                <Select
                  styles={customStyles}
                  name="maiorDeIdade"
                  options={maiorDeIdadeData}
                  placeholder="Selecione..."
                  value={
                    maiorDeIdade === null
                      ? { value: "sim", label: "Sim" } // Ajuste conforme a necessidade
                      : maiorDeIdade
                      ? { value: "sim", label: "Sim" }
                      : { value: "nao", label: "Não" }
                  }
                  onChange={handleMaiorDeIdadeChange}
                />
              }
            />

            {!maiorDeIdade && (
              <FormInput
                label="Responsável"
                type="text"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleInputChange}
                required={!maiorDeIdade}
              />
            )}
            <FormInput
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
            <FormInput
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
            <FormInput
              label="Desconto (%)"
              type="number"
              value={desconto}
              onChange={handleDescontoChange}
              min="0"
              max="100"
              step="0.01"
              required={false}
            />
            <FormInput
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
                    displayType="text"
                    renderText={(formattedValue) => (
                      <input type="text" value={formattedValue} readOnly />
                    )}
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

const FormInput = ({
  label,
  type,
  component,
  value,
  onChange,
  min,
  max,
  step,
  error,
  name,
  required = true,
}) => (
  <div className="cardPadrao__card__formulario__input">
    <label id={required ? "required" : undefined}>{label}</label>
    {component || (
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        name={name}
      />
    )}
    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>
);

const EnderecoForm = ({ formData, handleInputChange, handleCepChange }) => (
  <>
    <div id="separacao" className="cardPadrao__card__formulario--titulo">
      <p>Endereço</p>
    </div>
    <FormInput
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
      <FormInput
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
  cursor: "not-allowed",
};
