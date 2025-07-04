/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'fundo-principal': '#1E1E1E',
        'fundo-card': '#161616',
        'texto-normal': '#EDEDED',
        'realce': '#A8FF36',
        'notificacao': '#FF16FA',
      },
      fontFamily: {
        sans: ['Geologia', ...defaultTheme.fontFamily.sans],
      },
      // ADICIONAMOS O NOVO BORDER RADIUS AQUI
      borderRadius: {
        '2xl': '20px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),

  ],
}