import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (from CSS variables)
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        // Secondary colors
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          light: 'var(--secondary-light)',
        },
        // Status colors
        success: {
          DEFAULT: 'var(--success)',
          light: 'var(--success-light)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          light: 'var(--warning-light)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          light: 'var(--danger-light)',
        },
        info: {
          DEFAULT: 'var(--info)',
          light: 'var(--info-light)',
        },
        // Background colors
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        // Text colors
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-inverse': 'var(--text-inverse)',
        // Border colors
        'border-light': 'var(--border-light)',
        'border-medium': 'var(--border-medium)',
        'border-dark': 'var(--border-dark)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}

export default config
