function addRow() {
    const table = document.getElementById('processTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const mixers = ['RB06', 'RB07', 'SE01', 'RB08'];
    const mixerCell = newRow.insertCell(0);
    const processCell = newRow.insertCell(1);
    const loteCell = newRow.insertCell(2);
    const horaInicialCell = newRow.insertCell(3);
    const horaFinalCell = newRow.insertCell(4);
    const observacaoCell = newRow.insertCell(5);
    const actionsCell = newRow.insertCell(6);

    const mixerSelect = document.createElement('select');
    mixers.forEach(mixer => {
        const option = document.createElement('option');
        option.value = mixer;
        option.text = mixer;
        mixerSelect.appendChild(option);
    });
    mixerCell.appendChild(mixerSelect);

    processCell.innerHTML = '<input type="text" name="processo" />';
    loteCell.innerHTML = '<input type="text" name="lote" />';
    horaInicialCell.innerHTML = '<input type="datetime-local" name="hora_inicial" />';
    horaFinalCell.innerHTML = '<input type="datetime-local" name="hora_final" />';
    observacaoCell.innerHTML = '<input type="text" name="observacao" />';
    actionsCell.innerHTML = '<button onclick="deleteRow(this)">Apagar</button>';
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function downloadXLSX() {
    const table = document.getElementById('processTable');
    const rows = table.querySelectorAll('tbody tr');
    const data = [
        ["Mixer", "Processo", "Lote", "Hora Inicial", "Hora Final", "Observação"]
    ];

    for (const row of rows) {
        const cells = row.querySelectorAll('td');
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

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Processos");

    XLSX.writeFile(workbook, 'tabela_processos.xlsx');
}

function visualizeData() {
    const table = document.getElementById('processTable');
    const rows = table.querySelectorAll('tr');
    let visualization = '<table border="1"><thead><tr><th>Mixer</th><th>Processo</th><th>Lote</th><th>Hora Inicial</th><th>Hora Final</th><th>Observação</th></tr></thead><tbody>';

    for (const row of rows) {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => cell.querySelector('input, select') ? cell.querySelector('input, select').value : cell.innerText);
        visualization += '<tr>';
        rowData.forEach(data => {
            visualization += `<td>${data}</td>`;
        });
        visualization += '</tr>';
    }
    visualization += '</tbody></table>';

    localStorage.setItem('visualizationData', visualization);
    window.open('visualization.html', '_blank');
}
