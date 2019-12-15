module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.pug'],
    }),
    require('autoprefixer'),
    require('cssnano'),
  ],
};
