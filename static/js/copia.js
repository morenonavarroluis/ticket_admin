// Función para eliminar un input dinámico
function eliminarInput(btnEliminar) {
    // El padre del botón de eliminar es el div que contiene al input y al botón
    const inputWrapper = btnEliminar.parentElement; 
    // El padre del wrapper es el contenedor de inputs agregados
    const itemContainer = inputWrapper.parentElement; 

    // Eliminar el contenedor completo (input + botón)
    if (itemContainer && inputWrapper) {
        itemContainer.removeChild(inputWrapper);
    }
}

// Función principal que genera los grupos de input (Modificada)
function generarGrupoMenu(titulo, btnAgregarId, containerId, inputName) {
    const contenedorPrincipal = document.getElementById('container-grupos-menu');
    
    // ... (Creación del contenedor principal y título - Sin cambios)
    const grupoContenedor = document.createElement('div');
    grupoContenedor.className = 'flex flex-col flex-1';

    const tituloElemento = document.createElement('h5');
    tituloElemento.textContent = titulo;
    tituloElemento.className = 'text-lg font-semibold dark:text-white mt-4 capitalize';

    // Crear el div para el input principal y los botones (+ y - para agregar/quitar del main input)
    const divMain = document.createElement('div');
    divMain.className = 'flex gap-2 p-2';

    const mainInput = document.createElement('input');
    mainInput.type = 'text';
    mainInput.className = 'dark:bg-gray-800 border border-blue-600 py-1 px-4 rounded-lg flex-1';
    mainInput.name = inputName; // Asignamos el nombre al input principal

    // Botón de Agregar (+)
    const btnAgregar = document.createElement('button');
    btnAgregar.type = 'button';
    btnAgregar.textContent = '+';
    btnAgregar.id = btnAgregarId; // Usamos el ID de agregar
    btnAgregar.className = 'border border-blue-600 rounded-md px-2';
    
    // Opcional: Botón de Quitar (Si quieres un botón para borrar el input principal, si no, puedes quitar esta parte)
    // Dejaré el botón de quitar solo en los inputs dinámicos para simplificar.

    divMain.appendChild(mainInput);
    divMain.appendChild(btnAgregar); 
    // Eliminamos la creación incorrecta del botón quitar del inicio de la función

    // Crear el div para los inputs agregados dinámicamente
    const divInputsAgregados = document.createElement('div');
    divInputsAgregados.id = containerId; // Asignar el ID al contenedor
    divInputsAgregados.className = 'flex flex-col px-3';
    
    // Añadir todos los elementos al contenedor del grupo
    grupoContenedor.appendChild(tituloElemento);
    grupoContenedor.appendChild(divMain);
    grupoContenedor.appendChild(divInputsAgregados);
    
    // Añadir el contenedor del grupo al contenedor principal del formulario
    contenedorPrincipal.appendChild(grupoContenedor);
    
    // Configurar la lógica para agregar inputs al contenedor secundario
    agregarInputDinamico(btnAgregarId, containerId, mainInput, inputName);
}

// Función reutilizable para añadir inputs (Modificada)
function agregarInputDinamico(btnAgregarId, containerId, mainInputElem, inputName) {
    const btnElem = document.getElementById(btnAgregarId);
    const itemContainer = document.getElementById(containerId);

    btnElem.addEventListener('click', e => {
        e.preventDefault();

        const inputValue = mainInputElem.value.trim();
        if (inputValue === '') {
            console.log('El campo principal no puede estar vacío.');
            return;
        }

        // Limite a 3 inputs en el contenedor secundario (Si se quiere 3 inputs TOTAL, cambia el 2 por 3)
        if (itemContainer.children.length >= 3) { 
            console.log(`¡Se ha alcanzado el límite de 3 entradas para este grupo!`);
            return;
        }
        
        // **1. Crear un contenedor (wrapper) para el input y el botón de quitar**
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'flex gap-2 mb-2 items-center';

        // **2. Crear el input**
        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'text';
        nuevoInput.value = inputValue;
        nuevoInput.name = inputName + '[]'; // Usar [] para enviar múltiples valores en el formulario
        nuevoInput.readOnly = true; // Opcional: hacerlo de solo lectura después de agregarse
        nuevoInput.className = 'border dark:bg-gray-600 py-1 px-2 rounded-md dark:text-white flex-1';

        // **3. Crear el botón de quitar**
        const btnQuitar = document.createElement('button');
        btnQuitar.type = 'button';
        btnQuitar.textContent = '-';
        btnQuitar.className = 'border border-red-600 bg-red-500 text-white rounded-md px-2 h-full';
        
        // **4. Asignar el evento de eliminación**
        btnQuitar.addEventListener('click', () => {
            eliminarInput(btnQuitar);
        });

        // **5. Añadir el input y el botón al wrapper**
        inputWrapper.appendChild(nuevoInput);
        inputWrapper.appendChild(btnQuitar);
        
        // **6. Añadir el wrapper al contenedor de items**
        itemContainer.appendChild(inputWrapper);

        // Limpiar el input principal
        mainInputElem.value = '';
    });
}

// Llama a la función para cada grupo de menú que necesites
// Asegúrate de que el elemento 'container-grupos-menu' exista en tu HTML
generarGrupoMenu('sopas', 'btnAgregar_sopa', 'container_sopas_items', 'sopas');
generarGrupoMenu('proteinas', 'btnAgregar_proteinas', 'container_proteinas_items', 'proteinas');
generarGrupoMenu('contornos', 'btnAgregar_contornos', 'container_contornos_items', 'contornos');
generarGrupoMenu('postres', 'btnAgregar_postres', 'container_postres_items', 'postres');
generarGrupoMenu('bebidas', 'btnAgregar_bebidas', 'container_bebidas_items', 'bebidas');
generarGrupoMenu('ensaladas', 'btnAgregar_ensaladas', 'container_ensaladas_items', 'ensaladas');