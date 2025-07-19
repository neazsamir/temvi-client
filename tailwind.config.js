/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0cbcff',
        secondary: '#26d1e8',
        dark: '#989898',
        dark2: '#ededed'
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10%)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        leave: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.95) translateY(-10%)' },
        },
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        'enter': 'enter 0.3s ease-out',
        'leave': 'leave 0.2s ease-in forwards',
      },
      boxShadow: {
  		  'even-0': '0 0 2px rgba(0,0,0,0.2)',
  		  'even': '0 0 5px rgba(0,0,0,0.2)',
  		  'even-md': '0 0 10px rgba(0,0,0,0.4)',
  		  'even-lg': '0 0 20px rgba(0,0,0,0.5)',
  		},
    },
  },
  plugins: [
	],
}