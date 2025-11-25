/**
 * Crea la estructura principal de un grupo de menú (Título, Input principal y Botón Agregar)
 * y configura la lógica para añadir inputs dinámicamente.
 * @param {string} titulo - Título del grupo (ej: 'Sopas').
 * @param {string} btnId - ID que se asignará al botón de agregar (+).
 * @param {string} containerId - ID que se asignará al contenedor donde irán los inputs dinámicos.
 * @param {string} inputName - El atributo 'name' para los inputs generados.
 */
function generarGrupoMenu(titulo, btnId, containerId, inputName) {
    // 1. Obtener el contenedor principal. Debe existir en el HTML.
    const contenedorPrincipal = document.getElementById('container-grupos-menu');
    if (!contenedorPrincipal) {
        console.error("Error: El contenedor principal 'container-grupos-menu' no se encontró en el DOM.");
        return;
    }

    // 2. Crear el contenedor del grupo
    const grupoContenedor = document.createElement('div');
    // Aplicamos estilos de Tailwind CSS
    grupoContenedor.className = 'flex flex-col flex-1 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-md';

    // 3. Crear el título del grupo
    const tituloElemento = document.createElement('h5');
    tituloElemento.textContent = titulo;
    tituloElemento.className = 'text-xl font-bold text-gray-800 dark:text-white mb-3 capitalize border-b border-blue-600 pb-2';

    // 4. Crear el contenedor para el input principal y el botón (+)
    const divMain = document.createElement('div');
    divMain.className = 'flex gap-2 items-center';

    // 5. Crear el INPUT PRINCIPAL (Faltaba definirlo)
    const mainInput = document.createElement('input');
    mainInput.type = 'text';
    mainInput.placeholder = `Añadir ${titulo} principal...`;
    mainInput.className = 'dark:bg-gray-800 border border-blue-600 py-2 px-4 rounded-lg flex-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100';
    mainInput.name = inputName; // Asignamos el nombre

    // 6. Botón de Agregar (+)
    const btnAgregar = document.createElement('button');
    btnAgregar.type = 'button';
    btnAgregar.textContent = '+';
    btnAgregar.id = btnId; // Asignar el ID al botón para el evento
    btnAgregar.className = 'bg-blue-600 text-white font-bold text-xl h-10 w-10 rounded-full hover:bg-blue-700 transition duration-150 shadow-lg';

    // 7. Contenedor para los inputs agregados dinámicamente
    const divInputsAgregados = document.createElement('div');
    divInputsAgregados.id = containerId; // Asignar el ID para que 'agregarInputDinamico' lo encuentre
    divInputsAgregados.className = 'mt-3 flex flex-col gap-2';

    // 8. Ensamblar los elementos
    divMain.appendChild(mainInput);
    divMain.appendChild(btnAgregar);

    grupoContenedor.appendChild(tituloElemento);
    grupoContenedor.appendChild(divMain);
    grupoContenedor.appendChild(divInputsAgregados);

    contenedorPrincipal.appendChild(grupoContenedor);

    // 9. Configurar la lógica para agregar inputs al contenedor secundario
    // Pasamos el ID del botón y el ID del contenedor de ítems.
    agregarInputDinamico(btnId, containerId, inputName);
}


/**
 * Configura el evento click para añadir un nuevo input de texto al contenedor especificado.
 * @param {string} btnId - El ID del botón que dispara la adición.
 * @param {string} containerId - El ID del contenedor donde se añadirán los nuevos inputs.
 * @param {string} inputName - El atributo 'name' para los inputs generados.
 */
function agregarInputDinamico(btnId, containerId, inputName) {
    const btnElem = document.getElementById(btnId);
    const itemContainer = document.getElementById(containerId);

    if (!btnElem || !itemContainer) {
        console.error(`Error: Elemento de botón con ID ${btnId} o contenedor con ID ${containerId} no encontrado.`);
        return;
    }

    btnElem.addEventListener('click', e => {
        // Límite de 2 inputs adicionales (3 en total contando el principal)
        if (itemContainer.children.length >= 2) {
            console.log(`¡Se ha alcanzado el límite de 3 entradas para este grupo!`);
            alert(`¡Se ha alcanzado el límite de 3 entradas para este grupo!`);
            return;
        }

        // 1. Crear el nuevo input
        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'text';
        nuevoInput.placeholder = `Otro ${inputName}...`;
        nuevoInput.className = 'dark:bg-gray-800 border border-gray-400 py-2 px-4 rounded-lg flex-1 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-100';
        nuevoInput.name = inputName; // Asignamos el mismo nombre para que se envíe como array/lista

        // 2. Crear un botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.textContent = 'x';
        btnEliminar.className = 'bg-red-500 text-white font-bold h-10 w-10 rounded-full hover:bg-red-600 transition duration-150';
        btnEliminar.addEventListener('click', () => {
            inputWrapper.remove(); // Elimina el contenedor del input y el botón 'x'
        });

        // 3. Crear un contenedor para el input y el botón de eliminar (para el 'flex')
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'flex gap-2 items-center';

        inputWrapper.appendChild(nuevoInput);
        inputWrapper.appendChild(btnEliminar);

        // 4. Añadir el wrapper al contenedor
        itemContainer.appendChild(inputWrapper);

        // Ya no es necesario limpiar el input principal aquí, porque estamos añadiendo inputs *adicionales*.
        // La lógica de limpiar el input principal (mainInputElem.value = '';) se eliminó de la función.
    });
}

// Inicializar todos los grupos de menú
generarGrupoMenu('sopas', 'btnAgregar_sopa', 'container_sopas', 'sopas');
generarGrupoMenu('proteinas', 'btnAgregar_proteinas', 'container_proteinas', 'proteinas');
generarGrupoMenu('contornos', 'btnAgregar_contornos', 'container_contornos', 'contornos');
generarGrupoMenu('postres', 'btnAgregar_postres', 'container_postres', 'postres');
generarGrupoMenu('bebidas', 'btnAgregar_bebidas', 'container_bebidas', 'bebidas');
generarGrupoMenu('ensaladas', 'btnAgregar_ensaladas', 'container_ensaladas', 'ensaladas');