// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. AÑADE ESTA LÍNEA CLAVE PARA HABILITAR EL MODO OSCURO POR CLASE
  darkMode: 'class', 
  
  content: [
    './templates/**/*.html',
    './**/templates/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1E293B',
          200: '#0F172A',
        }
      },
    },
  },
  plugins: [],
}