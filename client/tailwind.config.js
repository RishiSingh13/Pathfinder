/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF9F6', // Warm, calm background
        surface: '#FFFFFF', // Clean surface card
        'surface-subtle': '#F4F3EF', // Elevated subtle neutral
        border: '#E4E2DC',
        'border-strong': '#D0CECA',
        ink: {
          DEFAULT: '#18181B', // Dark readable text
          muted: '#52525B',
          subtle: '#71717A',
          faint: '#A1A1AA',
        },
        brand: {
          DEFAULT: '#0F766E', // Restrained teal accent
          hover: '#115E59',
          light: '#F0FDFA',
          border: '#CCFBF1',
        },
        accent: {
          DEFAULT: '#D97706', // Warm amber for in-progress states
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        success: {
          DEFAULT: '#15803D',
          light: '#F0FDF4',
          border: '#BBF7D0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
