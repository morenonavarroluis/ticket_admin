// La función principal que genera los grupos de input
function generarGrupoMenu(titulo, btnId, containerId) {
    const contenedorPrincipal = document.getElementById('container-grupos-menu');
    
    // Crear el título del grupo
    const tituloElemento = document.createElement('h5');
    tituloElemento.textContent = titulo;
    tituloElemento.className = 'text-lg font-semibold text-white mt-4';
    
    // Crear el div para el input principal y el botón
    const divMain = document.createElement('div');
    divMain.className = 'flex gap-2 p-2';

    const mainInput = document.createElement('input');
    mainInput.type = 'text';
    mainInput.className = 'dark:bg-gray-800 border border-blue-600 py-1 px-4 rounded-lg flex-1';

    const btnAgregar = document.createElement('button');
    btnAgregar.type = 'button';
    btnAgregar.textContent = '+';
    btnAgregar.id = btnId; // Asignar el ID al botón para el evento
    btnAgregar.className = 'border border-blue-600 rounded-md px-2';

    divMain.appendChild(mainInput);
    divMain.appendChild(btnAgregar);

    // Crear el div para los inputs agregados dinámicamente
    const divInputsAgregados = document.createElement('div');
    divInputsAgregados.id = containerId; // Asignar el ID al contenedor
    divInputsAgregados.className = 'flex flex-col px-3';
    
    // Añadir todos los elementos al contenedor principal
    contenedorPrincipal.appendChild(tituloElemento);
    contenedorPrincipal.appendChild(divMain);
    contenedorPrincipal.appendChild(divInputsAgregados);
    
    // Configurar la lógica para agregar inputs al contenedor secundario
    // Esta es la función que reutilizamos de la respuesta anterior
    agregarInputDinamico(btnId, containerId, mainInput);
}

// Función reutilizable para añadir inputs (la hemos mejorado para aceptar el input principal)
function agregarInputDinamico(btnId, containerId, mainInputElem) {
    const btnElem = document.getElementById(btnId);
    const itemContainer = document.getElementById(containerId);

    btnElem.addEventListener('click', e => {
        e.preventDefault();

        const inputValue = mainInputElem.value.trim();
        if (inputValue === '') {
            console.log('El campo principal no puede estar vacío.');
            return;
        }

        // Limite a 3 inputs en el contenedor secundario
        if (itemContainer.children.length >= 3) {
            console.log(`¡Se ha alcanzado el límite de 3 entradas para este grupo!`);
            return;
        }

        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'text';
        nuevoInput.value = inputValue;
        nuevoInput.name = `entradas`; // Nombre único para el envío del formulario
        nuevoInput.className = 'border dark:bg-gray-600 py-1 px-2 rounded-md dark:text-white mb-2';

        itemContainer.appendChild(nuevoInput);

        // Limpiar el input principal
        mainInputElem.value = '';
    });
}

// Llama a la función para cada grupo de menú que necesites
// Elige IDs únicos para los botones y los contenedores
generarGrupoMenu('Sopas', 'btnAgregar_sopa', 'agg_sopa');
generarGrupoMenu('Proteinas', 'btnAgregar_entradas', 'agg_entradas');
generarGrupoMenu('Contornos', 'btnAgregar_principales', 'agg_principales');
generarGrupoMenu('Postres', 'btnAgregar_postres', 'agg_postres');
generarGrupoMenu('Bebidas', 'btnAgregar_bebidas', 'agg_bebidas');
