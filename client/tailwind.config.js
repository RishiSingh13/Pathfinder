/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F3EDE4', // Page background (warm beige)
        surface: '#FBF8F3', // Cards, modals, inputs
        'surface-subtle': '#EAE2D6', // Hover rows, secondary buttons
        border: '#D9CDBB', // Default borders, dividers
        'border-strong': '#BFAE96', // Focus boundaries, scrollbar thumb
        ink: {
          DEFAULT: '#17120E', // Headings, primary text (rich black-brown)
          muted: '#4A3F35', // Body, descriptions
          subtle: '#7A6C5D', // Metadata, icons
          faint: '#A89A88', // Placeholders, disabled
        },
        brand: {
          DEFAULT: '#6B4A2F', // Primary buttons, links, active nav
          hover: '#523822', // Hover states
          light: '#F1E6D8', // Pills, active tabs, badges
          border: '#E0CDB3', // Badge outlines
        },
        espresso: '#14100C', // Dark sections, footer, hero panels, primary CTA alt
        brass: '#B08D57', // Premium accent: dividers, icons, highlights
        accent: {
          DEFAULT: '#B45309', // In-progress / warm amber
          light: '#FBF1E0',
          border: '#EBCFA0',
        },
        success: {
          DEFAULT: '#3F6B3A', // Muted forest green
          light: '#EEF3E8',
          border: '#C9DBBE',
        },
        danger: {
          DEFAULT: '#A8322A', // Warm muted crimson
          light: '#F9ECE9',
          border: '#E8C3BD',
        },
        info: {
          DEFAULT: '#3C5A78', // Warm slate blue
          light: '#EAF0F5',
          border: '#C3D3E2',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,29,16,.06), 0 1px 1px rgba(43,29,16,.04)',
        card: '0 4px 12px -2px rgba(43,29,16,.10), 0 2px 4px -2px rgba(43,29,16,.06)',
        lift: '0 16px 32px -8px rgba(43,29,16,.18), 0 6px 12px -4px rgba(43,29,16,.10)',
        'inset-glow': 'inset 0 1px 0 rgba(255,255,255,.6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '500ms',
        slow: '900ms',
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
    },
  },
  plugins: [],
};
