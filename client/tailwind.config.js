/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        canvas: '#141210', // Deep warm espresso / dark charcoal canvas
        surface: '#1C1916', // Cards, modals, elevated surfaces
        'surface-subtle': '#27221C', // Hover rows, secondary buttons, active pills
        border: '#362E26', // Subtle dark dividers and card borders
        'border-strong': '#504437', // Focus boundaries, active borders, scrollbar thumb
        ink: {
          DEFAULT: '#F5EFE6', // Headings, primary text (crisp warm off-white)
          muted: '#C4B6A4', // Body text, descriptions (legible warm gray-beige)
          subtle: '#948675', // Metadata, secondary icons, timestamps
          faint: '#695E51', // Placeholders, disabled states
        },
        brand: {
          DEFAULT: '#D49D68', // Primary buttons, links, active accents (warm luminous amber/brass)
          hover: '#E2B17F', // Hover states
          light: '#2A2016', // Subtle brand pills, active tabs, badges
          border: '#543D27', // Badge outlines
        },
        espresso: '#0A0908', // Deepest dark sections, footer, hero panels
        brass: '#E0B873', // Premium accent: glowing dividers, icons, highlights
        accent: {
          DEFAULT: '#F59E0B', // In-progress / warm amber
          light: '#2A1F11',
          border: '#593E1B',
        },
        success: {
          DEFAULT: '#4ADE80', // Radiant forest green
          light: '#13281B',
          border: '#245233',
        },
        danger: {
          DEFAULT: '#F87171', // Warm crimson
          light: '#2E1414',
          border: '#5C2828',
        },
        info: {
          DEFAULT: '#60A5FA', // Warm slate blue / sky
          light: '#132438',
          border: '#244566',
        },
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
        card: '0 4px 16px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -2px rgba(0, 0, 0, 0.35)',
        lift: '0 16px 36px -8px rgba(0, 0, 0, 0.7), 0 6px 16px -4px rgba(0, 0, 0, 0.45)',
        'inset-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glow-brass': '0 0 24px -4px rgba(224, 184, 115, 0.25)',
        'glow-brand': '0 0 20px -3px rgba(212, 157, 104, 0.3)',
=======
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
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
<<<<<<< HEAD
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '350ms',
        slow: '800ms',
=======
      },
      transitionDuration: {
        fast: '200ms',
        base: '500ms',
        slow: '900ms',
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
<<<<<<< HEAD
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
=======
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
    },
  },
  plugins: [],
};
