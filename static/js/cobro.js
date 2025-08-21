document.addEventListener('DOMContentLoaded', function() {
  const tableRows = document.querySelectorAll('tbody tr');
  const precios = {
    almuerzo: 119.67,
    llevar: 15,
    cubiertos: 20
  };

  tableRows.forEach(row => {
    const almuerzoCheckbox = row.querySelector('td:nth-child(4) input[type="checkbox"]');
    const llevarCheckbox = row.querySelector('td:nth-child(5) input[type="checkbox"]');
    const cubiertosCheckbox = row.querySelector('td:nth-child(6) input[type="checkbox"]');
    

    const totalAlmuerzosSpan = row.querySelector('.total-almuerzos');
    const totalPagarSpan = row.querySelector('.total-a-pagar');

    // Función para actualizar los totales
    function actualizarTotales() {
      let totalAlmuerzos = 0;
      let totalPagar = 0;

      if (almuerzoCheckbox && almuerzoCheckbox.checked) {
        totalAlmuerzos++;
        totalPagar += precios.almuerzo;
      }
      if (llevarCheckbox && llevarCheckbox.checked) {
        totalPagar += precios.llevar;
      }
      if (cubiertosCheckbox && cubiertosCheckbox.checked) {
        totalPagar += precios.cubiertos;
      }

      totalAlmuerzosSpan.textContent = totalAlmuerzos;
      totalPagarSpan.textContent = `Bs. ${totalPagar.toFixed(2)}`;
    }

    // Escuchar los cambios en los checkboxes
    if (almuerzoCheckbox) almuerzoCheckbox.addEventListener('change', actualizarTotales);
    if (llevarCheckbox) llevarCheckbox.addEventListener('change', actualizarTotales);
    if (cubiertosCheckbox) cubiertosCheckbox.addEventListener('change', actualizarTotales);

    // Inicializar los totales
    actualizarTotales();
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const toggleCircle = document.getElementById('toggle-circle');

    toggleBtn.addEventListener('click', () => {
        // Alterna el color de fondo del botón
        toggleBtn.classList.toggle('bg-gray-300');
        toggleBtn.classList.toggle('bg-blue-600'); // Color activo

        // Alterna la posición del círculo
        toggleCircle.classList.toggle('translate-x-1');
        toggleCircle.classList.toggle('translate-x-6'); // Posición de activado
    });
});