import React, { useState } from 'react';
import axios from 'axios';

const GerarBoleto = () => {
  const [alunoSelecionado, setAlunoSelecionado] = useState({
    nome: '',
    cpf: '',
    valor: ''
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://academia-barossi.vercel.app/api/criar-boleto",
        {
          nome: alunoSelecionado.nome,
          cpf: alunoSelecionado.cpf,
          valor: alunoSelecionado.valor,
        }
      );
      console.log("Boleto gerado com sucesso", response.data);
      // Lógica para exibir a resposta ou realizar outra ação
    } catch (error) {
      console.error("Erro ao gerar boleto", error);
    }
  };

  return (
    <div>
      <h2>Gerar Boleto para Aluno</h2>
      <input
        type="text"
        placeholder="Nome do Aluno"
        value={alunoSelecionado.nome}
        onChange={(e) => setAlunoSelecionado({ ...alunoSelecionado, nome: e.target.value })}
      />
      <input
        type="text"
        placeholder="CPF do Aluno"
        value={alunoSelecionado.cpf}
        onChange={(e) => setAlunoSelecionado({ ...alunoSelecionado, cpf: e.target.value })}
      />
      <input
        type="text"
        placeholder="Valor"
        value={alunoSelecionado.valor}
        onChange={(e) => setAlunoSelecionado({ ...alunoSelecionado, valor: e.target.value })}
      />
      <button onClick={handleSubmit}>Gerar Boleto</button>
    </div>
  );
};

export default GerarBoleto;
