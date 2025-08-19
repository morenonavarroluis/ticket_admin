 // Selecciona todos los elementos que tienen el atributo 'data-modal-target'
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    // Selecciona todos los elementos que tienen el atributo 'data-modal-hide'
    const closeModalButtons = document.querySelectorAll('[data-modal-hide]');

    // Función para abrir el modal
    function openModal(modal) {
      if (modal == null) return;
      modal.classList.remove('hidden');
    }

    // Función para cerrar el modal
    function closeModal(modal) {
      if (modal == null) return;
      modal.classList.add('hidden');
    }

    // Agrega el evento de clic a los botones que abren el modal
    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modalTarget);
        openModal(modal);
      });
    });

    // Agrega el evento de clic a los botones que cierran el modal
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modalHide);
        closeModal(modal);
      });
    });

    // Agrega el evento de clic en el fondo oscuro para cerrar el modal
    // Esto evita que se cierre si haces clic dentro del contenido del modal
    document.getElementById('miModal').addEventListener('click', (e) => {
        if (e.target.id === 'miModal') {
            closeModal(document.getElementById('miModal'));
        }
    });

