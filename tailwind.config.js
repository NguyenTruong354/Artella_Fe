/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {      keyframes: {
        'gentle-shine': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' },
          '100%': { opacity: '1' }
        },
        'shine': {
          '100%': { transform: 'translateX(100%)' }
        },
        'gentle-levitate': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'tracking-in': {
          '0%': { letterSpacing: '0.5em', opacity: '0' },
          '100%': { letterSpacing: 'normal', opacity: '1' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slideInLeft': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slideInRight': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'water-ripple': {
          '0%': { 
            transform: 'translate(-50%, -50%) scale(0)', 
            opacity: '0.8' 
          },
          '25%': { 
            opacity: '0.6' 
          },
          '50%': { 
            opacity: '0.4',
            transform: 'translate(-50%, -50%) scale(0.5)' 
          },
          '75%': { 
            opacity: '0.2' 
          },
          '100%': { 
            transform: 'translate(-50%, -50%) scale(1)', 
            opacity: '0' 
          }
        },
        'wave-wobble': {
          '0%, 100%': { 
            transform: 'translate(-50%, -50%) scale(1)' 
          },
          '25%': { 
            transform: 'translate(-51%, -49%) scale(1.01)' 
          },
          '50%': { 
            transform: 'translate(-50%, -51%) scale(0.99)' 
          },
          '75%': { 
            transform: 'translate(-49%, -50%) scale(1.01)' 
          }
        }},      animation: {
        'gentle-shine': 'gentle-shine 3s ease-in-out infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'gentle-levitate': 'gentle-levitate 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'tracking-in': 'tracking-in 0.8s ease-out',
        'fade-up': 'fade-up 0.8s ease-out',
        'slideInLeft': 'slideInLeft 0.8s ease-out',
        'slideInRight': 'slideInRight 0.8s ease-out',
        'water-ripple': 'water-ripple 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'wave-wobble': 'wave-wobble 3s ease-in-out infinite'
      },
      translate: {
        '30': '7.5rem',
        '-30': '-7.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
    },
  plugins: [],
}