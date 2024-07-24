import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import InputMask from "react-input-mask";
import { NumberFormatBase } from "react-number-format";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { modalidades, customStyles } from "@/utils/data";
import { validarCPF } from "@/utils/validaCPF";
import { bancoDeDados } from "../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

export function EditarAluno() {
  const { id } = useParams();
  const alunoDoc = doc(bancoDeDados, "alunos", id);
  const [aluno, setAluno] = useState(null);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    whatsapp: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    complemento: "",
  });
  const [cpf, setCpf] = useState("");
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [mensalidade, setMensalidade] = useState("");
  const [desconto, setDesconto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAluno = async () => {
      const alunoSnap = await getDoc(alunoDoc);
      const alunoData = alunoSnap.data();
      setAluno(alunoData);
      setFormData({
        nomeCompleto: alunoData.nomeCompleto,
        whatsapp: alunoData.whatsapp,
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
    };

    fetchAluno();
  }, [id]);

  const atualizarMensalidade = () => {
    const totalMensalidade = calcularTotalMensalidade();
    const valorComDesconto = aplicarDesconto(totalMensalidade);
    setMensalidade(valorComDesconto);
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
  };

  const handleModalidadeChange = (selectedOptions) => {
    setSelectedModalidades(selectedOptions);
    atualizarMensalidade();
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

    if (!mensalidade) {
      toast.error("O campo mensalidade é obrigatório");
      return false;
    }

    return true;
  };

  const labelMapping = {
    nomeCompleto: "Nome completo",
    cpf: "CPF",
    whatsapp: "Whatsapp",
    cep: "CEP",
    endereco: "Endereço",
    numero: "Número",
    bairro: "Bairro",
    cidade: "Cidade",
    complemento: "Complemento",
  };

  const atualizarAluno = async () => {
    if (!validarCampos()) return;

    const alunoData = {
      ...formData,
      cpf,
      modalidades: selectedModalidades,
      mensalidade,
      desconto,
    };

    try {
      await updateDoc(alunoDoc, alunoData);
      toast.success("Aluno atualizado com sucesso!");
      navigate("/alunos"); // Redireciona para a lista de alunos após a atualização
    } catch (error) {
      console.error("Erro ao atualizar aluno: ", error);
      toast.error("Erro ao atualizar aluno. Tente novamente.");
    }
  };

  return (
    <div className="fundoPadrao">
      <ToastContainer
        autoClose={500} // Tempo em milissegundos
        pauseOnHover
        draggable
      />
      <Titulo
        voltarPagina={true}
        titulo="Editar aluno"
        botao="Atualizar"
        click={atualizarAluno}
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
            />
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
                  value={selectedModalidades}
                  onChange={handleModalidadeChange}
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
                    displayType="text"
                    prefix="R$ "
                    renderText={(value) => <input type="text" value={value} />}
                  />
                </div>
              }
            />
            <FormInput
              label="CEP"
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              component={<InputMask mask="99999-999" />}
            />
            <FormInput
              label="Endereço"
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
            />
            <FormInput
              label="Número"
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
            />
            <FormInput
              label="Bairro"
              type="text"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
            />
            <FormInput
              label="Cidade"
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
            />
            <FormInput
              label="Complemento"
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mensalidadeLabelStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginRight: "8px",
};

function FormInput({ label, component, type = "text", ...props }) {
  return (
    <div className="formInput">
      <label className="formInput__label">{label}</label>
      {component || (
        <input type={type} className="formInput__input" {...props} />
      )}
    </div>
  );
}
