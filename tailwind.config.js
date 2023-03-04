/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'nonito': ['Nunito', 'sans-serif',],
        'open': ['Open Sans', 'sans-serif',],
        'popin': ['Poppins', 'sans-serif',],
      },
      colors:{
        heading: "#11175D",
        subheading: "#C3C5D7",
        inputBorder: "#11175D",
        buttorColor: "#5F35F5",
        loginHeading: "#03014C",
        loginbtn: "#5F34F5",
        rebbtn: "#FF0000",
        grcolor: "#008000",
      },
      screens: {
        sm: '375px',
        
      },
    },
  },
  plugins: [],
}
