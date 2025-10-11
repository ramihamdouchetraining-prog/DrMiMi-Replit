/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fun': ['Comic Sans MS', 'Chalkboard SE', 'cursive'],
        'magic': ['Pacifico', 'cursive'],
      },
      colors: {
        'pink': {
          'light': '#FFB6C1',
          'medium': '#FF69B4',
          'dark': '#C71585',
        },
        'purple': {
          'light': '#DDA0DD',
          'medium': '#DA70D6',
          'dark': '#9370DB',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
