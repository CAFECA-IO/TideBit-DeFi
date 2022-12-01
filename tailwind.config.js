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
      '3xs': ['8px', '12px'],
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
      gridTemplateColumns: {
        cryptoCard: 'repeat(200px, minmax(134px, 200px) 100px)',
      },
      borderWidth: {
        '0.5px': '0.5px',
      },
      maxWidth: {
        '100px': '100px',
        '160px': '160px',
        '200px': '200px',
        '250px': '250px',
        '350px': '350px',
      },
      spacing: {
        // width / height / padding / margin / top / bottom / right / left
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '5px': '5px',
        '10px': '10px',
        '15px': '15px',
        '20px': '20px',
        '23px': '23px',
        '28px': '28px',
        '30px': '30px',
        '32px': '32px',
        '40px': '40px',
        '42px': '42px',
        '44px': '44px',
        '45px': '45px',
        '46px': '46px',
        '47px': '47px',
        '48px': '48px',
        '50px': '50px',
        '55px': '55px',
        '81px': '81px',
        '83px': '83px',
        '100px': '100px',
        '120px': '120px',
        '134px': '134px',
        '160px': '160px',
        '150px': '150px',
        '158px': '158px',
        '180px': '180px',
        '200px': '200px',
        '220px': '220px',
        '271px': '271px',
        '285px': '285px',
        '300px': '300px',
        '320px': '320px',
        '354px': '354px',
        '372px': '372px',
        '410px': '410px',
        '438px': '438px',
        '450px': '450px',
        '600px': '600px',
        '2rem': '2rem',
        '3rem': '3rem',
        '4rem': '4rem',
        '5rem': '5rem',
        '6rem': '6rem',
        '7rem': '7rem',
        '8rem': '8rem',
        '9rem': '9rem',
        '11rem': '11rem',
        '13rem': '13rem',
        '15rem': '15rem',
        '20rem': '20rem',
        '479px': '479px',
        '1/2': '50%',
        '1/5': '20%',
        '2/5': '40%',
        '1/8': '12.5%',
        '1/10': '10%',
        '1/11': '9.09090909090909%',
        '2/11': '18.181818181818183%',
        '1/3': '33.333333%',
        '3/5': '60%',
      },
      margin: {
        '8px': '8px',
        '10px': '10px',
        '55px': '55px',
        '83px': '83px',
        '88px': '88px',
        '130px': '130px',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/5': '20%',
        '1/6': '16.666667%',
        '1/8': '12.5%',
        '1/10': '10%',
        '1/12': '8.333333%',
        '1/20': '5%',
        '1/25': '4%',
        '1/50': '2%',
      },
      padding: {
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/5': '20%',
        '1/6': '16.666667%',
        '1/8': '12.5%',
        '1/10': '10%',
        '1/12': '8.333333%',
        '1/20': '5%',
        '1/25': '4%',
        '1/50': '2%',
        '50px': '50px',
      },
      letterSpacing: {
        '0.02rem': '0.02rem',
      },
      width: {
        '5px': '5px',
        '479px': '479px',
        '1/10': '10%',
        '1/3': '33.333333%',
        '3/5': '60%',
      },
      backgroundImage: {
        banner1: "url('~/img/group_15199@2x.png)",
      },
      colors: {
        cuteBlue: '#A5C4F3',
        cuteBlue1: '#5895D9',
        cuteBlue2: '#527dc7',
        cuteBlue3: '#4165a3',
        cuteBlue4: '#057df5',

        darkGray: '#161719',
        darkGray1: '#242A31',
        darkGray2: '#2B323A',
        darkGray3: '#090909',
        darkGray4: '#181818',
        darkGray5: '#1E2329',

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

        lightRed3: '#E86D6D',
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
        fade: 'fadeOut 3s ease-in-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      // actual animation
      keyframes: theme => ({
        fadeOut: {
          '100%': {opacity: 0},
          '0%': {opacity: 1},
        },
        wiggle: {
          '0%, 100%': {transform: 'rotate(-3deg)'},
          '50%': {transform: 'rotate(3deg)'},
        },
      }),
    },
  },
  plugins: [],
};
