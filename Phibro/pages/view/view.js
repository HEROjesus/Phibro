function generateCSV() {
    // Captura os valores dos campos de input
    var campo1 = document.getElementById('campo1').value;
    var campo2 = document.getElementById('campo2').value;
    var campo3 = document.getElementById('campo3').value;
    var campo4 = document.getElementById('campo4').value;
    var campo5 = document.getElementById('campo5').value;
    
    // Cria os dados do CSV
    var data = [
        ["Campo 1", "Campo 2", "Campo 3", "Campo 4", "Campo 5"],
        [campo1, campo2, campo3, campo4, campo5]
    ];
    
    // Converte os dados para CSV
    var csv = Papa.unparse(data);
    
    // Cria um blob com o conteúdo CSV
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    // Cria um link para download
    var link = document.getElementById('downloadLink');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'dados.csv');
    link.style.display = 'inline';
    link.textContent = 'Download CSV';
}
