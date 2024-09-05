console.log(reserves)

let series = [];
let xData = [];

// Mapear las reservas a las horas del día (08, 09, etc.)
let hoursMap = {};

// Recorrer las reservas
reserves.forEach(reserve => {
    // Obtener la hora del time
    let hour = reserve.time.split(":")[0];
    
    // Si no hay datos para esa hora, inicializar un array vacío
    if (!hoursMap[hour]) {
        hoursMap[hour] = [];
    }
    
    // Agregar el dato correspondiente al array de esa hora
    hoursMap[hour].push(reserve.time);
    
    // Agregar la fecha al eje X si no está ya
    let formattedDate = new Date(reserve.date).toISOString(); // Formato adecuado para el gráfico
    if (!xData.includes(formattedDate)) {
        xData.push(formattedDate);
    }
});

// Crear las series dinámicamente basadas en las horas
for (let hour = 8; hour <= 17; hour++) {
    let hourStr = hour.toString().padStart(2, '0'); // Asegurar formato "08", "09", etc.
    
    series.push({
        name: hourStr,
        data: hoursMap[hourStr] || [] // Usar los datos que se hayan recolectado para esa hora, o un array vacío
    });
}
// APEXCHART
let options = {
    series: series,
    chart: {
        height: 350,
        type: 'area'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: xData
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:m'
        },
		y: {
            formatter: function(val) {
                return val ? val : ''; // Formatear la hora o retornar vacío
            }
        }
    },
};

let chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();