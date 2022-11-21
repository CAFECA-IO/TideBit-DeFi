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
      xxs: '370px',
      xs: '500px',
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
      '3xl': '1600px',
    },
    extend: {
      padding: {
        '1/3': '33.333333%',
        '2/3': '66.666667%',
      },
      backgroundImage: {
        banner1: "url('~/img/group_15199@2x.png)",
      },
      colors: {
        darkGray: '#161719',
        darkGray1: '#242A31',
        darkGray2: '#2B323A',

        lightGray: '#8B8E91',
        lightGray1: '#EDECEC',

        lightWhite: '#F2F2F2',
        tidebitTheme: '#29C1E1',

        lightGreen: '#1AE2A0',
        lightRed: '#E86D6D',

        bluePurple: '#627eea',
        lightOrange: '#F7931A',
        lightGray2: '#BEBEBE',
        lightPurple: '#8247E5',
        lightYellow: '#F0B90B',
        lightPurple2: '#8578DB',
        lightRed1: '#F30504',
        lightPink: '#E60B7A',
        lightGreen1: '#3CC8C8',
        lightRed2: '#E84142',
      },
      fontFamily: {
        barlow: ['Barlow', 'sans-serif', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        landingPageCta1: "url('~/public/elements/Group_15198@2x.png')",
      },
      // animation class
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 1s linear infinite',
        fade: 'fadeIn 3s ease-in-out',
      },
      // actual animation
      keyframes: theme => ({
        fadeIn: {
          '100%': {opacity: 0},
          '0%': {opacity: 1},
        },
      }),
    },
  },
  plugins: [],
};
