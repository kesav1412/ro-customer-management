/**
 * Centralized Theme Configuration
 * Modify colors here to change the entire application theme
 */

export const themeConfig = {
  // Light Mode Colors (HSL format: "hue saturation% lightness%")
  light: {
    // Base colors
    background: '0 0% 100%',        // White background
    foreground: '0 0% 3.9%',        // Almost black text
    
    // Card colors
    card: '0 0% 100%',              // White cards
    cardForeground: '0 0% 3.9%',    // Dark text on cards
    
    // Popover colors
    popover: '0 0% 100%',           // White popover
    popoverForeground: '0 0% 3.9%', // Dark text on popover
    
    // Primary brand colors (Main action buttons, links)
    primary: '221 83% 53%',         // Blue primary color
    primaryForeground: '0 0% 98%',  // White text on primary
    
    // Secondary colors (Less prominent actions)
    secondary: '210 40% 96.1%',     // Light blue-gray
    secondaryForeground: '222 47% 11%', // Dark blue text
    
    // Muted colors (Disabled states, subtle backgrounds)
    muted: '210 40% 96.1%',         // Light gray
    mutedForeground: '215 16% 47%', // Medium gray text
    
    // Accent colors (Hover states, highlights)
    accent: '210 40% 96.1%',        // Light accent
    accentForeground: '222 47% 11%', // Dark accent text
    
    // Destructive colors (Delete, error actions)
    destructive: '0 84.2% 60.2%',   // Red
    destructiveForeground: '0 0% 98%', // White text
    
    // Border and input colors
    border: '214 32% 91%',          // Light border
    input: '214 32% 91%',           // Light input border
    ring: '221 83% 53%',            // Focus ring (matches primary)
    
    // Chart colors (for data visualization)
    chart1: '221 83% 53%',          // Blue
    chart2: '142 76% 36%',          // Green
    chart3: '24 100% 50%',          // Orange
    chart4: '262 83% 58%',          // Purple
    chart5: '340 82% 52%',          // Pink
  },
  
  // Dark Mode Colors
  dark: {
    // Base colors
    background: '222 47% 11%',      // Dark blue-gray background
    foreground: '210 40% 98%',      // Light text
    
    // Card colors
    card: '222 47% 11%',            // Dark card
    cardForeground: '210 40% 98%',  // Light text on cards
    
    // Popover colors
    popover: '222 47% 11%',         // Dark popover
    popoverForeground: '210 40% 98%', // Light text
    
    // Primary brand colors
    primary: '217 91% 60%',         // Brighter blue for dark mode
    primaryForeground: '222 47% 11%', // Dark text on primary
    
    // Secondary colors
    secondary: '217 33% 17%',       // Dark blue-gray
    secondaryForeground: '210 40% 98%', // Light text
    
    // Muted colors
    muted: '217 33% 17%',           // Dark muted
    mutedForeground: '215 20% 65%', // Medium light text
    
    // Accent colors
    accent: '217 33% 17%',          // Dark accent
    accentForeground: '210 40% 98%', // Light text
    
    // Destructive colors
    destructive: '0 62.8% 30.6%',   // Darker red
    destructiveForeground: '210 40% 98%', // Light text
    
    // Border and input colors
    border: '217 33% 17%',          // Dark border
    input: '217 33% 17%',           // Dark input border
    ring: '224 64% 33%',            // Subtle focus ring
    
    // Chart colors (adjusted for dark mode)
    chart1: '217 91% 60%',          // Bright blue
    chart2: '142 70% 45%',          // Bright green
    chart3: '24 95% 58%',           // Bright orange
    chart4: '262 83% 68%',          // Bright purple
    chart5: '340 75% 62%',          // Bright pink
  },
  
  // Border radius
  radius: '0.5rem',
  
  // Brand colors (can be used directly in components)
  brand: {
    blue: '221 83% 53%',
    green: '142 76% 36%',
    orange: '24 100% 50%',
    red: '0 84.2% 60.2%',
    purple: '262 83% 58%',
    pink: '340 82% 52%',
  },
} as const;

/**
 * Generate CSS variables from theme config
 */
export function generateCSSVariables(mode: 'light' | 'dark') {
  const colors = themeConfig[mode];
  return {
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--card': colors.card,
    '--card-foreground': colors.cardForeground,
    '--popover': colors.popover,
    '--popover-foreground': colors.popoverForeground,
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground,
    '--secondary': colors.secondary,
    '--secondary-foreground': colors.secondaryForeground,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--destructive': colors.destructive,
    '--destructive-foreground': colors.destructiveForeground,
    '--border': colors.border,
    '--input': colors.input,
    '--ring': colors.ring,
    '--chart-1': colors.chart1,
    '--chart-2': colors.chart2,
    '--chart-3': colors.chart3,
    '--chart-4': colors.chart4,
    '--chart-5': colors.chart5,
    '--radius': themeConfig.radius,
  };
}

// Export theme presets for easy switching
export const themePresets = {
  default: themeConfig,
  
  // Ocean Blue Theme
  ocean: {
    ...themeConfig,
    light: {
      ...themeConfig.light,
      primary: '199 89% 48%',       // Ocean blue
      ring: '199 89% 48%',
    },
    dark: {
      ...themeConfig.dark,
      primary: '199 89% 58%',
      ring: '199 64% 38%',
    },
  },
  
  // Green/Nature Theme
  nature: {
    ...themeConfig,
    light: {
      ...themeConfig.light,
      primary: '142 76% 36%',       // Green
      ring: '142 76% 36%',
    },
    dark: {
      ...themeConfig.dark,
      primary: '142 70% 45%',
      ring: '142 64% 35%',
    },
  },
  
  // Purple Theme
  royal: {
    ...themeConfig,
    light: {
      ...themeConfig.light,
      primary: '262 83% 58%',       // Purple
      ring: '262 83% 58%',
    },
    dark: {
      ...themeConfig.dark,
      primary: '262 83% 68%',
      ring: '262 64% 48%',
    },
  },
};

export type ThemePreset = keyof typeof themePresets;
