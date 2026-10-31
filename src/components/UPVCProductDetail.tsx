import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Check,
  Thermometer, Shield, Volume2, Droplets, Sparkles, Move,
  Hammer, Eye, Layers, Compass, Palette
} from 'lucide-react';
import gsap from 'gsap';
import { PrecisionRulerAccent } from './PrecisionRulerAccent';

// ─── Interfaces ──────────────────────────────────────────────────────────────────
export interface WindowDetail {
  id: string;
  title: string;
  desc: string;
  img: string;
  angles: string[];
  overview: string;
  features: {
    icon: React.ComponentType<any>;
    title: string;
    desc: string;
  }[];
  options: {
    name: string;
    desc: string;
    svgPath: React.ReactNode;
  }[];
  variants?: {
    name: string;
    desc: string;
    image: string;
    sizeLimits: string;
    specs: {
      parameter: string;
      specification: string;
    }[];
  }[];
}

// ─── CAD Blueprint Schematics (Clean Light CAD Blueprint Theme) ───────────────────
const CAD_GRID_PATTERN_LIGHT = (
  <defs>
    <pattern id="cadGridLight" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(46, 107, 101, 0.04)" strokeWidth="0.5" />
    </pattern>
  </defs>
);

const HOTSPOTS = [
  {
    id: 1,
    title: 'EPDM WEATHER GASKETS',
    desc: 'Double compression seals certified EN 12208 for 100% wind & rainwater tightness.',
    top: '38%',
    left: '26%',
    tagTop: '18%',
    tagLeft: '22%',
    linePath: 'M 26 38 L 22 18'
  },
  {
    id: 2,
    title: 'DOUBLE GLAZED UNIT',
    desc: '24mm Argon filled glass chambers supporting sound attenuation up to 45 dB.',
    top: '28%',
    left: '58%',
    tagTop: '12%',
    tagLeft: '72%',
    linePath: 'M 58 28 L 72 12'
  },
  {
    id: 3,
    title: 'MULTI-CHAMBER PROFILE',
    desc: 'Patented aluplast tropicalised uPVC core achieving thermal value Uf = 1.3 W/m²K.',
    top: '64%',
    left: '42%',
    tagTop: '82%',
    tagLeft: '50%',
    linePath: 'M 42 64 L 50 82'
  }
];

const SVG_SLIDING_4PANEL = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    
    {/* Blueprint outer frame */}
    <rect x="5" y="10" width="90" height="60" rx="1" className="stroke-[#2E6B65] stroke-2 opacity-90" />
    <line x1="27.5" y1="10" x2="27.5" y2="70" className="stroke-slate-300 stroke-dasharray-[2,2]" />
    <line x1="50" y1="10" x2="50" y2="70" className="stroke-[#2E6B65] stroke-2" />
    <line x1="72.5" y1="10" x2="72.5" y2="70" className="stroke-slate-300 stroke-dasharray-[2,2]" />
    
    {/* Sashes */}
    <rect x="9" y="14" width="15" height="52" rx="0.5" className="stroke-slate-800" />
    <rect x="31.5" y="14" width="15" height="52" rx="0.5" className="stroke-slate-800" />
    <rect x="54" y="14" width="15" height="52" rx="0.5" className="stroke-slate-800" />
    <rect x="76.5" y="14" width="15" height="52" rx="0.5" className="stroke-slate-800" />
    
    {/* Technical Arrows */}
    <path d="M 21 40 L 13 40 M 16 37 L 13 40 L 16 43" className="stroke-[#2E6B65] stroke-1" />
    <path d="M 35 40 L 43 40 M 40 37 L 43 40 L 40 43" className="stroke-[#2E6B65] stroke-1" />
    <path d="M 65 40 L 57 40 M 60 37 L 57 40 L 60 43" className="stroke-[#2E6B65] stroke-1" />
    <path d="M 79 40 L 87 40 M 84 37 L 87 40 L 84 43" className="stroke-[#2E6B65] stroke-1" />
    
    {/* Dimension lines */}
    <path d="M 5 5 L 95 5 M 5 2 L 5 8 M 95 2 L 95 8" className="stroke-slate-300 stroke-[0.5]" />
    <text x="50" y="4" textAnchor="middle" className="fill-slate-400 font-mono text-[4px]">W: 3200mm</text>
  </svg>
);

const SVG_SLIDING_1TRACK_INT = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    
    <rect x="15" y="10" width="70" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <line x1="50" y1="10" x2="50" y2="70" className="stroke-[#2E6B65] stroke-2" />
    
    {/* Left Fixed Panel with large "X" */}
    <path d="M 20 18 L 45 62 M 45 18 L 20 62" className="stroke-slate-200 stroke-[1]" />
    
    {/* Right Sliding sash */}
    <rect x="54" y="14" width="27" height="52" rx="0.5" className="stroke-slate-800 stroke-[1.5]" />
    <circle cx="58" cy="40" r="1" className="fill-[#2E6B65] stroke-none" />
    
    {/* Sliding Arrow */}
    <path d="M 75 40 L 63 40 M 67 36 L 63 40 L 67 44" className="stroke-[#2E6B65] stroke-1" />
    <text x="50" y="4" textAnchor="middle" className="fill-slate-400 font-mono text-[4px]">W: 1800mm</text>
  </svg>
);

const SVG_SLIDING_2_5TRACK_MESH = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    
    <rect x="5" y="10" width="90" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <line x1="50" y1="10" x2="50" y2="70" className="stroke-[#2E6B65] stroke-2" />
    
    {/* Left sash with mesh texture in top corner */}
    <rect x="9" y="14" width="37" height="52" rx="0.5" className="stroke-slate-800" />
    <path d="M 34 14 L 42 22 M 38 14 L 42 18 M 41 14 L 42 15" className="stroke-[#2E6B65]/50 stroke-[0.8]" />
    
    {/* Right sliding sash */}
    <rect x="54" y="14" width="37" height="52" rx="0.5" className="stroke-slate-800 stroke-[1.5]" />
    
    {/* Sliding arrows */}
    <path d="M 20 40 L 28 40 M 24 36 L 28 40 L 24 44" className="stroke-slate-400 stroke-1" />
    <path d="M 80 40 L 72 40 M 76 36 L 72 40 L 76 44" className="stroke-slate-400 stroke-1" />
    <text x="50" y="4" textAnchor="middle" className="fill-slate-400 font-mono text-[4px]">W: 2400mm</text>
  </svg>
);

const SVG_SLIDING_2TRACK_MESH = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    
    <rect x="5" y="10" width="90" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <line x1="50" y1="10" x2="50" y2="70" className="stroke-[#2E6B65] stroke-2" />
    
    {/* Left & Right sashes */}
    <rect x="9" y="14" width="37" height="52" rx="0.5" className="stroke-slate-800" />
    <rect x="54" y="14" width="37" height="52" rx="0.5" className="stroke-slate-800" />
    
    <circle cx="42" cy="40" r="1" className="fill-slate-900 stroke-none" />
    <circle cx="58" cy="40" r="1" className="fill-slate-900 stroke-none" />
    
    {/* Sliding arrows */}
    <path d="M 22 40 L 32 40 M 28 36 L 32 40 L 28 44" className="stroke-slate-400 stroke-1" />
    <path d="M 78 40 L 68 40 M 72 36 L 68 40 L 72 44" className="stroke-slate-400 stroke-1" />
    <text x="50" y="4" textAnchor="middle" className="fill-slate-400 font-mono text-[4px]">W: 2000mm</text>
  </svg>
);

// ─── SVG Schematics for Casement ──────────────────────────────────────────────────
const SVG_CASEMENT_1PANEL = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <rect x="20" y="10" width="60" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <rect x="25" y="15" width="50" height="50" rx="0.5" className="stroke-slate-800" />
    <path d="M 25 15 L 75 40 L 25 65" className="stroke-dashed stroke-[#2E6B65]/60 stroke-[1]" />
    <circle cx="70" cy="40" r="1.5" className="fill-slate-900 stroke-none" />
  </svg>
);

const SVG_CASEMENT_FRENCH = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <rect x="10" y="10" width="80" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <line x1="50" y1="10" x2="50" y2="70" className="stroke-[#2E6B65] stroke-2" />
    
    <rect x="14" y="15" width="32" height="50" rx="0.5" className="stroke-slate-800" />
    <path d="M 14 15 L 46 40 L 14 65" className="stroke-slate-300 stroke-[0.8]" />
    
    <rect x="54" y="15" width="32" height="50" rx="0.5" className="stroke-slate-800" />
    <path d="M 86 15 L 54 40 L 86 65" className="stroke-slate-300 stroke-[0.8]" />
  </svg>
);

const SVG_CASEMENT_TOPHUNG = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <rect x="20" y="10" width="60" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <rect x="25" y="15" width="50" height="50" rx="0.5" className="stroke-slate-800" />
    <path d="M 25 65 L 50 15 L 75 65" className="stroke-slate-300 stroke-[1]" />
    <circle cx="50" cy="60" r="1.5" className="fill-slate-900 stroke-none" />
  </svg>
);

// ─── SVG Schematics for Arch ──────────────────────────────────────────────────────
const SVG_ARCH_FULL = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <path d="M 20 70 L 20 40 A 30 30 0 0 1 80 40 L 80 70 Z" className="stroke-[#2E6B65] stroke-2" />
    <line x1="20" y1="40" x2="80" y2="40" className="stroke-slate-200 stroke-dasharray-[2,2]" />
    <path d="M 26 65 L 26 40 A 24 24 0 0 1 74 40 L 74 65 Z" className="stroke-slate-800" />
  </svg>
);

const SVG_ARCH_OPERABLE = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <path d="M 20 70 L 20 40 A 30 30 0 0 1 80 40 L 80 70 Z" className="stroke-[#2E6B65] stroke-2" />
    <line x1="20" y1="40" x2="80" y2="40" className="stroke-[#2E6B65] stroke-2" />
    <rect x="25" y="44" width="50" height="22" rx="0.5" className="stroke-slate-800" />
    <path d="M 25 44 L 75 55 L 25 66" className="stroke-slate-300 stroke-[0.8]" />
  </svg>
);

// ─── SVG Schematics for Combination & Other ───────────────────────────────────────
const SVG_COMBINATION_CS_FX = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <rect x="10" y="10" width="80" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <line x1="45" y1="10" x2="45" y2="70" className="stroke-[#2E6B65] stroke-2" />
    
    <rect x="14" y="15" width="27" height="50" rx="0.5" className="stroke-slate-800" />
    <path d="M 14 15 L 41 40 L 14 65" className="stroke-slate-300" />
    
    <rect x="49" y="15" width="37" height="50" rx="0.5" className="stroke-slate-300" />
    <line x1="49" y1="15" x2="86" y2="65" className="stroke-slate-100" />
  </svg>
);

const SVG_TILT_TURN_TILT = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <rect x="20" y="10" width="60" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <rect x="25" y="15" width="50" height="50" rx="0.5" className="stroke-slate-800" />
    <path d="M 25 15 L 50 65 L 75 15" className="stroke-[#2E6B65] stroke-1" />
    <path d="M 25 15 L 75 15 L 50 25 Z" className="fill-[#2E6B65]/5 stroke-none" />
  </svg>
);

const SVG_VILLA_SYSTEM = (
  <svg viewBox="0 0 100 80" className="w-full h-full stroke-slate-400 fill-none stroke-[1.2]">
    {CAD_GRID_PATTERN_LIGHT}
    <rect width="100" height="80" fill="url(#cadGridLight)" className="stroke-none" />
    <rect x="15" y="10" width="70" height="60" rx="1" className="stroke-[#2E6B65] stroke-2" />
    <g className="stroke-slate-100 stroke-[0.75]">
      <line x1="25" y1="10" x2="25" y2="70" />
      <line x1="38" y1="10" x2="38" y2="70" />
      <line x1="50" y1="10" x2="50" y2="70" />
      <line x1="62" y1="10" x2="62" y2="70" />
      <line x1="75" y1="10" x2="75" y2="70" />
    </g>
    <rect x="20" y="15" width="60" height="50" rx="0.5" className="stroke-slate-800" />
  </svg>
);

export const DETAILED_PRODUCTS: Record<string, WindowDetail> = {
  'Sliding Windows': {
    id: 'sliding',
    title: 'uPVC Sliding Windows',
    desc: 'Glide horizontally on heavy-duty tracks requiring absolutely no swing space. Sunitha Enterprises fabricates four high-performance aluplast sliding variants optimized for Indian architectural elevations.',
    img: '/images/product-sliding-windows.jpg',
    angles: ['/images/product-sliding-windows.jpg', '/images/profile-sliding.jpg', '/images/installed-sliding-windows.jpg'],
    overview: 'We offer aluplast\'s complete range of four custom sliding window and door systems: the ultra-premium "smart-slide" villa patio doors featuring continuous EPDM weather-stripping and optional indoor glass bonding; the highly versatile "vario-slide" with stable aluminum interlocks and multi-track layouts; the elegant "easy-slide" equipped with exchangeable gaskets; and the modern "mono-slide" hybrid integrating fixed and sliding sashes on a 60 mm frame. All systems feature synthetic rollers for silent, smooth gliding and robust steel reinforcements.',
    features: [
      { icon: Move, title: 'smart-slide (Villa Patio Star)', desc: '70 mm construction depth, Uf = 1.4 W/m²K, concealed hardware, self-closing tracks, and optional indoor glass-bonding adhesive technology.' },
      { icon: Layers, title: 'vario-slide (Multi-Track)', desc: 'Versatile 2-track and 3-track sliding window system supporting 4 to 24 mm double glazing, concealed drainage, and stable aluminum interlocks.' },
      { icon: Shield, title: 'easy-slide (Exchangeable Gaskets)', desc: '60 mm frame depth sliding system featuring exchangeable gaskets, integrated steel reinforcement, and excellent tropical statics.' },
      { icon: Droplets, title: 'mono-slide (PVC Interlock)', desc: 'Specialized sliding windows featuring integrated PVC interlocks for hermetic sealing, combining fixed and movable glass elements.' }
    ],
    options: [
      { name: 'smart-slide 70mm PREMIUM PATIO DOOR', desc: 'Sleek villa sliding door with schema A & C opening, convenient self-closing, and heavy double glazing up to 41 mm.', svgPath: SVG_SLIDING_4PANEL },
      { name: 'vario-slide 2/3 TRACK BALCONY UNIT', desc: 'Supports large 4-24 mm insulated glass panels with stable aluminum interlock, perfect for high wind-pressure zones.', svgPath: SVG_SLIDING_2TRACK_MESH },
      { name: 'easy-slide 2.5 TRACK SLIDER WITH MESH', desc: 'Standard 2-track sliding window coupled with an integrated third track for mosquito insect screens.', svgPath: SVG_SLIDING_2_5TRACK_MESH },
      { name: 'mono-slide 60mm FIXED & SLIDING COMBO', desc: 'A minimalist single sliding sash beside a wide fixed panoramic picture frame with PVC interlock sealing.', svgPath: SVG_SLIDING_1TRACK_INT }
    ],
    variants: [
      {
        name: 'Sliding Windows',
        desc: 'Sleek and space-saving, sliding windows provide smooth operation and modern aesthetics for any room.',
        image: '/images/product-sliding-windows.jpg',
        sizeLimits: 'Min : H: 1.5ft x W: 3ft (2 Panels)',
        specs: [
          { parameter: 'Track Options', specification: '2, 2.5 and 3 track' },
          { parameter: 'Profile Wall Thickness (Increases Profile Strength)', specification: '2.3 mm (+/- 0.2) mm' },
          { parameter: 'GI Reinforcement Thickness (Provides Window Strength)', specification: '1.2 mm - 2 mm' },
          { parameter: 'Max. Glass Thickness (Enhances Sound Proofing)', specification: '5-18; 4-24; 4-12' }
        ]
      }
    ]
  },
  'Casement Windows': {
    id: 'casement',
    title: 'uPVC Casement Windows',
    desc: 'Hinged at the side and opening outwards like a traditional door, casement windows deliver maximum ventilation, airtight compression seals, and unmatched thermal insulation.',
    img: '/images/product-casement-windows.jpg',
    angles: ['/images/product-casement-windows.jpg', '/images/profile-casement.jpg', '/images/installed-casement-windows.jpg'],
    overview: 'Our premium casement range features aluplast\'s newly launched "IDEAL 1000" and flagship "IDEAL 4000®" multi-chamber systems. Constructed with deep profiles that flat-compress against continuous weather seals, they achieve Sunitha Enterprises\' highest air-tightness and thermal efficiency. Suited for Mivan Construction with lower sill widths, these systems deliver exceptional structural wind load resistance and sound dampening class up to 45 dB.',
    features: [
      { icon: Compass, title: 'IDEAL 1000 (New Launch)', desc: '54 mm construction depth, 3-chamber tropicalized system designed for outward-open casements, compatible with Mivan and standard glazing beads.' },
      { icon: Volume2, title: 'IDEAL 4000® (Premium Core)', desc: 'Premium 70 mm construction depth, 5-chamber insulation with Uf = 1.3 W/m²K and outstanding Uw = 0.99 W/m²K for ultimate energy savings.' },
      { icon: Shield, title: 'Acoustic Dampening Class 4', desc: 'Continuous EPDM double-hollow gaskets and thick glass configurations dampen city road traffic noise by up to 45 dB.' },
      { icon: Layers, title: 'aluskin® Aluminum Covers', desc: 'Supports optional clip-on external aluminum cover shells, combining uPVC high performance with infinite powder-coated colors.' }
    ],
    options: [
      { name: 'IDEAL 1000 SINGLE OUTWARD WINDOW', desc: 'Outward opening casement pane with 54 mm depth, optimized with lower sills for Mivan structural guidelines.', svgPath: SVG_CASEMENT_1PANEL },
      { name: 'IDEAL 4000® TRIPLE GLAZED SHIELD', desc: 'Heavy-duty 70 mm casement sash holding double or triple security safety glass up to 41 mm thick.', svgPath: SVG_CASEMENT_1PANEL },
      { name: 'DOUBLE SASH FRENCH CASEMENT DOOR', desc: 'Two sashes opening outward from the center without a central vertical mullion profile, creating a wide-open passage.', svgPath: SVG_CASEMENT_FRENCH },
      { name: 'TOP-HUNG TOXIC AIR VENTILATOR', desc: 'Hinged at the top and opening from the bottom, allowing ventilation during heavy rainfall without water entry.', svgPath: SVG_CASEMENT_TOPHUNG }
    ],
    variants: [
      {
        name: 'Casement Window',
        desc: 'Reliable, energy-efficient, and versatile, casement windows offer maximum ventilation and superior security.',
        image: '/images/product-casement-windows.jpg',
        sizeLimits: 'Min : W: 1.5ft x H: 1.5ft | Max : W: 2 x H: 5ft',
        specs: [
          { parameter: 'Profile Wall Thickness (Increases Profile Strength)', specification: '2.3 mm (+/- 0.2) mm' },
          { parameter: 'GI Reinforcement Thickness (Provides Window Strength)', specification: '1.5mm' },
          { parameter: 'Max. Glass Thickness (Enhances Sound Proofing)', specification: '4mm–26 mm; 4mm–39mm' }
        ]
      },
      {
        name: 'Awning Windows',
        desc: 'Ideal for ventilation, our awning windows offer protection from rain while allowing fresh air.',
        image: '/images/awning-window-render.jpg',
        sizeLimits: 'Min : W: 1.5ft x H: 1.5ft | Max : W: 3ft x H: 2.3ft',
        specs: [
          { parameter: 'Profile Wall Thickness (Increases Profile Strength)', specification: '2.3 mm (+/- 0.2) mm' },
          { parameter: 'GI Reinforcement Thickness (Provides Window Strength)', specification: '1.5mm' },
          { parameter: 'Max. Glass Thickness (Enhances Sound Proofing)', specification: '4mm–26 mm; 4mm–39mm' }
        ]
      }
    ]
  },
  'Arch Windows': {
    id: 'arch',
    title: 'uPVC Arch Windows',
    desc: 'Add timeless architectural elegance and vintage styling to your facade using precision-curved modern profiles without compromising on high insulation.',
    img: '/images/product-arch-windows.jpg',
    angles: ['/images/product-arch-windows.jpg', '/images/profile-ideal-2000.jpg', '/images/installed-arch-windows.jpg'],
    overview: 'Sunitha Enterprises Curved Arch uPVC Windows are fabricated using specialized aluplast 60 mm (IDEAL 2000®) or 70 mm (IDEAL 4000®) profile structures. Utilizing state-of-the-art temperature-controlled profile bending machines, we achieve perfectly uniform, continuous curves. They support premium aludec and woodec laminations with welded, hermetic airtight joints that eliminate rainwater leakages.',
    features: [
      { icon: Sparkles, title: 'Bespoke Profile Curving', desc: 'Heated automated bending curves multi-chamber profiles to custom radii while fully preserving structural core integrity.' },
      { icon: Layers, title: 'Curved Galvanized Reinforcement', desc: 'Fitted with custom bent internal steel cores that guarantee decades of stable architectural geometry.' },
      { icon: Hammer, title: 'Authentic aludec / woodec Finishes', desc: 'Available in all premium matte aludec aluminum looks and warm textured woodec oak timber textures.' },
      { icon: Droplets, title: 'Welded Leak Proof Corner Joints', desc: 'Seamlessly welded curved junctions block heavy tropical rainwater and eliminate whistling wind drafts.' }
    ],
    options: [
      { name: 'FULL SEMI-CIRCULAR ARCH FIX', desc: 'A stunning, completely fixed semi-circle glass arch panel that floods double-height ceilings with light.', svgPath: SVG_ARCH_FULL },
      { name: 'GOTHIC POINTED ARCH PIECE', desc: 'Custom curved pointed arch structure, providing vintage, cathedral-style elegance for premium bungalows.', svgPath: SVG_ARCH_FULL },
      { name: 'OPERABLE LOWER CASEMENT ARCH', desc: 'Features a beautiful fixed circular arch top and an operable outward opening casement window below for fresh air.', svgPath: SVG_ARCH_OPERABLE },
      { name: 'SEGMENTAL LOW CURVE ARCH', desc: 'A modern low-profile curved arch window, adding subtle classic styling above standard casement sashes.', svgPath: SVG_ARCH_FULL }
    ],
    variants: [
      {
        name: 'Fixed Curved Arch',
        desc: 'Seamless circular or segmental fixed frames flooding double-height spaces with warm natural light.',
        image: '/images/product-arch-windows.jpg',
        sizeLimits: 'Min : R: 1.5ft | Max : W: 6ft x H: 6ft',
        specs: [
          { parameter: 'Profile Wall Thickness (Increases Profile Strength)', specification: '2.5 mm (+/- 0.2) mm' },
          { parameter: 'GI Reinforcement (Provides Pre-bent Strength)', specification: '1.5mm custom pre-curved' },
          { parameter: 'Max. Glass Thickness (Enhances Sound Proofing)', specification: '4mm–24mm DGU' }
        ]
      }
    ]
  },
  'Combination Windows': {
    id: 'combination',
    title: 'uPVC Combination Windows',
    desc: 'Fuse fixed, sliding, and casement panels within a single integrated heavy-duty frame to maximize panoramic light and precise ventilation in wide living spaces.',
    img: '/images/product-combination-windows.jpg',
    angles: ['/images/product-combination-windows.jpg', '/images/profile-vario-slide.jpg', '/images/installed-combination-windows.jpg'],
    overview: 'Our combination windows seamlessly couple different aluplast profile systems—such as coupling an IDEAL 1000 casement window with vario-slide sliding tracks or fixed picture panes. These systems are joined using heavy-duty structural coupling mullions reinforced internally with thick steel. Engineered to handle high-wind load pressures, they are ideal for double-height living rooms, bay windows, and large balcony partitions.',
    features: [
      { icon: Layers, title: 'Seamless Profile Coupling', desc: 'Blends different multi-chamber sash profiles (sliding, operable, or fixed) within a single robust framework unit.' },
      { icon: Compass, title: 'Coupling Steel Reinforcements', desc: 'Internal structural mullions are fitted with thick steel plates to safely handle extreme coastal tropical winds.' },
      { icon: Shield, title: 'Custom Bay Angle Joints', desc: 'Allows window profiles to couple at 90°, 135° or customized angles to project outward as luxury bay seating.' },
      { icon: Sparkles, title: 'Optimized Cross Ventilation', desc: 'Operable and fixed panes can be positioned strategically to direct and maximize natural convective airflow.' }
    ],
    options: [
      { name: 'IDEAL 1000 CASEMENT + FIXED PANEL', desc: 'Features a large fixed picture pane coupled with operable side casement sashes, maximizing light and airflow.', svgPath: SVG_COMBINATION_CS_FX },
      { name: 'vario-slide + FIXED TOP LIGHT', desc: 'Couples a 2-track sliding window on the bottom with a fixed double-glazed transom window on top.', svgPath: SVG_COMBINATION_CS_FX },
      { name: '90/45 DEGREE COZY BAY WINDOW', desc: 'A 3-sided coupled window unit projecting outward from the building envelope, enlarging the internal floor area.', svgPath: SVG_COMBINATION_CS_FX },
      { name: 'CASEMENT + TOP HUNG AWNING UNIT', desc: 'A vertical combo with sashes below and top-hung ventilators on top to vent out hot indoor air.', svgPath: SVG_COMBINATION_CS_FX }
    ],
    variants: [
      {
        name: 'Combination Systems',
        desc: 'Fuse fixed, sliding, and casement panels within a single integrated heavy-duty frame to maximize light and ventilation.',
        image: '/images/product-combination-windows.jpg',
        sizeLimits: 'Min : W: 3ft x H: 3ft | Max : W: 8ft x H: 6ft',
        specs: [
          { parameter: 'Profile Wall Thickness (Increases Profile Strength)', specification: '2.3 mm (+/- 0.2) mm' },
          { parameter: 'Joint Reinforcement (Heavy-Duty Connecting stays)', specification: 'Internal galvanized steel coupling plates' },
          { parameter: 'Max. Glass Thickness (Enhances Sound Proofing)', specification: '4mm–35mm DGU / TGU' }
        ]
      }
    ]
  },
  'Tilt and Turn Windows': {
    id: 'tilt-turn',
    title: 'uPVC Tilt & Turn Windows',
    desc: 'Representing the peak of European window engineering. A single handle controls two modes: tilt inward for secure draft-free air, or turn inward for full access.',
    img: '/images/product-tilt-turn-windows.jpg',
    angles: ['/images/product-tilt-turn-windows.jpg', '/images/profile-ideal-4000.jpg', '/images/installed-tilt-turn-windows.jpg'],
    overview: 'Our Tilt and Turn system represents aluplast\'s peak European technology utilizing the IDEAL 4000® 70 mm heavy core. A single heavy-duty handle controls three distinct configurations: pointing down locks the window completely airtight; turning 90° sideways swings the sash fully inward (turn mode) for safe, easy cleaning of external glass; and turning 180° upward tilts the sash inward from the top by 10-15° (tilt mode) for continuous, secure, rain-proof ventilation.',
    features: [
      { icon: Move, title: 'Dual-Action Mechanical Core', desc: 'A single high-grade hardware handle regulates lock, 90° inward turn opening, and 18° inward tilt ventilation.' },
      { icon: Shield, title: 'Perimeter Compressive Locking', desc: 'Locking pins compress the sash airtight into the frame along the entire circumference, preventing forced entry.' },
      { icon: Thermometer, title: 'Maximum Thermal Efficiency', desc: 'Heavy 5-chamber 70 mm profile combined with triple compression gaskets delivers outstanding energy and acoustic ratings.' },
      { icon: Eye, title: 'Safe High-Rise Glass Maintenance', desc: 'Sash turns fully inward like a door, allowing homeowners to clean external window panes easily and safely from inside.' }
    ],
    options: [
      { name: 'IDEAL 4000® SINGLE TILT & TURN', desc: 'Premium single-sash system, offering ultimate European comfort and 45 dB noise damping for bedrooms.', svgPath: SVG_TILT_TURN_TILT },
      { name: 'FRENCH DOUBLE TILT & TURN DOOR', desc: 'Two sashes opening fully inward. The active master sash tilts and turns, while the secondary slave sash turns.', svgPath: SVG_TILT_TURN_TILT },
      { name: 'TILT & TURN WITH FIXED BOTTOM SILL', desc: 'Features a fixed laminated double glass safety panel below, and an operable tilt-and-turn window on top.', svgPath: SVG_TILT_TURN_TILT },
      { name: 'TILT & TURN WITH FIXED PICTURE LIGHT', desc: 'Couples a premium operable tilt-and-turn sash with a wide fixed panoramic picture glass on the side.', svgPath: SVG_TILT_TURN_TILT }
    ],
    variants: [
      {
        name: 'Tilt & Turn Window',
        desc: 'Peak European engineering. Tilt mode inward for secure ventilation or turn mode inward for full cleaning access.',
        image: '/images/product-tilt-turn-windows.jpg',
        sizeLimits: 'Min : W: 1.8ft x H: 1.8ft | Max : W: 3.5ft x H: 6ft',
        specs: [
          { parameter: 'Construction Depth (Thermal chambers)', specification: '70 mm premium 5-chamber' },
          { parameter: 'Profile Wall Thickness (Increases Profile Strength)', specification: '2.8 mm (+/- 0.2) mm' },
          { parameter: 'Locking Mechanism (Burglar Resistant stays)', specification: 'Perimeter Compressive Multi-Point Locking' },
          { parameter: 'Max. Glass Thickness (Enhances Sound Proofing)', specification: 'Up to 41 mm triple glass' }
        ]
      }
    ]
  },
  'Villa Windows': {
    id: 'villa',
    title: 'uPVC Villa Windows',
    desc: 'The ultimate luxury window designed for Indian homes, integrating double sashes, a built-in heavy-duty steel safety grill, and bug screening into a single system.',
    img: '/images/product-villa-windows.jpg',
    angles: ['/images/product-villa-windows.jpg', '/images/profile-villa.jpg', '/images/villa-windows.jpg'],
    overview: 'Our uPVC Villa Windows are luxury systems custom-engineered by Sunitha Enterprises for Indian climates and residential needs. We combine three essential systems into one high-strength aluplast profile frame: an outward-opening double-glazed glass casement sash for thermal and sound insulation; a built-in heavy-duty metal safety grill anchored inside the steel reinforcement; and an independent inward-opening high-tensile insect mesh screen.',
    features: [
      { icon: Shield, title: 'Built-in Internal Safety Grill', desc: 'Heavy-gauge steel security bars are anchored directly inside the uPVC profile\'s internal galvanized steel core.' },
      { icon: Layers, title: 'Dual Operable Sashes', desc: 'Features an outward-swinging insulated glass sash coupled with an independent inward-swinging bug screen sash.' },
      { icon: Droplets, title: 'Continuous EPDM Sealing', desc: 'Fitted with dual-compression EPDM gaskets to prevent water leakage during monsoons while filtering out bugs and dust.' },
      { icon: Hammer, title: 'Premium woodec Lamination', desc: 'Perfectly emulates golden oak, sheffield oak or turner oak grains, giving a luxurious, natural wood look.' }
    ],
    options: [
      { name: 'SINGLE SASH VILLA WINDOW SYSTEM', desc: 'Features an outward glass sash, built-in security grill, and an inward high-tensile bug screen.', svgPath: SVG_VILLA_SYSTEM },
      { name: 'DOUBLE SASH FRENCH VILLA DOOR', desc: 'Wide double door opening with inward bug mesh doors and built-in security grill, perfect for veranda openings.', svgPath: SVG_VILLA_SYSTEM },
      { name: 'VILLA WINDOW WITH CURVED ARCH TOP', desc: 'A highly luxurious curved arch fixed light coupled with an operable villa window below.', svgPath: SVG_VILLA_SYSTEM },
      { name: 'HIGH-DRAINAGE MONSOON VILLA UNIT', desc: 'Equipped with a stepped threshold and drainage vents to handle severe tropical coastal wind-driven rain.', svgPath: SVG_VILLA_SYSTEM }
    ],
    variants: [
      {
        name: 'Villa Security Window',
        desc: 'High-security window combining a double-glazed sash, a built-in safety grill, and bug mesh in one frame.',
        image: '/images/product-villa-windows.jpg',
        sizeLimits: 'Min : W: 2ft x H: 3ft | Max : W: 5ft x H: 5ft',
        specs: [
          { parameter: 'Profile System (Multi-sash composite)', specification: 'Sunitha Premium Villa Core' },
          { parameter: 'GI Reinforcement (Provides Grill Anchoring stays)', specification: '1.8mm heavy-duty internal steel' },
          { parameter: 'Security Grill (Integrates Burglar Proofing)', specification: '10mm solid steel bars' },
          { parameter: 'Insect Screen Mesh (Filters out Bugs)', specification: 'SS304 marine grade steel' }
        ]
      }
    ]
  }
};

// ─── Customization details ────────────────────────────────────────────────────────
const ALUDEC_SWATCHES = [
  { name: 'aludec DB703', hex: '#434749', desc: 'Metallic iron mica with fine sparkles' },
  { name: 'aludec jet black', hex: '#0e0f11', desc: 'Ultra-matt deep architectural black' },
  { name: 'aludec window grey', hex: '#8c8e90', desc: 'Sleek industrial window grey' },
  { name: 'aludec basalt grey', hex: '#3a3f41', desc: 'Elegant dark volcanic basalt stone' },
  { name: 'aludec anthracite grey', hex: '#2b2d30', desc: 'Prestige deep dark anthracite' },
  { name: 'aludec traffic white', hex: '#e8e9eb', desc: 'Satin powder-coated traffic white' },
  { name: 'aludec umbra grey', hex: '#463f3a', desc: 'Warm organic earthy umbra grey' },
];

const WOODEC_SWATCHES = [
  { name: 'sheffield oak alpine', hex: '#cdbeab', desc: 'Pale Scandinavian white-washed oak woodgrain texture' },
  { name: 'sheffield oak concrete', hex: '#9f9284', desc: 'Modern concrete-infused cool grey woodgrain' },
  { name: 'turner oak toffee', hex: '#b08754', desc: 'Rich, warm honey-toffee authentic oak grain' },
  { name: 'turner oak malt', hex: '#c5b095', desc: 'Soft sandy-malt natural timber touch' },
];

interface UPVCProductDetailProps {
  productName: string;
  onBack: () => void;
  onSelectProduct: (name: string) => void;
}

export default function UPVCProductDetail({ productName, onBack, onSelectProduct }: UPVCProductDetailProps) {
  const detail = DETAILED_PRODUCTS[productName] || DETAILED_PRODUCTS['Sliding Windows'];
  const [selectedCustomTab, setSelectedCustomTab] = useState<'lamination' | 'glass' | 'hardware' | 'mesh'>('lamination');
  const [laminationCategory, setLaminationCategory] = useState<'aludec' | 'woodec'>('aludec');
  const [activeColor, setActiveColor] = useState(ALUDEC_SWATCHES[0]);
  const [activeGlassLevel, setActiveGlassLevel] = useState<1 | 2 | 3>(2); // 1=Single, 2=DGU, 3=Triple

  // 3D Interactive Viewer states
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const dragStartX = useRef(0);
  const initialAngle = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLDivElement>(null);

  // Reset active angle when product changes
  useEffect(() => {
    setActiveAngleIndex(0);
    setActiveHotspot(null);
  }, [productName]);

  // Trigger smooth scroll to top and GSAP reveal animations when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // GSAP animations for smooth, premium entry
    const ctx = gsap.context(() => {
      gsap.fromTo('.anim-header', 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      
      gsap.fromTo('.anim-fade-up', 
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08 }
      );

      gsap.fromTo('.glow-ambient-light',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.5, duration: 1.5, ease: 'power2.out' }
      );

      gsap.fromTo(heroImageRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [productName]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    initialAngle.current = activeAngleIndex;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDragging) {
      const deltaX = e.clientX - dragStartX.current;
      // Change angle for every 80px of horizontal drag
      const threshold = 80;
      const shift = Math.round(deltaX / threshold);
      let nextAngle = (initialAngle.current - shift) % 3;
      if (nextAngle < 0) nextAngle += 3;
      if (nextAngle !== activeAngleIndex) {
        setActiveAngleIndex(nextAngle);
      }
      // Apply a dynamic drag rotation feel (up to 20 deg)
      setTilt({
        x: 0,
        y: (deltaX % threshold) / threshold * 20
      });
    } else {
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const rotX = -((y - yc) / yc) * 12;
      const rotY = ((x - xc) / xc) * 12;
      setTilt({ x: rotX, y: rotY });
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  // Mobile Touch support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    initialAngle.current = activeAngleIndex;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const threshold = 80;
    const shift = Math.round(deltaX / threshold);
    let nextAngle = (initialAngle.current - shift) % 3;
    if (nextAngle < 0) nextAngle += 3;
    if (nextAngle !== activeAngleIndex) {
      setActiveAngleIndex(nextAngle);
    }
    setTilt({
      x: 0,
      y: (deltaX % threshold) / threshold * 20
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen pb-24 text-slate-800 select-none overflow-x-clip font-sans">
      
      {/* ─── Product Selection Sticky Header (Solid White on Mobile, Translucent Glass on Desktop) ─── */}
      <div className="sticky top-[72px] z-30 bg-white md:bg-white/90 md:backdrop-blur-md border-b border-slate-200/60 py-3 md:py-4 shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-[#2E6B65] text-xs uppercase font-extrabold tracking-widest transition-all duration-300 active:scale-95 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5 text-[#2E6B65]" /> Back to Systems
          </button>
          
          {/* Segmented slider categories navigation */}
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/50 overflow-x-auto no-scrollbar gap-1 max-w-full md:max-w-none">
            {Object.keys(DETAILED_PRODUCTS).map((key) => {
              const isActive = key === productName;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onSelectProduct(key);
                    setSelectedCustomTab('lamination');
                  }}
                  className={`px-5 py-2 rounded-full text-[10px] uppercase font-black tracking-widest transition-all duration-500 whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#2E6B65] to-blue-600 text-white shadow-[0_4px_12px_rgba(46,107,101,0.25)] scale-[1.02]' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {key.replace(' Windows', '')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Breadcrumb Navigation ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 sm:pt-10 pb-4 anim-header">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span>uPVC Systems</span>
          <span>/</span>
          <span>We Manufacture</span>
          <span>/</span>
          <span className="text-[#2E6B65] font-extrabold tracking-[0.1em]">{detail.title}</span>
        </div>
      </div>

      {/* ─── Product Hero Layout Grid ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative">
        {/* Soft daylight glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-100/30 rounded-full blur-[80px] pointer-events-none opacity-50 glow-ambient-light" />
        <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-blue-100/20 rounded-full blur-[80px] pointer-events-none opacity-30 glow-ambient-light" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* Left Column: Visual Showcase (Large image + ambient glass glow) */}
          <div className="lg:col-span-5 w-full flex flex-col gap-8">
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative bg-white border border-slate-200/80 p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-2xl flex items-center justify-center aspect-square overflow-hidden group cursor-grab active:cursor-grabbing select-none"
              style={{ perspective: 1000 }}
            >
              <style>{`
                @keyframes drawPath {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes fadeCard {
                  from { opacity: 0; transform: translate(-50%, -40%); }
                  to { opacity: 1; transform: translate(-50%, -50%); }
                }
              `}</style>

              {/* Soft warm solar insulation glow backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(46,107,101,0.03)_0%,transparent_60%)] animate-pulse pointer-events-none" />
              
              <img 
                ref={heroImageRef}
                src={detail.angles ? detail.angles[activeAngleIndex] : detail.img} 
                alt={detail.title} 
                className="w-full h-full object-contain max-h-[360px] pointer-events-none will-change-transform"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isDragging ? 1.05 : 1})`,
                  transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
              />

              {/* Pulsing CAD hotspots with draw-in SVG leader lines */}
              {HOTSPOTS.map((spot) => {
                const isActive = activeHotspot === spot.id;
                return (
                  <React.Fragment key={spot.id}>
                    {/* Pulsing Hotspot Target Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent rotation triggering
                        setActiveHotspot(isActive ? null : spot.id);
                      }}
                      className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 z-20 group/spot cursor-pointer"
                      style={{ top: spot.top, left: spot.left }}
                      aria-label={`Inspect ${spot.title}`}
                    >
                      <span className="absolute inset-0 rounded-full bg-[#2E6B65]/30 animate-ping" />
                      <span className={`absolute inset-1 rounded-full flex items-center justify-center border text-[9px] font-black transition-all ${
                        isActive 
                          ? 'bg-[#2E6B65] text-white border-white scale-110 shadow-lg' 
                          : 'bg-white text-[#2E6B65] border-[#2E6B65]/35 group-hover/spot:scale-110'
                      }`}>
                        +
                      </span>
                    </button>

                    {/* Leader Line SVG */}
                    {isActive && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        {/* Shadow line */}
                        <path
                          d={spot.linePath.replace(/([0-9]+)/g, '$1%')}
                          fill="none"
                          stroke="rgba(0, 0, 0, 0.08)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Active blue line */}
                        <path
                          d={spot.linePath.replace(/([0-9]+)/g, '$1%')}
                          fill="none"
                          stroke="#2E6B65"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeDasharray="100"
                          strokeDashoffset="100"
                          style={{
                            animation: 'drawPath 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                          }}
                        />
                      </svg>
                    )}

                    {/* Floating Spec Tag Card */}
                    {isActive && (
                      <div
                        className="absolute z-20 w-48 bg-slate-950/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-left pointer-events-auto -translate-x-1/2 -translate-y-1/2 select-none"
                        style={{ 
                          top: spot.tagTop, 
                          left: spot.tagLeft,
                          animation: 'fadeCard 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards'
                        }}
                      >
                        <span className="text-[7px] font-black text-cyan-450 uppercase tracking-[0.2em] block mb-0.5">CAD SPECIFICATION</span>
                        <h5 className="text-white font-extrabold text-[9px] uppercase tracking-wide leading-tight mb-1">{spot.title}</h5>
                        <p className="text-slate-400 text-[8px] leading-normal">{spot.desc}</p>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              
              {/* Interactive Cockpit HUD Status Overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm text-[8px] font-black tracking-widest px-3.5 py-2 uppercase rounded-full border border-white/5 text-white flex items-center gap-2 shadow-md pointer-events-none transition-all duration-300">
                <Move className={`w-3 h-3 text-cyan-400 ${isDragging ? 'animate-ping' : ''}`} />
                {isDragging ? 'Dragging to Rotate...' : activeHotspot !== null ? 'CAD Spec Active - Click + to Close' : 'Interactive 3D Render - Drag to Spin'}
              </div>
            </div>
            
            {/* Gallery angles */}
            <div className="grid grid-cols-3 gap-4 anim-fade-up">
              {(detail.angles || [detail.img, detail.img, detail.img]).map((imgSrc, i) => {
                const labels = ['Front View', 'CAD Profile', 'Installed View'];
                return (
                  <div 
                    key={i} 
                    onClick={() => setActiveAngleIndex(i)}
                    className={`bg-white border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      i === activeAngleIndex 
                        ? 'border-[#2E6B65] ring-2 ring-[#2E6B65]/10 scale-[1.02]' 
                        : 'border-slate-200/80 hover:border-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    <img src={imgSrc} alt={labels[i]} className="w-12 h-12 object-contain opacity-80 hover:opacity-100 transition-opacity mb-1 pointer-events-none" />
                    <span className={`text-[7px] font-black uppercase tracking-wider ${i === activeAngleIndex ? 'text-[#2E6B65]' : 'text-slate-400'}`}>
                      {labels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Premium 2-Column Feature Cards Grid */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] font-extrabold text-[#2E6B65] uppercase tracking-[0.25em] block mb-3 anim-fade-up">
              SUNITHA PRECISION ENGINEERING
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 anim-fade-up leading-tight text-slate-900">
              {detail.title}
            </h1>
            
            <p className="text-slate-500 text-base md:text-lg mb-10 leading-relaxed border-l-2 border-[#2E6B65] pl-6 anim-fade-up">
              {detail.overview}
            </p>

            <div className="w-full h-[1px] bg-slate-200 mb-10 anim-fade-up" />

            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2E6B65] mb-8 anim-fade-up">
              FEATURES & STRUCTURAL BENEFITS
            </h3>

            {/* 2-Column Technical Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 anim-fade-up">
              {detail.features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-5 rounded-xl bg-white border border-slate-200/80 hover:border-[#2E6B65]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-50 text-[#2E6B65] border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Middle Section: Light CAD Blueprint Configuration Options ────────────── */}
      <section className="bg-white border-y border-slate-200 py-24 mt-24 relative" id="options-slider">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(46,107,101,0.02)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 mb-4 text-center">
              {detail.title.toUpperCase()} OPTIONS TO CHOOSE FROM
            </h2>
            <p className="text-slate-500 max-w-4xl mx-auto text-sm leading-relaxed text-center px-4">
              Sunitha Enterprises is the premier fabricator of 2/3/4 track uPVC {detail.title.replace('uPVC ', '')}. Along with the track of your choice, you can also customise the windows with the sash, mesh, grill and hardware of your choice.
            </p>
          </div>

          {/* Slider track with blue navigation buttons */}
          <div className="relative max-w-6xl mx-auto flex items-center gap-4">
            
            {/* Left Button */}
            <button 
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-12 h-12 bg-[#2E6B65] hover:bg-[#004da3] shrink-0 flex items-center justify-center text-white transition-all active:scale-95 shadow-[0_4px_12px_rgba(46,107,101,0.3)] rounded-sm z-10"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3.5]" />
            </button>

            {/* Horizontal scrollable CAD Blueprint cards */}
            <div 
              ref={scrollContainerRef} 
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-6 flex-grow"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {detail.options.map((option, i) => (
                <div 
                  key={i} 
                  className="min-w-[280px] md:min-w-[310px] flex-shrink-0 flex flex-col items-center gap-4 bg-white/65 backdrop-blur-md border border-slate-200/60 hover:border-[#2E6B65]/40 p-6 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_45px_rgba(46,107,101,0.05)] transition-all duration-500 group"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Schematic card container (Light CAD blueprint dot grid background) */}
                  <div className="w-full h-48 bg-slate-50/50 border border-slate-200/50 flex items-center justify-center rounded-sm relative overflow-hidden select-none"
                       style={{ backgroundImage: 'radial-gradient(#2E6B65 0.75px, transparent 0.75px)', backgroundSize: '12px 12px' }}>
                    {option.svgPath}
                  </div>
                  {/* Centered bold capitalized text */}
                  <span className="text-[10px] font-extrabold text-slate-800 text-center uppercase tracking-wider block px-2 leading-relaxed h-12 flex items-center justify-center group-hover:text-[#2E6B65] transition-colors">
                    {option.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button 
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-12 h-12 bg-[#2E6B65] hover:bg-[#004da3] shrink-0 flex items-center justify-center text-white transition-all active:scale-95 shadow-[0_4px_12px_rgba(46,107,101,0.3)] rounded-sm z-10"
            >
              <ChevronRight className="w-6 h-6 stroke-[3.5]" />
            </button>

          </div>
        </div>
      </section>

      {/* ─── Specifications & Sizing Section ─── */}
      {detail.variants && detail.variants.length > 0 && (
        <section className="bg-white border-t border-slate-200 py-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col gap-20">
              {detail.variants.map((variant, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
                      
                      {/* Left/Content: Text & Sizing Table */}
                      <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h3 className="text-[28px] md:text-[34px] font-bold text-[#1e5288] tracking-tight mb-3">
                          {variant.name}
                        </h3>
                        <p className="text-slate-655 text-sm md:text-[14.5px] leading-relaxed mb-6">
                          {variant.desc}
                        </p>

                        {/* Specifications Table */}
                        <div className="w-full border border-slate-300 rounded-[6px] overflow-hidden">
                          <table className="w-full border-collapse text-left bg-white text-xs md:text-sm">
                            <thead>
                              <tr className="bg-[#2E6B65] text-white font-semibold uppercase tracking-wider text-[11px] md:text-[12px]">
                                <th className="px-5 py-3.5 w-7/12 font-bold">Parameter</th>
                                <th className="px-5 py-3.5 w-5/12 font-bold">Specifications</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {variant.specs.map((spec, sIdx) => {
                                // Smart split to render parameter names with subtitles
                                const parts = spec.parameter.split(' (');
                                const mainParam = parts[0];
                                const subParam = parts[1] ? parts[1].replace(')', '') : null;

                                return (
                                  <tr 
                                    key={sIdx} 
                                    className={`transition-colors duration-200 ${sIdx % 2 === 1 ? 'bg-slate-100/50' : 'bg-white'}`}
                                  >
                                    <td className="px-5 py-4">
                                      <div className="text-slate-800 text-xs sm:text-[13px] font-medium">
                                        {mainParam}
                                      </div>
                                      {subParam && (
                                        <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                                          {subParam}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-5 py-4 text-slate-800 text-xs sm:text-[13px] font-semibold">
                                      {spec.specification}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Size Limits Tag under the table */}
                        {variant.sizeLimits && (
                          <div className="mt-3.5 text-slate-500 text-[11.5px] font-semibold tracking-wide">
                            {variant.sizeLimits}
                          </div>
                        )}
                      </div>

                      {/* Right/Visual: High-Fidelity Rendering Image */}
                      <div className="w-full md:w-1/2 flex justify-center">
                        <div className="w-full max-w-[360px] aspect-square flex items-center justify-center">
                          <img 
                            src={variant.image} 
                            alt={variant.name} 
                            className="max-h-[300px] w-auto object-contain select-none pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)] transform hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Brochure-style Red/Coral Dashed Divider line */}
                    {idx < detail.variants.length - 1 && (
                      <div className="my-16 border-t-2 border-dashed border-red-300/80 w-full" />
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom Section: Premium Customization Console (Configurator cockpit) ─── */}
      <section ref={customRef} className="max-w-7xl mx-auto px-6 md:px-12 py-24 mt-10">
        
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-[#2E6B65] uppercase tracking-widest block mb-4">Live Customizer Console</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest mb-4 text-slate-900">
            Customise Your {detail.title.replace('uPVC ', '')}
          </h2>
          <PrecisionRulerAccent className="my-6" />
          <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Interact with our configuration console to review and select custom wood-grain lamination coatings, insulation levels, locks, and safety screen screens.
          </p>
        </div>

        {/* Tactile console grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-slate-200/80 rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative">
          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-blue-50/20 rounded-full blur-[60px] pointer-events-none" />

          {/* Left: Component selector category tabs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">
              Select Component
            </h3>
            
            {[
              { id: 'lamination', title: 'Colour / Lamination', icon: Palette, text: 'Choose rich woodgrain textures or contemporary solids.' },
              { id: 'glass', title: 'Glass Options', icon: Layers, text: 'Check thermal properties, DGU, and acoustic insulation levels.' },
              { id: 'hardware', title: 'Precision Hardware', icon: Hammer, text: 'Select secure lock handles, friction stays, and steel rollers.' },
              { id: 'mesh', title: 'Mesh & Safety Grills', icon: Shield, text: 'Configure custom insect screens and secure safety steel grills.' }
            ].map((tab) => {
              const isActive = selectedCustomTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <div 
                  key={tab.id}
                  onClick={() => setSelectedCustomTab(tab.id as any)}
                  className={`flex gap-4 p-5 rounded-xl cursor-pointer border transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50/40 to-slate-50 border-[#2E6B65]/50 shadow-[0_4px_20px_rgba(46,107,101,0.05)] scale-[1.01]' 
                      : 'bg-white border-slate-200/60 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isActive 
                      ? 'bg-blue-50 border-[#2E6B65] text-[#2E6B65]' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight mb-1 flex items-center gap-2">
                      {tab.title}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B65] animate-ping" />}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{tab.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selection output dynamic display workspace */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-200/60 rounded-xl p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
            
            {/* Lamination Category Workspace */}
            {selectedCustomTab === 'lamination' && (
              <div className="flex flex-col gap-6 h-full justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#2E6B65] font-extrabold block mb-1">Category: aluplast Lamination finishes</span>
                      <h4 className="text-xl font-bold uppercase text-slate-900">Choose Swatches & Finishes</h4>
                    </div>
                    {/* Sub-tabs switcher */}
                    <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/40 gap-1 text-[10px] uppercase font-bold tracking-wider">
                      <button 
                        onClick={() => {
                          setLaminationCategory('aludec');
                          setActiveColor(ALUDEC_SWATCHES[0]);
                        }}
                        className={`px-3 py-1.5 rounded-md transition-all duration-300 ${
                          laminationCategory === 'aludec' 
                            ? 'bg-white text-slate-900 shadow-sm font-black' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        aludec® Style
                      </button>
                      <button 
                        onClick={() => {
                          setLaminationCategory('woodec');
                          setActiveColor(WOODEC_SWATCHES[0]);
                        }}
                        className={`px-3 py-1.5 rounded-md transition-all duration-300 ${
                          laminationCategory === 'woodec' 
                            ? 'bg-white text-slate-900 shadow-sm font-black' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        woodec® Nature
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">
                    {laminationCategory === 'aludec' 
                      ? 'Replicates premium, matte powder-coated aluminum shells on uPVC with absolute weather-resistance.' 
                      : 'Emulates natural wood grain patterns and visual depth with a unique, textured wood feel.'
                    } Select a swatch below to preview:
                  </p>

                  {/* Swatches selector */}
                  <div className="flex flex-wrap gap-3 mb-6 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                    {(laminationCategory === 'aludec' ? ALUDEC_SWATCHES : WOODEC_SWATCHES).map((swatch, idx) => {
                      const isSelected = activeColor.name === swatch.name;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveColor(swatch)}
                          className={`flex items-center gap-2.5 px-3 py-1.5 border rounded-full text-xs font-bold transition-all duration-300 ${
                            isSelected 
                              ? 'bg-blue-50 border-[#2E6B65] text-slate-900 shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-350'
                          }`}
                        >
                          <span 
                            className="w-3 h-3 rounded-full border border-slate-200 shrink-0" 
                            style={{ 
                              backgroundColor: swatch.hex,
                              backgroundImage: laminationCategory === 'aludec' ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.22'/%3E%3C/svg%3E")` : undefined,
                              backgroundBlendMode: 'overlay',
                            }}
                          />
                          {swatch.name.replace('aludec ', '').replace('sheffield ', '').replace('turner ', '')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Swatch preview card */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-lg flex items-center gap-5 shadow-sm">
                  <div 
                    className="w-16 h-16 rounded-md border border-slate-200/80 shrink-0 shadow-inner flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      backgroundColor: activeColor.hex,
                      backgroundImage: laminationCategory === 'aludec' ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.22'/%3E%3C/svg%3E")` : undefined,
                      backgroundBlendMode: 'overlay',
                    }}
                  />
                  <div>
                    <h5 className="font-extrabold text-sm text-[#2E6B65] uppercase tracking-tight">{activeColor.name} Swatch</h5>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{activeColor.desc}</p>
                    <p className="text-slate-400 text-[10px] font-mono mt-1">Status: Active Selection · Samples Available</p>
                  </div>
                </div>
              </div>
            )}

            {/* Glass Category Workspace */}
            {selectedCustomTab === 'glass' && (
              <div className="flex flex-col gap-6 h-full justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#2E6B65] font-extrabold block mb-2">Category: Glass & Acoustics</span>
                  <h4 className="text-xl font-bold uppercase text-slate-900 mb-4">Insulation Glass Configurations</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-8">
                    Interact with our insulation slider to check the U-value thermal retention and sound reduction decibels for each glazing configuration:
                  </p>

                  {/* Glazing Tabs */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { level: 1, label: 'Single Glazed', uVal: 'Uf = 5.8', db: 'Sound: -20 dB' },
                      { level: 2, label: 'Double Glazed (DGU)', uVal: 'Uf = 1.6', db: 'Sound: -38 dB' },
                      { level: 3, label: 'Triple Glazed', uVal: 'Uf = 0.9', db: 'Sound: -45 dB' }
                    ].map((levelItem) => {
                      const isSelected = activeGlassLevel === levelItem.level;
                      return (
                        <button
                          key={levelItem.level}
                          onClick={() => setActiveGlassLevel(levelItem.level as any)}
                          className={`p-4 border rounded-xl flex flex-col text-left transition-all duration-300 ${
                            isSelected 
                              ? 'bg-blue-50/50 border-[#2E6B65] shadow-[0_4px_15px_rgba(46,107,101,0.05)] scale-[1.01]' 
                              : 'bg-white border-slate-200 hover:border-slate-350'
                          }`}
                        >
                          <span className="font-extrabold text-[10px] uppercase text-slate-800 mb-2">{levelItem.label}</span>
                          <span className="text-[#2E6B65] text-xs font-mono font-bold">{levelItem.uVal}</span>
                          <span className="text-slate-400 text-[10px] mt-1 font-mono">{levelItem.db}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating progress bar */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Insulation Rating</span>
                    <span className="text-xs text-[#2E6B65] font-bold">
                      {activeGlassLevel === 1 && 'Basic Protection'}
                      {activeGlassLevel === 2 && 'Advanced Energy Saver'}
                      {activeGlassLevel === 3 && 'Ultimate Passive House'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2E6B65] to-blue-500 transition-all duration-500"
                      style={{ width: activeGlassLevel === 1 ? '33%' : activeGlassLevel === 2 ? '66%' : '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hardware Category Workspace */}
            {selectedCustomTab === 'hardware' && (
              <div className="flex flex-col gap-6 h-full justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#2E6B65] font-extrabold block mb-2">Category: Metal Hardware</span>
                  <h4 className="text-xl font-bold uppercase text-slate-900 mb-4">Precision Locking & Smooth Rolling stays</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">
                    A window\'s operational lifespan depends entirely on its structural metal stays. Sunitha Enterprises imports certified hardware built to last 50,000 cycles:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Multi-Point Security Lock', desc: 'Activates interlocking steel bolts at up to 6 perimeter points, preventing forced opening.' },
                      { name: 'EPDM Double-Hollow Gasket', desc: 'Synthetic rubber weather-stripping that compresses tightly, blocking whistling winds.' },
                      { name: 'Heavy Tandem Brass Rollers', desc: 'Double-row bottom wheels that distribute panel load for quiet, smooth gliding.' },
                      { name: 'Perimeter Friction Hinges', desc: 'Stainless steel stays that hold windows stable at any angle against gusts.' }
                    ].map((hw, i) => (
                      <div key={i} className="bg-white border border-slate-200/80 p-4 rounded-lg flex gap-3">
                        <Check className="w-4 h-4 text-[#2E6B65] shrink-0 mt-0.5" />
                        <div>
                          <h6 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">{hw.name}</h6>
                          <p className="text-slate-500 text-[10px] leading-relaxed mt-1">{hw.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mesh & Grills Category Workspace */}
            {selectedCustomTab === 'mesh' && (
              <div className="flex flex-col gap-6 h-full justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#2E6B65] font-extrabold block mb-2">Category: Safety screen systems</span>
                  <h4 className="text-xl font-bold uppercase text-slate-900 mb-4">High-Tensile Wire Mesh & Safety Grills</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">
                    Configure custom barrier systems to filter out mosquitoes, block dust, and secure your home from break-ins:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Fiberglass Insect Screen', desc: 'Non-combustible, near-invisible mesh that filters out mosquitoes while letting light pass.' },
                      { name: 'SS304 Marine Steel Mesh', desc: 'Heavy-gauge stainless steel mesh resistant to claws, impacts, and blades for active security.' },
                      { name: 'Built-In Structural Grill', desc: 'Heavy-duty steel grill rods anchored directly inside the profile\'s internal steel core.' },
                      { name: 'Pleated Accordion Screen', desc: 'Retractable pleated insect screen that folds out of sight inside side profiles.' }
                    ].map((mesh, i) => (
                      <div key={i} className="bg-white border border-slate-200/80 p-4 rounded-lg flex gap-3">
                        <Check className="w-4 h-4 text-[#2E6B65] shrink-0 mt-0.5" />
                        <div>
                          <h6 className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">{mesh.name}</h6>
                          <p className="text-slate-500 text-[10px] leading-relaxed mt-1">{mesh.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
