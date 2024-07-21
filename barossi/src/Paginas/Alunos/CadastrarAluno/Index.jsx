import React, { useEffect, useState } from "react";
import Select from "react-select";
import InputMask from "react-input-mask";
import { NumberFormatBase } from "react-number-format";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { modalidades, customStyles } from "@/utils/data";
import { validarCPF } from "@/utils/validaCPF";

export function CadastroDeAlunos() {
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [mensalidade, setMensalidade] = useState("");
  const [desconto, setDesconto] = useState("");

  useEffect(() => {
    atualizarMensalidade();
  }, [selectedModalidades, desconto]);

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
    setCpfError(validarCPF(newCpf) ? "" : "CPF inválido");
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

  return (
    <div className="fundoPadrao">
      <Titulo voltarPagina={true} titulo="Novo aluno" botao="Cadastrar" />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <FormInput label="Nome completo" type="text" />
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
              label="Whatsapp"
              type="text"
              component={
                <InputMask mask="(99) 9 9999-9999" alwaysShowMask={false} />
              }
            />
            <FormInput
              label="Modalidade"
              component={
                <Select
                  styles={customStyles}
                  isMulti
                  name="colors"
                  options={modalidades}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Selecione a(s) modalidade(s)"
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
            <EnderecoForm />
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
}) => (
  <div className="cardPadrao__card__formulario__input">
    <label id="required">{label}</label>
    {component || (
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    )}
    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>
);

const EnderecoForm = () => (
  <>
    <div id="separacao" className="cardPadrao__card__formulario--titulo">
      <p>Endereço</p>
    </div>
    {["CEP", "Endereço", "Número", "Bairro", "Cidade", "Complemento"].map(
      (label) => (
        <FormInput key={label} label={label} type="text" />
      )
    )}
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
