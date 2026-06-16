---
name: 'Electric Pulse: Daybreak Edition'
colors:
  surface: '#fef7ff'
  surface-dim: '#dfd7e8'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1ff'
  surface-container: '#f3ebfc'
  surface-container-high: '#ede5f6'
  surface-container-highest: '#e7dff0'
  on-surface: '#1d1a25'
  on-surface-variant: '#4a4457'
  inverse-surface: '#332e3b'
  inverse-on-surface: '#f6edff'
  outline: '#7b7489'
  outline-variant: '#ccc3da'
  surface-tint: '#7212ff'
  primary: '#5400c3'
  on-primary: '#ffffff'
  primary-container: '#7000ff'
  on-primary-container: '#ddcdff'
  inverse-primary: '#d1bcff'
  secondary: '#585e6f'
  on-secondary: '#ffffff'
  secondary-container: '#dadff3'
  on-secondary-container: '#5d6273'
  tertiary: '#7b2900'
  on-tertiary: '#ffffff'
  tertiary-container: '#a23900'
  on-tertiary-container: '#ffc8b4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d1bcff'
  on-primary-fixed: '#23005b'
  on-primary-fixed-variant: '#5700c9'
  secondary-fixed: '#dde2f6'
  secondary-fixed-dim: '#c1c6d9'
  on-secondary-fixed: '#151b29'
  on-secondary-fixed-variant: '#414756'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb599'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#7f2b00'
  background: '#fef7ff'
  on-background: '#1d1a25'
  surface-variant: '#e7dff0'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system evolves from a high-energy nocturnal aesthetic into a professional, airy, and high-clarity daytime experience. It targets users seeking a seamless, reliable booking process while maintaining a hint of the brand's original digital energy.

The style is **Modern Corporate** with a focus on **Minimalism**. It prioritizes heavy white space, crisp typography, and subtle functional layering. The emotional response should be one of efficiency, trust, and effortless navigation, stripping away visual noise to focus on the content and the transaction.

## Colors
The palette shifts to a light-dominant foundation to ensure maximum readability and a clean professional feel.

- **Primary (#7000ff):** Reserved for high-impact actions, active states, and critical branding. On light backgrounds, its vibrancy acts as a clear directional signal.
- **Secondary/Text (#121826):** A deep charcoal navy used for primary headings and body text to provide superior contrast against light surfaces.
- **Background (#fcfcfd):** An off-white that reduces eye strain compared to pure hex white while maintaining an "airy" feel.
- **Surface (#f2f4f7):** Subtle grays used for container backgrounds, input fields, and card sections to create soft structural separation.

## Typography
Montserrat remains the core typeface, leveraging its geometric precision to feel modern and structured. In this light iteration, font weights are carefully balanced to maintain hierarchy without the need for excessive color variance. 

Headlines utilize bold weights and tight letter-spacing for a confident, editorial look. Body text stays at a medium-light weight to ensure the "airy" quality of the design system remains intact, while labels are slightly tracked out for better legibility at small sizes.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on an 8px square rhythm. 

- **Desktop:** A 12-column grid with 24px gutters. Content is typically capped at a 1280px max-width to maintain readability.
- **Mobile:** A 4-column grid with 16px margins. 
- **Philosophy:** Emphasize vertical rhythm through generous "lg" and "xl" spacing between sections to reinforce the clean, uncluttered aesthetic. Components should utilize internal padding of 16px or 24px to feel spacious and premium.

## Elevation & Depth
This design system avoids heavy shadows, instead using **Tonal Layers** and **Low-Contrast Outlines** to define depth.

- **Level 0 (Background):** Base #fcfcfd surface.
- **Level 1 (Cards/Containers):** Subtle #f2f4f7 background or a 1px solid border in #e4e7ec.
- **Level 2 (Interactive):** When an element requires elevation (like a modal or floating action button), use a very soft, diffused ambient shadow: `0px 12px 24px rgba(18, 24, 38, 0.05)`.
- **Level 3 (Overlay):** Standard scrims should be light gray with 40% opacity rather than pure black to maintain the daytime vibe.

## Shapes
Following the "ROUND_EIGHT" (8px) logic, the shape language is approachable yet disciplined. 

The 0.5rem (8px) base radius applies to buttons, input fields, and standard cards. Larger layout containers or image carousels may utilize `rounded-lg` (16px) or `rounded-xl` (24px) to emphasize the soft, modern character of the interface. This consistency in curvature ensures that even with a minimalist color palette, the UI feels cohesive and intentionally designed.

## Components
- **Buttons:** Primary buttons use the #7000ff background with white text. Secondary buttons should use a ghost style (border only) or a soft gray background with navy text.
- **Input Fields:** Use a light #f9fafb fill with a 1px border. On focus, the border transitions to the primary #7000ff color with a subtle 2px outer glow.
- **Chips:** Small, pill-shaped elements with #f2f4f7 backgrounds and #121826 text for categories or filters.
- **Cards:** White backgrounds with a subtle 1px gray border. Avoid shadows on cards unless they are hovered, at which point a soft lift effect may be applied.
- **Lists:** Clean dividers (1px) in #f2f4f7. Use high-contrast navy for list titles and muted gray for metadata or descriptions.
- **Checkboxes/Radios:** Use the primary color for the checked state. The unchecked state should be a simple gray outline to remain unobtrusive.