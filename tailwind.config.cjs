module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ww-bg': '#FAFAF7',
        'ww-green': '#1FAD66'
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
