// api/atualizarMensalidades.js
import { initializeApp, firestore } from 'firebase-admin';
import Cors from 'cors';

// Inicializa o Firebase Admin SDK
initializeApp();

// Inicializa o middleware CORS
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: '*' // Permitir qualquer origem (alterar conforme necessário para segurança)
});

export default async (req, res) => {
  // Habilita o CORS
  await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result))));

  try {
    // Acessa a coleção 'Alunos' no Firestore
    const alunosRef = firestore().collection('Alunos');
    const snapshot = await alunosRef.get();

    const batch = firestore().batch();

    snapshot.forEach((doc) => {
      const aluno = doc.data();
      const statusAtual = aluno.mensalidadeStatus;
      if (statusAtual === 'Pago') {
        batch.update(doc.ref, { mensalidadeStatus: 'Pendente' });
      } else {
        batch.update(doc.ref, { mensalidadeStatus: 'Atrasado' });
      }
    });

    await batch.commit();
    res.status(200).json({ message: 'Mensalidades atualizadas com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar mensalidades.' });
  }
};
