# Theme Configuration Guide

## 📁 Centralized Theme Management

All colors and theme settings are now managed in a single file:

**`src/config/theme.config.ts`** - Your one-stop file for all color customization

## 🎨 How to Change Colors

### Method 1: Edit the Default Theme

Open `src/config/theme.config.ts` and modify the color values:

```typescript
export const themeConfig = {
  light: {
    // Change primary brand color (buttons, links, etc.)
    primary: '221 83% 53%',  // ← Edit this value
    
    // Change background color
    background: '0 0% 100%',  // ← Edit this value
    
    // And all other colors...
  },
  
  dark: {
    // Same colors for dark mode
    primary: '217 91% 60%',  // ← Edit this value
    // ...
  }
}
```

### Method 2: Use Built-in Presets

The theme config includes ready-to-use presets:

- **Default** - Blue theme (default)
- **Ocean** - Ocean blue theme
- **Nature** - Green/nature theme
- **Royal** - Purple theme

To switch presets, you can modify the ThemeContext or create a theme switcher component.

## 🔢 Understanding HSL Color Format

Colors are in HSL format: `"hue saturation% lightness%"`

- **Hue** (0-360): The color type
  - 0 = Red
  - 120 = Green
  - 240 = Blue
  - 300 = Purple
- **Saturation** (0-100%): Color intensity
  - 0% = Gray
  - 100% = Full color
- **Lightness** (0-100%): How light/dark
  - 0% = Black
  - 50% = Pure color
  - 100% = White

### Examples:
```typescript
'221 83% 53%'  // Bright blue
'142 76% 36%'  // Green
'0 84% 60%'    // Red
'262 83% 58%'  // Purple
```

## 🎯 Color Reference Guide

### Base Colors
- **background** - Main page background
- **foreground** - Main text color
- **card** - Card backgrounds
- **cardForeground** - Text on cards

### Brand Colors
- **primary** - Main brand color (buttons, links)
- **primaryForeground** - Text on primary elements
- **secondary** - Secondary actions
- **secondaryForeground** - Text on secondary elements

### State Colors
- **muted** - Disabled/subtle elements
- **mutedForeground** - Disabled text
- **accent** - Hover states, highlights
- **accentForeground** - Text on accents
- **destructive** - Delete/error actions
- **destructiveForeground** - Text on destructive elements

### UI Elements
- **border** - Border color
- **input** - Input field borders
- **ring** - Focus ring color

### Charts
- **chart1** through **chart5** - Data visualization colors

## 📝 Quick Color Change Examples

### Example 1: Change to Green Theme
```typescript
light: {
  primary: '142 76% 36%',        // Green
  ring: '142 76% 36%',
}
```

### Example 2: Change to Purple Theme
```typescript
light: {
  primary: '262 83% 58%',        // Purple
  ring: '262 83% 58%',
}
```

### Example 3: Darker Background (Light Mode)
```typescript
light: {
  background: '0 0% 96%',        // Light gray instead of white
}
```

### Example 4: Adjust Button Colors
```typescript
light: {
  primary: '199 89% 48%',        // Ocean blue buttons
  primaryForeground: '0 0% 100%', // White text
}
```

## 🔄 Apply Changes

After editing `theme.config.ts`:

1. Save the file
2. The changes will automatically apply after rebuild
3. No need to touch CSS files or Tailwind config

## 🚀 Advanced: Creating Custom Presets

Add your own theme preset in `theme.config.ts`:

```typescript
export const themePresets = {
  // ... existing presets
  
  // Your custom theme
  myTheme: {
    ...themeConfig,
    light: {
      ...themeConfig.light,
      primary: 'YOUR HSL VALUES',
      // ... customize other colors
    },
    dark: {
      ...themeConfig.dark,
      primary: 'YOUR HSL VALUES',
      // ... customize other colors
    },
  },
};
```

## 🛠️ Tools for Finding HSL Colors

1. **Online HSL Color Picker**: https://hslpicker.com/
2. **Convert HEX to HSL**: https://www.rapidtables.com/convert/color/hex-to-hsl.html
3. **Chrome DevTools**: Inspect element > Color picker > HSL mode

## 📍 Files You Should Edit

**✅ DO EDIT:**
- `src/config/theme.config.ts` - All color customization

**❌ DON'T EDIT (unless you know what you're doing):**
- `src/index.css` - Auto-generated from theme.config
- `tailwind.config.js` - Uses CSS variables
- `src/contexts/ThemeContext.tsx` - Theme switching logic

## 🎨 Color Palette Generator

If you need a complete color palette, try:
- https://coolors.co/
- https://mycolor.space/
- https://paletton.com/

Convert the generated colors to HSL format and add them to your theme config.

## 💡 Tips

1. **Keep contrast in mind**: Ensure text is readable on backgrounds
2. **Test both modes**: Check light and dark mode after changes
3. **Use brand colors**: Match your company's brand guidelines
4. **Consistent rings**: Focus ring should match or complement primary color
5. **Chart colors**: Should be distinct and work in both modes

## 🐛 Troubleshooting

**Colors not updating?**
1. Check if you saved `theme.config.ts`
2. Rebuild the project: `npm run dev`
3. Clear browser cache
4. Check CSS variables in DevTools

**Wrong color format?**
- Use HSL format: `'hue saturation% lightness%'`
- Include the percentage signs
- Use single quotes
- Example: `'221 83% 53%'` ✅
- Not: `221, 83, 53` ❌

## 📚 Example Color Schemes

### Professional Blue
```typescript
primary: '221 83% 53%'     // Blue
secondary: '210 40% 96%'   // Light gray
accent: '199 89% 48%'      // Cyan
```

### Nature Green
```typescript
primary: '142 76% 36%'     // Green
secondary: '45 93% 47%'    // Yellow
accent: '171 77% 36%'      // Teal
```

### Bold Purple
```typescript
primary: '262 83% 58%'     // Purple
secondary: '291 64% 42%'   // Deep purple
accent: '326 78% 54%'      // Pink
```

---

**Need help?** Check the theme.config.ts file for detailed comments and examples.
