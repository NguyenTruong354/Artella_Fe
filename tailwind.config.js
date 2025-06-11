/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
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
        },        'water-ripple': {
          '0%': { 
            transform: 'translate(-50%, -50%) scale(0)', 
            opacity: '0.9',  // Tăng từ 0.8 lên 0.9
            filter: 'blur(0px)'
          },
          '25%': { 
            opacity: '0.75', // Tăng từ 0.6 lên 0.75
            filter: 'blur(0.5px)'
          },
          '50%': { 
            opacity: '0.6',  // Tăng từ 0.4 lên 0.6
            transform: 'translate(-50%, -50%) scale(0.5)',
            filter: 'blur(1px)' 
          },
          '75%': { 
            opacity: '0.4',  // Tăng từ 0.2 lên 0.4
            filter: 'blur(1.5px)'
          },
          '100%': { 
            transform: 'translate(-50%, -50%) scale(1)', 
            opacity: '0',
            filter: 'blur(2px)' 
          }
        },
        'wave-wobble': {
          '0%, 100%': { 
            transform: 'translate(-50%, -50%) scale(1)',
            boxShadow: '0 0 15px 4px rgba(255, 255, 255, 0.25)'
          },
          '25%': { 
            transform: 'translate(-51%, -49%) scale(1.02)',  // Tăng từ 1.01 lên 1.02
            boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.3)' 
          },
          '50%': { 
            transform: 'translate(-50%, -51%) scale(0.98)',  // Giảm từ 0.99 xuống 0.98
            boxShadow: '0 0 15px 4px rgba(255, 255, 255, 0.25)' 
          },
          '75%': { 
            transform: 'translate(-49%, -50%) scale(1.02)',  // Tăng từ 1.01 lên 1.02
            boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.3)' 
          }
        },        'wave-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px 4px rgba(255, 255, 255, 0.25)'
          },
          '50%': {
            boxShadow: '0 0 25px 8px rgba(255, 255, 255, 0.4)'
          }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' }
        }},      animation: {
        'gentle-shine': 'gentle-shine 3s ease-in-out infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'gentle-levitate': 'gentle-levitate 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'tracking-in': 'tracking-in 0.8s ease-out',
        'fade-up': 'fade-up 0.8s ease-out',
        'slideInLeft': 'slideInLeft 0.8s ease-out',
        'slideInRight': 'slideInRight 0.8s ease-out',        'water-ripple': 'water-ripple 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards', // Tăng thời gian từ 2.2s lên 2.5s        'wave-wobble': 'wave-wobble 3s ease-in-out infinite',
        'wave-pulse': 'wave-pulse 2.5s ease-in-out infinite', // Tăng từ 2s lên 2.5s
        'ripple-opacity': 'ripple-opacity 3s ease-in-out infinite',
        'ripple-shimmer': 'ripple-shimmer 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'spin-reverse': 'spin-reverse 6s linear infinite'
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