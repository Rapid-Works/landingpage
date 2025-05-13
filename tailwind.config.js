/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'bg-purple-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-rose-500',
    'bg-purple-100', 'text-purple-700', 'hover:text-purple-700', 'hover:bg-purple-50',
    'bg-blue-100', 'text-blue-700', 'hover:text-blue-700', 'hover:bg-blue-50',
    'bg-indigo-100', 'text-indigo-700', 'hover:text-indigo-700', 'hover:bg-indigo-50',
    'bg-orange-100', 'text-orange-700', 'hover:text-orange-700', 'hover:bg-orange-50',
    'bg-green-100', 'text-green-700', 'hover:text-green-700', 'hover:bg-green-50',
    'bg-rose-100', 'text-rose-700', 'hover:text-rose-700', 'hover:bg-rose-50',
  ],
}