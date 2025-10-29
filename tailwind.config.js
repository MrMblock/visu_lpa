import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'noir': '#282828',
        'bleu-nuit': '#04014b',
        'bleu-foncé': '#354856',
        'bleu': '#23547B',
        'bleu-clair': '#a2c4e0',
        'orange': '#DA6220',
        'jaune': '#F7cb2d',
        'rose-pale': '#fbfcf5',
        'blanc': '#ffffff',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["light"],
  },
}

