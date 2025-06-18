/**
 * Style constants and theme configuration
 * Centralized styling values for consistency
 */

export const colors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  
  dark: '#0f172a',
  darkLight: '#1e293b',
  darkLighter: '#334155',
  
  gray: '#64748b',
  grayLight: '#94a3b8',
  grayLighter: '#cbd5e1',
  
  white: '#ffffff',
  black: '#000000'
} as const

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
  accent: `linear-gradient(135deg, ${colors.accent}, ${colors.success})`,
  dark: `linear-gradient(135deg, ${colors.dark}, ${colors.darkLight})`
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glow: `0 0 60px rgba(99, 102, 241, 0.3)`,
  card: '0 20px 40px rgba(99, 102, 241, 0.15), 0 0 60px rgba(99, 102, 241, 0.05)'
} as const

export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem'
} as const

export const borderRadius = {
  sm: '0.375rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px'
} as const

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out'
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70
} as const