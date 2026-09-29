/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bank-blue': '#2563EB',
        'bank-dark-blue': '#1E3A8A',
        'bank-navy': '#0F172A',
        'bank-secondary': '#3B82F6',
        'bank-light-blue': '#EFF6FF',
        'bank-border': '#BFDBFE',
        'bank-bg': '#F8FAFC',
        'bank-card': '#FFFFFF',
        'bank-text': '#0F172A',
        'bank-text-secondary': '#64748B',
        'bank-text-muted': '#94A3B8',
        'bank-success': '#16A34A',
        'bank-warning': '#F59E0B',
        'bank-danger': '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
