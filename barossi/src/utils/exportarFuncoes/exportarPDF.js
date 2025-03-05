import { jsPDF } from "jspdf";
import footerrosatech from "@/Complementos/Imagens/footerrosatech.png";
import headerrosatech from "@/Complementos/Imagens/headerrosatech.png";

export const exportarPDF = (alunoSelecionado, anoSelecionado, alunos) => {
    let dados = alunos;

    if (alunoSelecionado !== "todos") {
        dados = dados.filter((aluno) => aluno.id === alunoSelecionado);
    }

    const anoAtual = new Date().getFullYear();
    const anoFinal = anoSelecionado !== "todos" ? parseInt(anoSelecionado) : anoAtual;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerHeight = 30;
    const headerHeight = 40;
    let yPosition = headerHeight + 20; // Começar após o cabeçalho

    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const adicionarCabecalho = () => {
        doc.addImage(headerrosatech, "PNG", 0, 0, pageWidth, headerHeight);
        yPosition = headerHeight + 20; // Resetar posição do conteúdo após o cabeçalho
    };

    const adicionarRodape = () => {
        doc.addImage(footerrosatech, "PNG", 0, pageHeight - footerHeight, pageWidth, footerHeight);
    };

    dados.forEach((item, index) => {
        if (index > 0) {
            doc.addPage(); // Nova página para cada aluno
        }

        adicionarCabecalho();

        const mensalidadesAnoSelecionado = item.mensalidades[anoFinal];
        if (!mensalidadesAnoSelecionado) return;

        const nomeAluno = item.nomeCompleto || item.nome || "Nome não disponível";

        // Cabeçalho do aluno (um abaixo do outro)
        doc.text(`Aluno: ${nomeAluno}`, 20, yPosition);
        yPosition += 8;
        doc.text(`CPF: ${item.cpf}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Valor Mensalidade: ${item.valorMensalidade}`, 20, yPosition);
        yPosition += 16; // Espaçamento antes de listar os meses
        doc.text(`Ano Selecionado: ${anoFinal}`, 20, yPosition);
        yPosition += 16; // Espaçamento antes de listar os meses

        meses.forEach((mes) => {
            const mensalidadeMes = mensalidadesAnoSelecionado[mes] || "Pendente";
            doc.text(`${mes}: ${mensalidadeMes}`, 20, yPosition);
            yPosition += 6;

            if (yPosition > pageHeight - footerHeight - 10) {
                adicionarRodape();
                doc.addPage();
                adicionarCabecalho();
                yPosition = headerHeight + 20;
            }
        });

        adicionarRodape();
    });

    const primeiroAluno = dados.length > 0 ? dados[0] : {};
    const nomeAlunoArquivo = (primeiroAluno && primeiroAluno.nome) || "aluno";
    const nomeArquivo = `relatorio_${nomeAlunoArquivo.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')}_${anoFinal}.pdf`;

    doc.save(nomeArquivo);
};
