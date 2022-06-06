module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-light': '#4D966D',
        'green-hover': '#36AE7C',
      },
      backgroundImage: {
        default: "url('/images/backgroundImage.jpg')",
      },
    },
  },
  plugins: [],
};
