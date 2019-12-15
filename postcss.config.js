module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.pug'],
    }),
    require('autoprefixer'),
    require('cssnano'),
  ],
};
