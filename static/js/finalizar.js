document.getElementById('btn-finalizar').addEventListener('click', function() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción finalizará el pedido actual y limpiará los datos locales.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                '¡Finalizado!',
                'El pedido ha sido procesado',
                'success'
            ).then(() => {
                 localStorage.clear(); 
                 window.location.href = "/index";
            });
        }
    });
});