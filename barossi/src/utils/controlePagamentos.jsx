// src/utils/controlePagamentos.js
import cron from "node-cron";
import { bancoDeDados } from "@/firebase"; // Certifique-se de importar corretamente o seu banco de dados

class ControlePagamentos {
  constructor() {
    this.iniciarResetMensal();
  }

  // Método para resetar o status de pagamento para "pendente" no início de cada mês
  resetarStatusMensal = async () => {
    const alunosRef = bancoDeDados.collection("alunos");
    const snapshot = await alunosRef.get();

    snapshot.forEach((doc) => {
      const aluno = doc.data();
      const mesAtual = new Date().toISOString().slice(0, 7); // Formato YYYY-MM

      // Verificar se o mês atual não existe no histórico de pagamentos
      if (!aluno.pagamentos[mesAtual]) {
        alunosRef.doc(doc.id).update({
          [`pagamentos.${mesAtual}.statusPagamento`]: "pendente",
          [`pagamentos.${mesAtual}.timestamp`]: new Date().toISOString(),
        });
      }
    });
  };

  // Método para atualizar o status de pagamento para "atrasado" se passarem 7 dias
  atualizarStatusPagamento = async () => {
    const alunosRef = bancoDeDados.collection("alunos");
    const snapshot = await alunosRef.get();

    snapshot.forEach((doc) => {
      const aluno = doc.data();
      const dataCadastro = aluno.timestamp.toDate();
      const diasPassados = (new Date() - dataCadastro) / (1000 * 60 * 60 * 24);

      if (aluno.statusPagamento === "pendente" && diasPassados >= 7) {
        alunosRef.doc(doc.id).update({
          statusPagamento: "atrasado",
        });
      }
    });
  };

  // Iniciar o cron job para resetar no primeiro dia de cada mês
  iniciarResetMensal = () => {
    cron.schedule("0 0 1 * *", () => {
      this.resetarStatusMensal();
      console.log("Status de pagamentos resetado no início do mês!");
    });

    // Executar a cada 1 minuto para atualizar o status dos pagamentos
    cron.schedule("*/1 * * * *", () => {
      this.atualizarStatusPagamento();
      console.log("Verificando status de pagamento...");
    });
  };
}

export default ControlePagamentos;
