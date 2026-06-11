/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal - solo colores sólidos
        primary: '#B7CD23',
        'primary-hover': '#A5B81F',
        secondary: '#D6B010',
        'secondary-hover': '#C09E0E',
        // Neutros
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
        // Estados
        success: '#10B981',
        'success-hover': '#0D9668',
        error: '#EF4444',
        'error-hover': '#DC2626',
        warning: '#F59E0B',
        'warning-hover': '#D97706',
        info: '#3B82F6',
        'info-hover': '#2563EB',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

