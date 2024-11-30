// api/updateMensalidades.js

import { initializeApp, firestore } from "firebase-admin";
initializeApp();

export default async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    const alunosRef = firestore().collection("Alunos");
    const snapshot = await alunosRef.get();

    const batch = firestore().batch();

    snapshot.forEach((doc) => {
      const aluno = doc.data();
      const statusAtual = aluno.mensalidadeStatus;
      if (statusAtual === "Pago") {
        batch.update(doc.ref, { mensalidadeStatus: "Pendente" });
      } else {
        batch.update(doc.ref, { mensalidadeStatus: "Atrasado" });
      }
    });

    await batch.commit();
    res.status(200).json({ message: "Mensalidades atualizadas com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar mensalidades:", error);
    res.status(500).json({ error: "Erro ao atualizar mensalidades." });
  }
};
