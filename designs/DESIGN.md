---
name: Verdict Cyber-Corporate
colors:
  surface: '#11150d'
  surface-dim: '#11150d'
  surface-bright: '#363b31'
  surface-container-lowest: '#0b0f08'
  surface-container-low: '#191d15'
  surface-container: '#1d2118'
  surface-container-high: '#272b22'
  surface-container-highest: '#32362d'
  on-surface: '#e0e4d6'
  on-surface-variant: '#c1c9b5'
  inverse-surface: '#e0e4d6'
  inverse-on-surface: '#2e3229'
  outline: '#8b9381'
  outline-variant: '#42493a'
  surface-tint: '#95d960'
  primary: '#c7ff99'
  on-primary: '#193800'
  primary-container: '#a1e56b'
  on-primary-container: '#336600'
  inverse-primary: '#356b00'
  secondary: '#bbcbbc'
  on-secondary: '#26332a'
  secondary-container: '#3c4a3f'
  on-secondary-container: '#aab9ab'
  tertiary: '#ffe9f1'
  on-tertiary: '#4c223a'
  tertiary-container: '#ffc1df'
  on-tertiary-container: '#7b4b65'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b0f679'
  primary-fixed-dim: '#95d960'
  on-primary-fixed: '#0c2000'
  on-primary-fixed-variant: '#265100'
  secondary-fixed: '#d7e7d8'
  secondary-fixed-dim: '#bbcbbc'
  on-secondary-fixed: '#111e15'
  on-secondary-fixed-variant: '#3c4a3f'
  tertiary-fixed: '#ffd8e9'
  tertiary-fixed-dim: '#f2b5d3'
  on-tertiary-fixed: '#330d24'
  on-tertiary-fixed-variant: '#653851'
  background: '#11150d'
  on-background: '#e0e4d6'
  surface-variant: '#32362d'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  sub-headline:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '800'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin: 32px
---

## Brand & Style

This design system establishes a high-stakes, "Legal-Tech Neo-Cyberpunk" aesthetic. It merges the clinical precision of a top-tier law firm with the high-octane visual language of near-future data sovereignty. The brand personality is authoritative, clandestine, and hyper-efficient.

The style utilizes **Glassmorphism** as its primary structural language, layered over **High-Contrast** digital textures. The UI should evoke the feeling of a secure terminal used by a corporate adjudicator in a sprawling metropolis—where data streams and circuitry motifs represent the complex web of modern law. Visuals feature high-contrast professional portraiture with dramatic lighting, emphasizing the human element within a cold, digital architecture.

## Colors

The palette is anchored in a monochromatic "Digital Forest" spectrum. The base is a deep, near-black green (`#0A0E0B`) that provides a void-like depth, contrasted by a forest terminal green (`#132017`) for secondary surfaces.

The signature element is the vibrant neon yellow-green (`#A1E56B`), used sparingly but aggressively for headlines, interactive states, and thin structural borders. Text remains primarily white or light gray to ensure legal legibility, while the dark overlay is utilized to maintain focus during complex data visualizations.

## Typography

The typography system creates a sharp hierarchy between technical data and narrative content. **Space Grotesk** is used for headlines and labels to reinforce the futuristic, geometric tech aesthetic. Primary headlines are rendered in the neon accent color.

Sub-headlines are intentionally aggressive—extra-bold and italic—to command attention within dense legal documents. Body text utilizes **Inter** for its systematic clarity, but is styled in a light-weight italicized gray to mimic terminal readouts without sacrificing professional readability.

## Layout & Spacing

This design system uses a **Fixed Grid** model to mirror the rigidity of legal structures. A 12-column grid is standard for desktop, with elements strictly aligned to a 4px baseline shift. 

Spacing is rhythmic and mathematical. Large margins (`32px`) are used to separate major data containers, while tight gutters (`16px`) are used within the glassmorphism modules to keep related information dense and "encoded."

## Elevation & Depth

Depth is achieved through **Glassmorphism** and selective illumination. Surfaces do not use traditional shadows; instead, they utilize backdrop blurs (12px to 20px) and semi-transparent fills (`rgba(19, 32, 23, 0.6)`).

Elevation levels are indicated by border intensity:
- **Level 1 (Base):** Solid forest green background, no border.
- **Level 2 (Container):** Glass effect with a subtle 1px border in `rgba(161, 229, 107, 0.2)`.
- **Level 3 (Active/Modal):** Enhanced glass effect with a high-glow 1px border using the solid neon accent color.

Background textures featuring circuitry patterns or data streams should be placed on the lowest Z-index layer, visible only through the frosted glass of the UI containers.

## Shapes

The shape language is **Sharp (0)**. To maintain a "Cyber-Corporate" edge, all corners are 90-degree angles. This communicates precision, coldness, and architectural stability. 

Avoid all rounded corners on buttons, inputs, and cards. Where a "softer" touch is required, use 45-degree chamfered (clipped) corners rather than radii to maintain the technical, faceted appearance of the design system.

## Components

### Buttons
Primary buttons are solid neon yellow-green (`#A1E56B`) with black text. Secondary buttons are ghost-style with a 1px neon border and neon text. All buttons must have a sharp 0px border radius.

### Input Fields
Inputs feature a dark forest green background (`#132017`) and a bottom-only 1px neon border. When focused, the border glows and a faint scanline texture appears within the field.

### Cards & Containers
Containers utilize the glassmorphism effect. For legal "dossiers" or "case files," use a thin neon top-border to categorize the content.

### Data Stream Chips
Small, rectangular tags with monospaced labels. These should look like metadata tags on a terminal, using a dark green fill and neon text.

### Circuitry Dividers
Horizontal rules should not be simple lines. Instead, use a "data stream" divider—a 1px line that breaks into a small circuitry node or a series of binary-style dots at its center.

### Professional Portraiture
User and attorney profiles must use high-contrast photography. Apply a subtle green-tinted duotone filter or a high-key lighting effect to integrate the images into the dark, neon-lit environment.