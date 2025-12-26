import { createTheme, ThemeOptions } from '@mui/material/styles';

// Orange color palette for RO water purifier theme
const orangePalette = {
  main: '#ea580c', // orange-600
  light: '#fb923c', // orange-400
  dark: '#c2410c', // orange-700
  contrastText: '#fff',
};

// Light theme configuration
const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: orangePalette,
    secondary: {
      main: '#64748b', // slate-500
      light: '#94a3b8',
      dark: '#475569',
    },
    success: {
      main: '#16a34a', // green-600
      light: '#22c55e',
      dark: '#15803d',
    },
    error: {
      main: '#dc2626', // red-600
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b', // amber-500
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0891b2', // cyan-600
      light: '#06b6d4',
      dark: '#0e7490',
    },
    background: {
      default: '#fff5f0', // light orange tint
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // slate-800
      secondary: '#64748b', // slate-500
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
};

// Dark theme configuration
const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#fb923c', // orange-400
      light: '#fdba74',
      dark: '#ea580c',
      contrastText: '#1e293b',
    },
    secondary: {
      main: '#94a3b8', // slate-400
      light: '#cbd5e1',
      dark: '#64748b',
    },
    success: {
      main: '#22c55e', // green-500
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444', // red-500
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#fbbf24', // amber-400
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    info: {
      main: '#06b6d4', // cyan-500
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b', // slate-800
    },
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#94a3b8', // slate-400
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  return createTheme(mode === 'light' ? lightTheme : darkTheme);
};
