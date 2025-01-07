function preloader(){
    window.addEventListener('load', function () {
        const preloader = document.getElementById('preloader');
        const mainContent = document.getElementById('main-content');

        // Mostrar contenido principal antes de ocultar el preloader
        setTimeout(() => {
            mainContent.style.visibility = 'visible'; // Hacer visible el contenido
            mainContent.style.opacity = '1'; // Aparecer suavemente
            preloader.style.opacity = '0'; // Desvanecer el preloader
            preloader.style.transition = 'opacity 0.5s ease'; // Transición de opacidad

            // Retirar completamente el preloader
            setTimeout(() => {
                preloader.style.display = 'none'; // Eliminar preloader del flujo
                document.body.style.overflow = 'auto'; // Reactivar scroll
            }, 500); // Tiempo de fadeOut
        }, 2000); // Mantener visible el preloader durante 2 segundos
    });
}

preloader()

function wathsapp(){
    const whatsappButton = document.getElementById('whatsappButton');
    const whatsappMenu = document.getElementById('whatsappMenu');

    whatsappButton.addEventListener('click', () => {
        whatsappMenu.classList.toggle('active'); // Alterna la clase "active" para mostrar/ocultar
    });

    // Opcional: Cierra el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!whatsappMenu.contains(event.target) && !whatsappButton.contains(event.target)) {
            whatsappMenu.classList.remove('active');
        }
    });
}

wathsapp()
