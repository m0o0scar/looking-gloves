/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
  theme: {
    extend: {
      keyframes: {
        rotate3d: {
          '0%': { transform: 'perspective(30px) rotateY(-45deg)' },
          '50%': { transform: 'perspective(30px) rotateY(0deg)' },
          '100%': { transform: 'perspective(30px) rotateY(45deg)' },
        }
      },
      animation: {
        rotate3d: 'rotate3d 2s ease-in-out infinite alternate',
      }
    }
  }
};
