/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {},
    content: {
      "''": '',
    },
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
      '5.5xl': ['54px', 1],
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
      textDecorationThickness: {
        2: '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '110': '110',
      },
      opacity: {'group-hover': '0.8', '0': '0'},
      visible: ['group-hover'],
      backgroundImage: {
        'reserve': "url('./public/elements/group_15244.svg')",
      },
      gridTemplateColumns: {
        cryptoCard: 'repeat(200px, minmax(134px, 200px) 100px)',
      },
      borderWidth: {
        '0.5px': '0.5px',
        '1px': '1px',
        '3px': '3px',
        '20px': '20px',
      },
      minWidth: {
        '120px': '120px',
      },
      maxWidth: {
        '100px': '100px',
        '160px': '160px',
        '200px': '200px',
        '250px': '250px',
        '350px': '350px',
        '3xs': '200px',
        '1200px': '1200px',
      },
      minHeight: {
        '140px': '140px',
        '420px': '420px',
        '600px': '600px',
      },
      maxHeight: {
        '600px': '600px',
      },
      boxShadow: {
        'top': '0 0 3px 5px rgba(0,0,0,0.6)',
      },
      spacing: {
        // width / height / padding / margin / top / bottom / right / left
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '5px': '5px',
        '10px': '10px',
        '12px': '12px',
        '14px': '14px',
        '15px': '15px',
        '16px': '16px',
        '17px': '17px',
        '18px': '18px',
        '19px': '19px',
        '20px': '20px',
        '21px': '21px',
        '22px': '22px',
        '23px': '23px',
        '24px': '24px',
        '25px': '25px',
        '26px': '26px',
        '27px': '27px',
        '28px': '28px',
        '30px': '30px',
        '32px': '32px',
        '33px': '33px',
        '34px': '34px',
        '35px': '35px',
        '36px': '36px',
        '37px': '37px',
        '38px': '38px',
        '39px': '39px',
        '40px': '40px',
        '42px': '42px',
        '44px': '44px',
        '45px': '45px',
        '46px': '46px',
        '47px': '47px',
        '48px': '48px',
        '50px': '50px',
        '52px': '52px',
        '53px': '53px',
        '54px': '54px',
        '55px': '55px',
        '56px': '56px',
        '57px': '57px',
        '58px': '58px',
        '59px': '59px',
        '60px': '60px',
        '61px': '61px',
        '62px': '62px',
        '63px': '63px',
        '64px': '64px',
        '65px': '65px',
        '69px': '69px',
        '70px': '70px',
        '71px': '71px',
        '72px': '72px',
        '73px': '73px',
        '74px': '74px',
        '75px': '75px',
        '76px': '76px',
        '77px': '77px',
        '80px': '80px',
        '81px': '81px',
        '82px': '82px',
        '83px': '83px',
        '85px': '85px',
        '88px': '88px',
        '90px': '90px',
        '95px': '95px',
        '98px': '98px',
        '100px': '100px',
        '105px': '105px',
        '110px': '110px',
        '120px': '120px',
        '122px': '122px',
        '125px': '125px',
        '130px': '130px',
        '134px': '134px',
        '140px': '140px',
        '144px': '144px',
        '150px': '150px',
        '158px': '158px',
        '160px': '160px',
        '180px': '180px',
        '190px': '190px',
        '200px': '200px',
        '210px': '210px',
        '220px': '220px',
        '240px': '240px',
        '250px': '250px',
        '254px': '254px',
        '255px': '255px',
        '271px': '271px',
        '278px': '278px',
        '280px': '280px',
        '285px': '285px',
        '290px': '290px',
        '296px': '296px',
        '300px': '300px',
        '310px': '310px',
        '320px': '320px',
        '330px': '330px',
        '340px': '340px',
        '350px': '350px',
        '354px': '354px',
        '360px': '360px',
        '370px': '370px',
        '372px': '372px',
        '400px': '400px',
        '410px': '410px',
        '420px': '420px',
        '430px': '430px',
        '438px': '438px',
        '440px': '440px',
        '450px': '450px',
        '475px': '475px',
        '479px': '479px',
        '480px': '480px',
        '500px': '500px',
        '505px': '505px',
        '510px': '510px',
        '520px': '520px',
        '530px': '530px',
        '540px': '540px',
        '549px': '549px',
        '550px': '550px',
        '555px': '555px',
        '560px': '560px',
        '565px': '565px',
        '570px': '570px',
        '580px': '580px',
        '590px': '590px',
        '600px': '600px',
        '620px': '620px',
        '630px': '630px',
        '640px': '640px',
        '650px': '650px',
        '660px': '660px',
        '700px': '700px',
        '726px': '726px',
        '768px': '768px',
        '900px': '900px',
        '1000px': '1000px',
        '1200px': '1200px',
        '1500px': '1500px',
        '2000px': '2000px',
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

        '0.5': '50%',
        '1/2': '50%',
        '1/4': '25%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/8': '12.5%',
        '3/8': '37.5%',
        '5/8': '62.5%',
        '7/8': '87.5%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '10/10': '100%',
        '1/11': '9.09090909090909%',
        '2/11': '18.181818181818183%',
        '10/11': '90.909%',
        '1/3': '33.333333%',
        '3/5': '60%',

        '80vh': '80vh',
        '95vh': '95vh',

        '70vw': '70vw',
        '80vw': '80vw',
        '85vw': '85vw',
        '90vw': '90vw',
        '95vw': '95vw',
        '100vw': '100vw',
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
        '1px': '1px',
        '5px': '5px',
        '479px': '479px',
        '1/10': '10%',
        '1/3': '33.333333%',
        '3/5': '60%',
      },
      borderRadius: {
        '10px': '10px',
        '12px': '12px',
      },
      rotate: {
        '35': '35deg',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
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
        darkGray6: '#121214',
        darkGray7: '#161719',
        darkGray8: '#2A3139',

        lightGray: '#8B8E91',
        lightGray1: '#EDECEC',
        lightGray3: '#404A55',

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
        lightGreen2: '#53AE94',

        lightOrange1: '#F5AC37',
        lightGreen3: '#66C8B6',
        lightGray4: '#8B8E91',
        lightYellow1: '#BA9F33',
        lightPink1: '#FF0A7A',
        lightGreen4: '#00EF8B',

        lightGreen5: '#17BF88',

        lightGray5: '#D4D4D4',
        lightYellow2: '#F8E71C',

        lightGreen6: '#41FEA2',
        lightBlue: '#4DBFFF',
        lightYellow3: '#F9C53D',
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
        fadeOut: 'fadeOut 3s ease-in-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        slightWiggle: 'slightWiggle 1s ease-in-out infinite',
        heartBeat: 'heartBeat 1s infinite',
        hflip: 'flipHorizontal 2s infinite',
        vflip: 'flipVertical 2s infinite',
        swing: 'swing 2s ease-out infinite',
        rubberBand: 'rubberBand 1s infinite',
        // flash: 'flash 2s infinite',
        flash: 'flash 1s infinite',
        headShake: 'headShake 2s infinite',
        wobble: 'wobble 1s infinite',
        jello: 'jello 2s infinite',
        openMenu: 'open-menu 0.5s ease-in-out forwards',
      },
      // actual animation
      keyframes: theme => ({
        fadeOut: {
          '100%': {opacity: 0},
          '0%': {opacity: 1},
        },
        slightBounce: {
          '0%, 100%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(-10px)'},
        },
        slightWiggle: {
          '0%, 100%': {transform: 'rotate(-1deg)'},
          '50%': {transform: 'rotate(1deg)'},
        },
        wiggle: {
          '0%, 100%': {transform: 'rotate(-3deg)'},
          '50%': {transform: 'rotate(3deg)'},
        },
        heartBeat: {
          '0%': {transform: 'scale(1);'},
          '14%': {transform: 'scale(1.3);'},
          '28%': {transform: 'scale(1);'},
          '42%': {transform: 'scale(1.3);'},
          '70%': {transform: 'scale(1);'},
        },
        flipHorizontal: {
          '50%': {transform: 'rotateY(180deg)'},
        },
        flipVertical: {
          '50%': {transform: 'rotateX(180deg)'},
        },
        swing: {
          '20%': {
            transform: 'rotate3d(0, 0, 1, 15deg)',
          },

          '40%': {
            transform: 'rotate3d(0, 0, 1, -10deg)',
          },

          '60%': {
            transform: 'rotate3d(0, 0, 1, 5deg)',
          },

          '80%': {
            transform: 'rotate3d(0, 0, 1, -5deg)',
          },
          to: {
            transform: 'rotate3d(0, 0, 1, 0deg)',
          },
        },
        rubberBand: {
          from: {
            transform: 'scale3d(1, 1, 1)',
          },

          '30%': {
            transform: 'scale3d(1.25, 0.75, 1)',
          },

          '40%': {
            transform: 'scale3d(0.75, 1.25, 1)',
          },

          '50%': {
            transform: 'scale3d(1.15, 0.85, 1)',
          },

          '65%': {
            transform: 'scale3d(0.95, 1.05, 1)',
          },

          '75%': {
            transform: 'scale3d(1.05, 0.95, 1)',
          },
          to: {
            transform: 'scale3d(1, 1, 1)',
          },
        },
        flash: {
          '25%, 40%': {opacity: '0'},
          // '50%': {opacity: '1'},
          // '75%': {opacity: '0'},
          '75%': {opacity: '1'},
        },
        headShake: {
          '0%': {
            transform: 'translateX(0)',
          },
          '6.5%': {
            transform: 'translateX(-6px) rotateY(-9deg)',
          },

          '18.5%': {
            transform: 'translateX(5px) rotateY(7deg)',
          },

          '31.5%': {
            transform: 'translateX(-3px) rotateY(-5deg)',
          },

          '43.5%': {
            transform: 'translateX(2px) rotateY(3deg)',
          },
          '50%': {
            transform: 'translateX(0)',
          },
        },
        wobble: {
          from: {
            transform: 'translate3d(0, 0, 0)',
          },

          '15%': {
            transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)',
          },

          '30%': {
            transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)',
          },

          '45%': {
            transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)',
          },

          '60%': {
            transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)',
          },

          '75%': {
            transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)',
          },

          to: {
            transform: 'translate3d(0, 0, 0)',
          },
        },
        jello: {
          'from, 11.1%,to': {
            transform: 'translate3d(0, 0, 0)',
          },

          '22.2%': {
            transform: 'skewX(-12.5deg) skewY(-12.5deg)',
          },

          '33.3%': {
            transform: 'skewX(6.25deg) skewY(6.25deg)',
          },

          '44.4%': {
            transform: 'skewX(-3.125deg) skewY(-3.125deg)',
          },

          '55.5%': {
            transform: 'skewX(1.5625deg) skewY(1.5625deg)',
          },

          '66.6%': {
            transform: 'skewX(-0.78125deg) skewY(-0.78125deg)',
          },

          '77.7%': {
            transform: 'skewX(0.390625deg) skewY(0.390625deg)',
          },

          '88.8%': {
            transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)',
          },
        },
        openMenu: {
          // '0%': {transform: 'scaleY(0)'},
          // '80%': {transform: 'scaleY(1.2)'},
          // '100%': {transform: 'scaleY(1)'},
          '0%, 20%': {transform: 'rotate(-3deg)'},
        },
      }),
    },
  },
};
