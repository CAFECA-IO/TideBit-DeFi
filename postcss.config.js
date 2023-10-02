// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // ...other PostCSS plugins,
    process.env.NODE_ENV === 'production' ? require('cssnano')({preset: 'default'}) : false,
  ].filter(Boolean), // This will remove any falsey values from the plugins array, which can be useful if you are conditionally adding plugins.
};
