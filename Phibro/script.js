// Função para adicionar uma nova linha à tabela
function addRow() {
    // Obtém a tabela pelo ID e seleciona o corpo da tabela
    const table = document.getElementById('processTable').getElementsByTagName('tbody')[0];
    // Insere uma nova linha no corpo da tabela
    const newRow = table.insertRow();

    // Lista de mixers disponíveis
    const mixers = ['RB06', 'RB07', 'SE01', 'RB08'];
    // Insere células na nova linha para cada coluna necessária
    const mixerCell = newRow.insertCell(0);
    const processCell = newRow.insertCell(1);
    const loteCell = newRow.insertCell(2);
    const horaInicialCell = newRow.insertCell(3);
    const horaFinalCell = newRow.insertCell(4);
    const observacaoCell = newRow.insertCell(5);
    const actionsCell = newRow.insertCell(6);

    // Cria um elemento <select> e adiciona opções de mixers
    const mixerSelect = document.createElement('select');
    mixers.forEach(mixer => {
        const option = document.createElement('option');
        option.value = mixer;
        option.text = mixer;
        mixerSelect.appendChild(option);
    });
    // Adiciona o <select> à célula correspondente
    mixerCell.appendChild(mixerSelect);

    // Insere campos de entrada (input) nas células restantes
    processCell.innerHTML = '<input type="text" name="processo" />';
    loteCell.innerHTML = '<input type="text" name="lote" />';
    horaInicialCell.innerHTML = '<input type="datetime-local" name="hora_inicial" />';
    horaFinalCell.innerHTML = '<input type="datetime-local" name="hora_final" />';
    observacaoCell.innerHTML = '<input type="text" name="observacao" />';
    // Adiciona um botão para apagar a linha na última célula
    actionsCell.innerHTML = '<button onclick="deleteRow(this)">Apagar</button>';
}

// Função para apagar uma linha da tabela
function deleteRow(button) {
    // Obtém a linha do botão pressionado
    const row = button.parentNode.parentNode;
    // Remove a linha da tabela
    row.parentNode.removeChild(row);
}

// Função para baixar a tabela em formato XLSX
function downloadXLSX() {
    // Obtém a tabela pelo ID
    const table = document.getElementById('processTable');
    // Seleciona todas as linhas do corpo da tabela
    const rows = table.querySelectorAll('tbody tr');
    // Array que armazena os dados da tabela, começando com os cabeçalhos
    const data = [
        ["Mixer", "Processo", "Lote", "Hora Inicial", "Hora Final", "Observação"]
    ];

    // Itera sobre cada linha da tabela
    for (const row of rows) {
        // Seleciona todas as células da linha
        const cells = row.querySelectorAll('td');
        // Coleta os valores das células e os adiciona ao array de dados
        const rowData = [
            cells[0].querySelector('select').value,
            cells[1].querySelector('input').value,
            cells[2].querySelector('input').value,
            cells[3].querySelector('input').value,
            cells[4].querySelector('input').value,
            cells[5].querySelector('input').value
        ];
        data.push(rowData);
    }

    // Cria uma planilha a partir do array de dados
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // Cria um novo workbook
    const workbook = XLSX.utils.book_new();
    // Adiciona a planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Processos");

    // Salva o arquivo XLSX com o nome especificado
    XLSX.writeFile(workbook, 'tabela_processos.xlsx');
}

// Função para visualizar os dados da tabela
function visualizeData() {
    // Obtém a tabela pelo ID
    const table = document.getElementById('processTable');
    // Seleciona todas as linhas da tabela
    const rows = table.querySelectorAll('tr');
    // Inicia a string de visualização como uma tabela HTML
    let visualization = '<table border="1"><thead><tr><th>Mixer</th><th>Processo</th><th>Lote</th><th>Hora Inicial</th><th>Hora Final</th><th>Observação</th></tr></thead><tbody>';

    // Itera sobre cada linha da tabela
    for (const row of rows) {
        // Seleciona todas as células da linha
        const cells = row.querySelectorAll('th, td');
        // Coleta os valores das células e os adiciona à string de visualização
        const rowData = Array.from(cells).map(cell => cell.querySelector('input, select') ? cell.querySelector('input, select').value : cell.innerText);
        visualization += '<tr>';
        rowData.forEach(data => {
            visualization += `<td>${data}</td>`;
        });
        visualization += '</tr>';
    }
    visualization += '</tbody></table>';

    // Armazena a visualização no localStorage e abre uma nova janela para exibir os dados
    localStorage.setItem('visualizationData', visualization);
    window.open('visualization.html', '_blank');
}


