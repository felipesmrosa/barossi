import React from "react";
import { FormInputCard } from "../FundoPadrao/FormInputCard/Index";

export const ModalTabelaVirtual = ({
  isOpen,
  editIndex,
  setNewItem,
  newItem,
  addItem,
  closeModal,
}) => {
  if (!isOpen) return null;

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editIndex !== null ? "Editar Item" : "Adicionar Item"}</h2>

        <div className="cardPadrao">
          <div className="cardPadrao__card__formulario">
            <FormInputCard
              label="Coluna"
              type="text"
              name="coluna"
              value={newItem.coluna}
              onChange={handleNewItemChange}
            />
            <FormInputCard
              label="Descrição"
              type="text"
              name="descricao"
              value={newItem.descricao}
              onChange={handleNewItemChange}
            />
          </div>
          <div className="modal-buttons">
            <button onClick={addItem} className="confirm-button">
              {editIndex !== null ? "Atualizar" : "Adicionar"}
            </button>
            <button onClick={closeModal} className="cancel-button">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
