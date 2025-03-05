import * as XLSX from "xlsx";

const gerarDadosExportados = (alunos, alunoSelecionado, anoSelecionado) => {
    let dados = alunos;

    if (alunoSelecionado !== "todos") {
        dados = dados.filter(aluno => aluno.id === alunoSelecionado);
    }

    // Defina os meses de forma consistente (tudo minúsculo para combinar com os dados)
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    return dados.map(aluno => {
        // Acessa as mensalidades para o ano selecionado
        const mensalidadesAno = aluno.mensalidades[anoSelecionado] || {};

        // Depuração: Mostrar o que foi recuperado de mensalidades
        console.log(`Mensalidades para ${aluno.nome} no ano ${anoSelecionado}:`, mensalidadesAno);

        // Listar os meses separadamente
        const mensalidadesSeparadas = meses.reduce((acc, mes) => {
            acc[mes.charAt(0).toUpperCase() + mes.slice(1)] = mensalidadesAno[mes] || "Não especificado"; 
            return acc;
        }, {});

        return {
            ID: aluno.id,
            Aluno: aluno.nome,
            CPF: aluno.cpf,
            Ano: anoSelecionado,
            "Valor Mensalidade": aluno.valorMensalidade || "Não especificado",
            ...mensalidadesSeparadas,  // Espalha as mensalidades separadas por mês
        };
    });
};

export const exportarExcel = (alunoSelecionado, anoSelecionado, alunos) => {
    const dadosFiltrados = gerarDadosExportados(alunos, alunoSelecionado, anoSelecionado);

    const ws = XLSX.utils.json_to_sheet(dadosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");

    let nomeArquivo;

    if (alunoSelecionado !== "todos") {
        // Encontre o aluno pelo ID e pegue o nome
        const aluno = alunos.find(aluno => aluno.id === alunoSelecionado);
        nomeArquivo = `relatorio_${aluno ? aluno.nome : 'aluno_inexistente'}_${anoSelecionado}.xlsx`;
    } else {
        nomeArquivo = `relatorio_todos_${anoSelecionado}.xlsx`;
    }

    XLSX.writeFile(wb, nomeArquivo);
};
