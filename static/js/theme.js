// Este código es correcto y asume que la clase 'dark' está configurada en Tailwind.
function toggleDarkMode() {
    // Alterna la clase 'dark' en el elemento <html>
    document.documentElement.classList.toggle('dark'); 
    // Guarda la preferencia actual en el almacenamiento local
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Lógica de inicialización al cargar la página
const storedDarkMode = localStorage.getItem('darkMode');

if (storedDarkMode === 'true' || 
    (!storedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    // Aplica la clase 'dark' si estaba guardada o si el sistema operativo la prefiere
    document.documentElement.classList.add('dark');
}