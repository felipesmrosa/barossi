import mercadopago from "mercadopago";

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // Configura os cabeçalhos de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');  // Permite todas as origens
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Cabeçalhos permitidos

  // Lida com requisições OPTIONS (preflight request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();  // Responde com status 200 para OPTIONS
  }

  // Só permite requisições POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Desestruturando o corpo da requisição
  const { nome, cpf, valor } = req.body;

  try {
    // Criação do pagamento no Mercado Pago
    const pagamento = await mercadopago.payment.create({
      transaction_amount: Number(valor),
      description: `Mensalidade de ${nome}`,
      payment_method_id: "ticket", // Método de pagamento boleto
      payer: {
        email: "aluno@email.com", // Coloque o e-mail do aluno aqui se possível
        first_name: nome,
        identification: {
          type: "CPF",
          number: cpf,
        },
      },
    });

    // Retorna a URL do boleto gerado
    return res.json({
      boleto_url: pagamento.response.transaction_details.external_resource_url,
    });
  } catch (error) {
    // Caso haja erro, retorna o erro
    return res.status(500).json({ error: error.message });
  }
}
