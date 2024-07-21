import React from "react";
import { Titulo } from "@/Componentes/FundoPadrao/Titulo/Index";

export function CadastroDeAlunos() {
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
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Telefone
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Modalidade
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario__input">
              <label id="required" htmlFor="">
                Mensalidade
              </label>
              <input type="text" />
            </div>
            <div className="cardPadrao__card__formulario--titulo">
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
