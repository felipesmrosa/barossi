import React, { useEffect, useState } from "react";
import Select from "react-select";
import InputMask from "react-input-mask";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";
import { modalidades } from "@/utils/data";
import { customStyles } from "@/utils/data";
import { validarCPF } from "@/utils/validaCPF";
import { NumberFormatBase } from "react-number-format";

// validarCPF

export function CadastroDeAlunos() {
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [mensalidade, setMensalidade] = useState("");
  const [desconto, setDesconto] = useState("");

  useEffect(() => {
    // Atualiza a mensalidade sempre que o desconto ou a seleção de modalidades mudar
    const atualizarMensalidade = () => {
      // Calcula a soma das mensalidades
      const totalMensalidade = selectedModalidades.reduce((total, option) => {
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

      // Aplica o desconto
      const descontoValor = desconto ? parseFloat(desconto) / 100 : 0;
      const valorComDesconto = totalMensalidade * (1 - descontoValor);

      // Atualiza o estado com o valor formatado
      setMensalidade(valorComDesconto);
    };

    atualizarMensalidade();
  }, [selectedModalidades, desconto]);

  const handleCpfChange = (event) => {
    const newCpf = event.target.value;
    setCpf(newCpf);

    if (validarCPF(newCpf)) {
      setCpfError("");
    } else {
      setCpfError("CPF inválido");
    }
  };

  const handleModalidadeChange = (selectedOptions) => {
    setSelectedModalidades(selectedOptions);

    // Calcula a soma das mensalidades
    const totalMensalidade = selectedOptions.reduce((total, option) => {
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

    // Aplica o desconto
    const descontoValor = desconto ? parseFloat(desconto) / 100 : 0;
    const valorComDesconto = totalMensalidade * (1 - descontoValor);

    // Atualiza o estado com o valor formatado
    setMensalidade(valorComDesconto);
  };

  const handleDescontoChange = (event) => {
    let newDesconto = event.target.value;

    // Limita o desconto a 100%
    if (parseFloat(newDesconto) > 100) {
      newDesconto = "100";
    }

    setDesconto(newDesconto);

    // Atualiza mensalidade com base no desconto
    handleModalidadeChange(selectedModalidades);
  };

  return (
    <div className="fundoPadrao">
      <Titulo voltarPagina={true} titulo={"Novo aluno"} botao={"Cadastrar"} />

      <div className="cardPadrao">
        <div style={{ padding: "14px" }} className="cardPadrao__card">
          <div className="cardPadrao__card__formulario">
            <div className="cardPadrao__card__formulario--titulo">
              <p>Dados</p>
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Nome completo
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                CPF
              </label>
              <InputMask
                mask="999.999.999-99"
                value={cpf}
                onChange={handleCpfChange}
              >
                {(inputProps) => <input type="text" {...inputProps} />}
              </InputMask>
              {cpfError && <p style={{ color: "red" }}>{cpfError}</p>}
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Whatsapp
              </label>
              <InputMask mask="(99) 9 9999-9999" alwaysShowMask={false}>
                {(inputProps) => <input type="text" {...inputProps} />}
              </InputMask>
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Modalidade
              </label>
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
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label htmlFor="">Desconto (%)</label>
              <input
                type="number"
                value={desconto}
                onChange={handleDescontoChange}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Mensalidade
              </label>
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <div
                  style={{
                    backgroundColor: "#cbcbcb",
                    padding: "0 10px",
                    height: "1.8rem",
                    display: "flex",
                    alignItems: "center",
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    color: "#f8a11e",
                  }}
                >
                  <b>R$</b>
                </div>
                <NumberFormatBase
                  value={mensalidade}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  displayType="text"
                  renderText={(formattedValue) => (
                    <input type="text" value={formattedValue} readOnly />
                  )}
                  style={{
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                    borderLeft: "0",
                    padding: "0 10px",
                    boxSizing: "border-box",
                    background: "transparent",
                    cursor: "not-allowed",
                  }}
                />
              </div>
            </div>
            <div
              id="separacao"
              className="cardPadrao__card__formulario--titulo"
            >
              <p>Endereço</p>
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                CEP
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Endereço
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Número
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Bairro
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Cidade
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Complemento
              </label>
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
