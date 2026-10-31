# Sunitha Enterprises — uPVC Windows & Doors website

React 19 + Vite 6 + Tailwind 4, with GSAP/ScrollTrigger, Lenis smooth scrolling and
Three.js (React Three Fiber) for the interactive 3D windows.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in dist/
npm run lint     # type check
```

## Where to edit things

| What | File |
|---|---|
| Phone, email, address, socials, form inbox (**currently placeholders**) | `src/config/company.ts` |
| Window types, profiles, laminations, benefits | `src/data/products.ts` |
| Colours, fonts, spacing tokens | `src/index.css` (`@theme` block) |
| Home page sections | `src/sections/*.tsx` |
| 3D scenes (all modelled in code, no model files) | `src/components/three/*` |
| Gallery photos | add a folder under `public/galleries/` (optional `description.txt`) |

## 3D and accessibility

- 3D scenes load only when their section is near the screen and pause when off-screen.
- Devices without WebGL, with data saver on, low memory, or with reduced motion
  (system setting or the on-site accessibility button) see photographs instead.
- The profile cut-through is an illustration, labelled "not to scale" on the site.
