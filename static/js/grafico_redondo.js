document.addEventListener('DOMContentLoaded', function() {
    
    const totalSoldTag = document.getElementById('total-sold'); 
    const dailySalesLimitTag = document.getElementById('daily-sales-limit'); 
    const totalAllowedTag = document.getElementById('remaining-limit'); 
    
    if (!totalSoldTag || !dailySalesLimitTag || !totalAllowedTag) {
        console.error("Faltan etiquetas de datos para el gráfico de objetivo de ventas.");
        return; 
    }

    // Convertir a número (flotante)
    const totalSold = parseFloat(totalSoldTag.textContent || '0');           // Lo vendido
    const dailySalesLimit = parseFloat(dailySalesLimitTag.textContent || '0'); // Límite total del día
    const remainingToSell = parseFloat(totalAllowedTag.textContent || '0');   // Lo que falta por vender

    // Calcular el porcentaje completado
    let percentageCompleted = 0;
    if (dailySalesLimit > 0) {
        percentageCompleted = (totalSold / dailySalesLimit) * 100;
    }

    // Los datos para el gráfico de dona son: [Parte Completada, Parte Restante]
    const dataForDoughnutChart = {
        labels: ['Completado', 'Restante'],
        datasets: [{
            data: [totalSold, remainingToSell],
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
            hoverOffset: 2,
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
            cutout: '70%', // Crea el "agujero" de la dona
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 30,
                        color: 'rgb(107, 114, 128)' // Color del texto de la leyenda
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed.toFixed(0) + ' ventas';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Actualizar el porcentaje en el centro
    const percentageValueElement = document.getElementById('percentageValue');
    if (percentageValueElement) {
        percentageValueElement.textContent = `${percentageCompleted.toFixed(0)}%`; 
    }

    // Si quieres mostrar el título con el límite diario
    // const chartTitleElement = document.getElementById('chart-title'); 
    // if (chartTitleElement) {
    //     chartTitleElement.textContent = `Límite de venta del día: ${dailySalesLimit.toFixed(0)}`;
    // }
});