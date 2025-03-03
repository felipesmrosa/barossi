import { jsPDF } from "jspdf";
import rosatech from "@/Complementos/Imagens/rosatech.png";

export const exportarPDF = (alunoSelecionado, anoSelecionado, alunos) => {
    let dados = alunos;

    // Filtrando os alunos com base no aluno selecionado
    if (alunoSelecionado !== "todos") {
        dados = dados.filter((aluno) => aluno.id === alunoSelecionado);
    }

    // Pegando o ano atual (2025) ou o ano selecionado, se aplicável
    const anoAtual = new Date().getFullYear();
    const anoFinal = anoSelecionado !== "todos" ? parseInt(anoSelecionado) : anoAtual;

    // Adicionando título no PDF
    const doc = new jsPDF();
    doc.text("Relatório Financeiro", 20, 10);

    // Definindo a posição inicial Y
    let yPosition = 20;

    // Cabeçalho com os meses
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", 
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    dados.forEach((item, index) => {
        // Obtenção das mensalidades para o ano selecionado
        const mensalidadesAnoSelecionado = item.mensalidades[anoFinal];

        // Verificando se as mensalidades para o ano existem
        if (!mensalidadesAnoSelecionado) return;

        // Verificando todas as chaves do objeto aluno e garantindo que o nome do aluno seja válido
        const nomeAluno = item.nomeCompleto || item.nome || "Nome não disponível";

        // Cabeçalho com os dados do aluno
        doc.text(`Aluno: ${nomeAluno} - CPF: ${item.cpf} - Valor Mensalidade: R$ ${item.valorMensalidade}`, 20, yPosition);
        yPosition += 10;

        // Adicionando os meses
        meses.forEach((mes) => {
            const mensalidadeMes = mensalidadesAnoSelecionado[mes] || "Pendente";
            doc.text(`${mes}: ${mensalidadeMes}`, 20, yPosition);
            yPosition += 6;

            // Quebra de página se necessário
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Separação entre os alunos
        yPosition += 10;
    });

    // Definindo o nome do arquivo baseado no nome do aluno e no ano
    const primeiroAluno = dados.length > 0 ? dados[0] : {};  // Garantindo que existam alunos
    const nomeAlunoArquivo = (primeiroAluno && primeiroAluno.nomeCompleto) || "relatorio";
    const nomeArquivo = `relatorio_${nomeAlunoArquivo.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')}_${anoFinal}.pdf`;

    // Adicionando imagem no rodapé
    doc.addImage(rosatech, "PNG", 20, 275, 180, 20);  // Ajuste as coordenadas conforme necessário

    // Salvando o arquivo PDF com o nome adequado
    doc.save(nomeArquivo);
};
