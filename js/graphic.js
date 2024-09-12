let arregloDatos = [['Grafico','Columna'],['2020',40],['2021',30],['2022',50],['2023',60],['2024',80]];

function cargarGrafico() {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    for (i = 0; i < arregloDatos.length; i++) {
        if (arregloDatos[i] === "") {
            alert("Hay espacios vacios");
            return;
        }
    }

    let data = google.visualization.arrayToDataTable(arregloDatos);

    let options = {
        'title': 'Variacion de Precios - %',
        'width': 600,
    };

    piechart = $('.piechart')

    for (let x = 0; x < piechart.length; x++) {
        let chart = new google.visualization.ColumnChart(piechart[x]);
        chart.draw(data, options);   
    }
}

cargarGrafico()