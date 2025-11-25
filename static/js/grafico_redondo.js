document.addEventListener('DOMContentLoaded', function() {
    

    const totalSoldTag = document.getElementById('total-sold'); 
    const dailySalesLimitTag = document.getElementById('daily-sales-limit'); 
    const totalAllowedTag = document.getElementById('remaining-limit'); 
    if (!totalSoldTag || !dailySalesLimitTag || !totalAllowedTag) {
        console.error("Faltan etiquetas de datos para el gráfico de objetivo de ventas.");
        return; 
    }

    // Convertir a número (flotante)
    const totalSold = parseFloat(totalSoldTag.textContent || '0');        
    const remainingToSell = parseFloat(dailySalesLimitTag.textContent || '0'); 
    const totalDailyLimit = parseFloat(totalAllowedTag.textContent || '0');  

    
    let percentageCompleted = 0;
    if (totalDailyLimit > 0) {
        percentageCompleted = (totalSold / totalDailyLimit) * 100;
    }

    // Los datos para el gráfico de dona son: [Parte Completada, Parte Restante]
    const dataForDoughnutChart = {
        labels: ['Completado', 'Restante'],
        datasets: [{
            data: [totalSold, remainingToSell], // Usamos 4 y 996
            backgroundColor: [
                '#5a5c9f', // Color para "Completado" (morado/azul)
                '#343a40'  // Color para "Restante" (gris oscuro)
            ],
            hoverBackgroundColor: [
                '#6a6cbc', 
                '#454e57'
            ],
            borderColor: [
                '#5a5c9f', 
                '#343a40'
            ],
            borderWidth: 1 
        }]
    };

   
    const ctxDoughnut = document.getElementById('dailySalesGoalChart').getContext('2d');

    const dailySalesGoalChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: dataForDoughnutChart,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%', // Crea el "agujero" de la dona
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 20,
                        // Función para personalizar el texto de la leyenda (mostrar porcentaje correcto)
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const value = data.datasets[0].data[i];
                                    // El total para los porcentajes es la suma de los dos segmentos (4 + 996 = 1000)
                                    const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                                    
                                    // Asegúrate de que el total no sea cero para evitar divisiones por cero
                                    const percentage = total > 0 ? (value / total * 100).toFixed(0) : 0; 

                                    return {
                                        text: `${label} ${percentage}%`, // Texto de la leyenda personalizado
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: isNaN(value), 
                                        index: i
                                    };
                                });
                            }
                            return [];
                        },
                        color: 'rgb(107, 114, 128)' // Color del texto de la leyenda
                    }
                },
                tooltip: {
                    enabled: false // Deshabilitar tooltips
                }
            }
        }
    });

    // =============================================================
    // 4. ACTUALIZAR EL TEXTO EN EL CENTRO DEL GRÁFICO (HTML)
    // =============================================================
    const percentageValueElement = document.getElementById('percentageValue');
    if (percentageValueElement) {
        percentageValueElement.textContent = `${percentageCompleted.toFixed(0)}%`; 
    }

    // =============================================================
    // 5. ACTUALIZAR EL TÍTULO SUPERIOR
    // =============================================================
    const chartTitleElement = document.getElementById('chart-title'); 
    if (chartTitleElement) {
        chartTitleElement.textContent = `Limite de venta del dia ${totalDailyLimit.toFixed(0)}`;
    }
});