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

    
    let totalVendido = 0;
    if (totalDailyLimit > 0) {
        totalVendido =  totalDailyLimit - totalSold ;
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
                        padding: 20,
                        // Función para personalizar el texto de la leyenda (mostrar porcentaje correcto)
                        color: 'rgb(107, 114, 128)' // Color del texto de la leyenda
                    }
                },
                tooltip: {

                    enabled: true 
                    
                }
            }
        }
    });

    
    const percentageValueElement = document.getElementById('percentageValue');
    if (percentageValueElement) {
        percentageValueElement.textContent = `${totalVendido.toFixed(0)}`; 
    }

 
    // const chartTitleElement = document.getElementById('chart-title'); 
    // if (chartTitleElement) {
    //     chartTitleElement.textContent = `Limite de venta del dia ${totalDailyLimit.toFixed(0)}`;
    // }
});