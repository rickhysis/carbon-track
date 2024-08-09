const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '.65rem',
      },

      keyframes: {
        fold: {
          '0%': {
            transform: 'rotateX(-180deg)'
          },
          '100%': {
            transform: 'rotateX(0deg)'
          },
          // 'transform-style': 'preserve-3d',
        },

        unfold: {
          '0%': {
            transform: 'rotateX(0deg)'
          },
          '100%': {
            transform: 'rotateX(180deg)'
          },
          // 'transform-style': 'preserve-3d',
        }
      },


      animation: {
        'fold-card': 'fold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal forwards',
        'unfold-card': 'unfold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}