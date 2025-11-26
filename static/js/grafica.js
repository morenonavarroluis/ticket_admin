document.addEventListener('DOMContentLoaded', function() {
    
    // 1. OBTENER DATOS DINÁMICOS DEL HTML
    const jsonScriptTag = document.getElementById('orders-data');
    if (!jsonScriptTag) return;
    
    // El JSON está en una string, lo parseamos a un array de objetos
    const rawOrders = JSON.parse(jsonScriptTag.textContent);

    // =============================================================
    // 2. AGRUPAR Y SUMAR LOS DATOS POR MES
    // =============================================================
    
    // Objeto para almacenar la suma total por mes
   
    const dailySales = {};
    // Iterar sobre cada pedido
    rawOrders.forEach(order => {
      const dateString = order.date_order; 

    // Agrupamos por la fecha completa "YYYY-MM-DD"
    const fullDate = dateString ? dateString.substring(0, 10) : 'Unknown'; // <-- CAMBIO AQUÍ

    const amount = parseFloat(order.total_amount) || 0; 

    if (dailySales[fullDate]) { // <-- CAMBIO AQUÍ
        dailySales[fullDate] += amount;
    } else {
        dailySales[fullDate] = amount;
    }
    });

    // =============================================================
    // 3. PREPARAR DATOS FINALES PARA CHART.JS
    // =============================================================
    
    // Obtenemos los meses ordenados y los montos correspondientes
    const labels = Object.keys(dailySales).sort();
    const orderAmounts = labels.map(day => dailySales[day].toFixed(2));


    const ctx = document.getElementById('salesChart').getContext('2d');

    const salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            // Usamos las etiquetas (meses) extraídas dinámicamente
            labels: labels, 
            datasets: [
                {
                    label: 'Monto Total de Pedidos', 
                    data: orderAmounts, // Usamos los montos agrupados
                    borderColor: '#3b82f6', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                    tension: 0.4,
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                y: {
                    beginAtZero: true, // Mejor comenzar en cero para conteos
                    // min: 200, // Puedes eliminar min/max si quieres que Chart.js los calcule automáticamente
                    // max: 900, 
                    ticks: {
                        // stepSize: 100, 
                        color: 'rgb(107, 114, 128)' 
                    },
                    grid: {
                        color: 'rgba(107, 114, 128, 0.2)' 
                    }
                },
                x: {
                    grid: {
                        display: false 
                    },
                    ticks: {
                        color: 'rgb(107, 114, 128)' 
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        color: 'rgb(107, 114, 128)'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
});