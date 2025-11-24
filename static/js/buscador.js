document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Variables y Elementos del DOM ---
    const table = document.getElementById('myTable');
    const tbody = table.querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const rowsPerPageSelect = document.getElementById('rowsPerPage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbersSpan = document.getElementById('pageNumbers');
    const resumenForm = document.getElementById('resumen-form');

    const allRows = Array.from(tbody.querySelectorAll('tr'));
    let filteredRows = [...allRows];
    let currentPage = 1;
    let rowsPerPage = parseInt(rowsPerPageSelect.value, 10); // ✅ Especificar base decimal

    const employeeSelections = {};
    const STORAGE_KEY = 'employeeSelectionsData';

    // --- Funciones de LocalStorage ---
    function saveSelections() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(employeeSelections));
            console.log('Selecciones guardadas en localStorage.');
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
        }
    }

    function loadSelections() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const loadedSelections = JSON.parse(storedData);
                // Sobrescribir el objeto inicial con los datos cargados
                Object.assign(employeeSelections, loadedSelections);
                console.log('Selecciones cargadas de localStorage.');
            }
        } catch (e) {
            console.error('Error al cargar de localStorage:', e);
        }
    }
    // --- 2. Funciones de Lógica de Negocio ---
   function renderTable() {
        tbody.innerHTML = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedRows = filteredRows.slice(start, end);

        if (paginatedRows.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = `<td colspan="${table.querySelectorAll('th').length}" style="text-align: center; padding: 20px;">No se encontraron resultados.</td>`;
            tbody.appendChild(noResultsRow);
        } else {
            paginatedRows.forEach(row => {
                const employeeCedula = row.dataset.employeeCedula; // Usar cedula como clave
                const selections = employeeSelections[employeeCedula] || {};

                // ---  CORRECCIÓN CRÍTICA AQUÍ  ---

                // 1. Encontrar los checkboxes dentro de la fila (ROW) que se va a insertar
                // Es crucial usar .querySelector en la fila 'row'
                const lunchCheckbox = row.querySelector('[data-selection-type="lunch"]');
                const toGoCheckbox = row.querySelector('[data-selection-type="to_go"]');
                const coveredCheckbox = row.querySelector('[data-selection-type="covered"]');

                // 2. Aplicar el estado guardado a los checkboxes de la fila
                if (lunchCheckbox) {
                    lunchCheckbox.checked = selections.lunch === 'Si';
                }
                if (toGoCheckbox) {
                    toGoCheckbox.checked = selections.to_go === 'Si';
                }
                if (coveredCheckbox) {
                    coveredCheckbox.checked = selections.covered === 'Si';
                }
                // ----------------------------------------
                
                // 3. Insertar la fila actualizada en el tbody
                tbody.appendChild(row);
            });
        }
        updatePaginationControls();
    }
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        pageNumbersSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filteredRows = searchTerm === ''
            ? [...allRows]
            : allRows.filter(row =>
                Array.from(row.children).some(cell =>
                    cell.textContent.toLowerCase().includes(searchTerm)
                )
            );
        currentPage = 1;
        renderTable();
    }

    function handleRowsPerPageChange() {
        rowsPerPage = parseInt(rowsPerPageSelect.value, 10); // ✅ base decimal
        currentPage = 1;
        renderTable();
    }

    function handlePrevClick() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    }

    function handleNextClick() {
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    }

    // --- 3. Event Listeners ---
    searchInput.addEventListener('input', handleSearch);
    rowsPerPageSelect.addEventListener('change', handleRowsPerPageChange);
    prevBtn.addEventListener('click', handlePrevClick);
    nextBtn.addEventListener('click', handleNextClick);

    tbody.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const row = event.target.closest('tr');
            if (!row) return;

            const employeeIndex = row.dataset.employeeIndex;
            const employeeCedula = row.dataset.employeeCedula;
            const selectionType = event.target.dataset.selectionType;
            const isChecked = event.target.checked;

            if (!employeeIndex || !selectionType || !employeeCedula) return;

            if (!employeeSelections[employeeCedula]) {
                employeeSelections[employeeCedula] = {
                    name: row.dataset.employeeName,
                    cedula: employeeCedula,
                    lunch: 'No',
                    to_go: 'No',
                    covered: 'No'
                };
            }

            // Actualizar la selección
            employeeSelections[employeeCedula][selectionType] = isChecked ? 'Si' : 'No';
            
            saveSelections(); // ⬅️ GUARDAR CADA VEZ QUE HAY UN CAMBIO
        }
    });

    resumenForm.addEventListener('submit', (event) => {
        const oldInputs = resumenForm.querySelectorAll('input[name^="employees_"], input[name^="lunch_"], input[name^="to_go_"], input[name^="covered_"], input[name^="cedula_"], input[name^="employee_index_"], input[name="total_employees"], input[name="total_pago_general"]'); 
        oldInputs.forEach(input => input.remove());

        let employeeCount = 0;
        let i = 0;
        
        for (const cedula in employeeSelections) {
            // ... (Tu código existente para añadir empleados) ...
            const selection = employeeSelections[cedula];
            if (selection.lunch === 'Si' || selection.to_go === 'Si' || selection.covered === 'Si') {
                const fields = {
                    [`cedula_${i}`]: selection.cedula,
                    [`employees_${i}`]: selection.name,
                    [`employee_index_${i}`]: cedula,
                    [`lunch_${i}`]: selection.lunch,
                    [`to_go_${i}`]: selection.to_go,
                    [`covered_${i}`]: selection.covered
                };

                for (const [name, value] of Object.entries(fields)) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    resumenForm.appendChild(input);
                }

                i++;
                employeeCount++;
            }
        }
        const totalInput = document.getElementById('total');
        // 1. Agregar el conteo total de empleados (tu código existente)
        const totalEmployeesInput = document.createElement('input');
        totalEmployeesInput.type = 'hidden';
        totalEmployeesInput.name = 'total_employees';
        totalEmployeesInput.value = employeeCount;
        resumenForm.appendChild(totalEmployeesInput);
        
        const totalPagoInput = document.createElement('input');
        totalPagoInput.type = 'hidden';
        totalPagoInput.name = 'total_pago_general'; // Nombre del campo en el POST
        totalPagoInput.value = totalInput.value; // ✅ Ahora totalInput está disponible
        resumenForm.appendChild(totalPagoInput);
        console.log('Total Pago General añadido al formulario:', totalPagoInput.value);
    });

    loadSelections();
    renderTable();
});
