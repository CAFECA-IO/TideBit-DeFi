/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {},
    fontSize: {
      xxs: ['10px', '12px'],
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['18px', '28px'],
      xl: ['20px', '28px'],
      '2xl': ['24px', '32px'],
      '3xl': ['30px', '36px'],
      '4xl': ['36px', '40px'],
      '5xl': ['48px', 1],
      '6xl': ['60px', 1],
      '7xl': ['72px', 1],
      '8xl': ['96px', 1],
      '9xl': ['128px', 1],
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        darkGray: '#161719',
        darkGray1: '#242A31',
        darkGray2: '#2B323A',
        lightGray: '#8B8E91',
        lightGray1: '#EDECEC',
        lightWhite: '#F2F2F2',
        tidebitTheme: '#29C1E1',
      },
      fontFamily: {
        barlow: ['Barlow', 'sans-serif', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        landingPageCta1: "url('~/public/elements/Group_15198@2x.png')",
      },
    },
  },
  plugins: [],
};
