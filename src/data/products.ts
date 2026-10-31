import { Thermometer, Volume2, Shield, Wind, Wrench, Sun, Droplets, Layers } from 'lucide-react';

// ─── Why uPVC ─────────────────────────────────────────────────────────────────
export const WHY_UPVC = [
  {
    icon: Thermometer,
    title: 'Thermal Insulation',
    desc: 'Multi-chamber uPVC profiles trap air, dramatically reducing heat transfer. Keeps interiors cool in summer and warm in winter — cutting energy bills year-round.',
  },
  {
    icon: Volume2,
    title: 'Sound Insulation',
    desc: 'Double and triple-glazed uPVC windows reduce external noise by up to 45 dB — ideal for homes near busy roads, airports, or commercial zones.',
  },
  {
    icon: Shield,
    title: 'Security',
    desc: 'Multi-point locking systems and reinforced steel inside every profile make uPVC windows highly resistant to forced entry.',
  },
  {
    icon: Wind,
    title: 'Wind & Weather Resistance',
    desc: 'uPVC profiles are engineered to withstand wind loads up to 2 kPa and resist UV degradation, rain, and humidity without warping or rusting.',
  },
  {
    icon: Wrench,
    title: 'Zero Maintenance',
    desc: 'Unlike wood, uPVC never needs painting, polishing, or treating. A simple wipe-down keeps it looking new for decades.',
  },
  {
    icon: Sun,
    title: 'UV & Corrosion Resistant',
    desc: 'UV-stabilised outer layer prevents discolouration and degradation even in harsh Indian climates — coastal, tropical, or extreme heat.',
  },
  {
    icon: Droplets,
    title: 'Waterproof',
    desc: 'uPVC is completely waterproof and does not swell, rot, or corrode — making it the ideal choice for bathrooms, kitchens, and coastal buildings.',
  },
  {
    icon: Layers,
    title: 'Design Flexibility',
    desc: 'Available in white and wood-look laminations — Walnut, Dark Oak, Mahogany, Golden Oak — to complement any architectural style.',
  },
];

// ─── Profile Types ────────────────────────────────────────────────────────────
export const PROFILES = [
  {
    id: 'ideal-1000',
    name: 'IDEAL 1000',
    tagline: '54 mm · 3-Chamber Casement',
    desc: 'The optimal aluplast 3-chamber casement system engineered for Indian tropical conditions. Suited for outward open windows, providing stable construction depth and fully compatible with existing glazing beads.',
    specs: [
      { label: 'Construction Depth', value: '54 mm' },
      { label: 'Profile System', value: '3-Chamber' },
      { label: 'Glazing Thickness', value: 'Up to 24 mm' },
      { label: 'Ideal Application', value: 'Outward Open Windows' },
      { label: 'Glazing Beads', value: 'Compatible' },
      { label: 'Country Launch', value: 'Made in India' },
    ],
    features: [
      '54 mm construction depth for stable outer walls',
      'Accommodates glass up to 24 mm thickness',
      'Certified 3-chamber structural insulation system',
      'Good choice for outward opening casement panes',
      'Perfect styling with existing architectural glazing beads',
      'Compatible with Mivan Construction technology guidelines',
    ],
    img: '/images/profile-casement.jpg',
  },
  {
    id: 'prima-slide',
    name: 'prima-slide',
    tagline: '54 mm · 2 & 3-Track Sliding',
    desc: 'The specialized aluplast India sliding system built for both windows and doors. Engineered to withstand heavy winds with smooth track performance and extra track slot options.',
    specs: [
      { label: 'Construction Depth', value: '54 mm' },
      { label: 'Wind Resistance', value: 'High Wind Loads' },
      { label: 'Glazing Thickness', value: 'Up to 11 mm' },
      { label: 'Track Options', value: '2-track & 3-track' },
      { label: 'Extra Track', value: 'Additional option' },
      { label: 'System Suitability', value: 'Windows & Doors' },
    ],
    features: [
      '54 mm Construction depth for smooth sliding operation',
      'Available in 2-track and 3-track sliding layouts',
      'Accommodates glass panes up to 11 mm thickness',
      'Designed with high static resistance to severe wind load',
      'Additional track option for mosquito fly mesh profiles',
      'Engineered specifically for Indian climatic extremes',
    ],
    img: '/images/profile-sliding.jpg',
  },
  {
    id: 'ideal-2000',
    name: 'IDEAL 2000®',
    tagline: '60 mm · 3-Chamber Core System',
    desc: 'Engineered with classic aluplast-technology, the IDEAL 2000® system features a 60 mm construction depth and a 3-chamber core. It delivers excellent thermal values and outstanding sound insulation up to 43 dB (class IV).',
    specs: [
      { label: 'Construction Depth', value: '60 mm' },
      { label: 'Profile System', value: '3-Chamber Core' },
      { label: 'Glazing Thickness', value: 'Up to 35 mm' },
      { label: 'Thermal Insulation', value: 'Uf = 1.6 W/m²K' },
      { label: 'Sound Protection', value: 'Up to 43 dB (Class IV)' },
      { label: 'Sealing Gaskets', value: 'EPDM Seals' },
    ],
    features: [
      '60 mm construction depth for perfect structural stability',
      '3-chamber profile core providing an excellent thermal barrier',
      'Glazing thickness support up to 35 mm for robust double glazing',
      'Outstanding thermal insulation value of Uf = 1.6 W/m²K',
      'Outstanding sound insulation up to sound transmission class IV (43 dB)',
      'Highly resistant to weathering and extreme tropical climate conditions',
    ],
    img: '/images/profile-ideal-2000.jpg',
  },
  {
    id: 'ideal-4000',
    name: 'IDEAL 4000®',
    tagline: '70 mm · 5-Chamber Premium',
    desc: 'The ultimate aluplast heavy-duty casement profile system. Delivers top-tier thermal insulation and sound dampening class up to 45 dB with option for aluskin® aluminum cover shells.',
    specs: [
      { label: 'Construction Depth', value: '70 mm' },
      { label: 'Thermal Core', value: 'Uf = 1.3 W/m²K' },
      { label: 'Total Value', value: 'Uw = 0.99 W/m²K' },
      { label: 'Glazing Thickness', value: 'Up to 41 mm' },
      { label: 'Sound Barrier', value: 'Up to 45 dB (Class 4)' },
      { label: 'Alu covers', value: 'aluskin® compatible' },
    ],
    features: [
      'Premium 70 mm construction depth with 5 thermal chambers',
      'Unmatched acoustic insulation dampening up to 45 dB',
      'Outstanding Uw energy values down to 0.99 W/m²K',
      'Supports thick structural safety double & triple glass up to 41 mm',
      'Optional aluskin® clip-on external aluminum covers possible',
      'Available in numerous premium color and timber decor variations',
    ],
    img: '/images/profile-ideal-4000.jpg',
  },
  {
    id: 'smart-slide',
    name: 'smart-slide',
    tagline: '70 mm · Premium Sliding Star',
    desc: 'The next generation of high-end sliding doors. Features a compact 70 mm construction depth, an ultra-low Uf value of 1.4 W/m²K, innovative concealed hardware technology, a self-closing mechanism, and continuous compression gaskets for excellent sealing.',
    specs: [
      { label: 'Construction Depth', value: '70 mm' },
      { label: 'Thermal Value', value: 'Uf = 1.4 W/m²K' },
      { label: 'Glazing Thickness', value: 'Up to 41 mm' },
      { label: 'Opening Schema', value: 'Schema A + C' },
      { label: 'Hardware Tech', value: 'Fully Concealed' },
      { label: 'Adhesive Tech', value: 'Optional Bonding' },
    ],
    features: [
      '70 mm premium construction depth for sleek minimalist design',
      'Outstanding heat barrier value of Uf = 1.4 W/m²K',
      'Accommodates single- to triple-glazed performance units up to 41 mm',
      'Modern classic-line profiles presenting elegant clean edges',
      'Concealed hardware technology ensuring complete security & luxury',
      'Convenient self-closing and continuous compression for excellent sealing',
    ],
    img: '/images/profile-smart-slide.jpg',
  },
  {
    id: 'vario-slide',
    name: 'vario-slide',
    tagline: '2 & 3-Track · Highly Versatile Sliding',
    desc: 'A highly flexible, premium sliding system supporting 2-track and 3-track configurations. Compatible with woodec and aludec surfaces, it provides a stable aluminium interlock and excellent statics for large architectural elements.',
    specs: [
      { label: 'Glazing Range', value: '4 mm - 24 mm' },
      { label: 'Track Versions', value: '2 or 3-track' },
      { label: 'Surface Finishes', value: 'woodec / aludec' },
      { label: 'Drainage Tech', value: 'Concealed drainage' },
      { label: 'Interlock Support', value: 'Aluminium Bar' },
      { label: 'Statics Rating', value: 'High Element Statics' },
    ],
    features: [
      'Glazing flexibility ranging from 4 mm up to 24 mm thickness',
      'Available in highly custom 2-track and 3-track configurations',
      'Support for ultra-premium woodec and aludec modern finishes',
      'Concealed drainage paths and standard profile aeration features',
      'Stable mechanical interlock with internal architectural aluminium',
      'Excellent structural statics for grand, double-height sliding elements',
    ],
    img: '/images/profile-vario-slide.jpg',
  },
  {
    id: 'easy-slide',
    name: 'easy-slide',
    tagline: 'Elegant · High-Reinforcement Sliding',
    desc: 'An elegant sliding system featuring exchangeable gaskets and integrated structural steel reinforcement. Perfect for standard openings requiring lightweight, durable operations.',
    specs: [
      { label: 'Glazing Thickness', value: 'Up to 20 mm' },
      { label: 'Gasket System', value: 'Exchangeable gaskets' },
      { label: 'Steel Reinforce', value: 'Frame & Sash' },
      { label: 'Aesthetics', value: 'Elegant Design' },
      { label: 'Operation', value: 'Smooth Gliding' },
      { label: 'Weather Seal', value: 'EPDM Seals' },
    ],
    features: [
      'Accommodates performance insulated glass units up to 20 mm',
      'Elegant, minimalist framing contours to maximize daylight intake',
      'Exchangeable continuous gaskets for simple future maintenance',
      'High-grade steel reinforcement integrated inside both frame and sash',
      'Superb structural values resisting local tropical wind loads',
      'Engineered for long-lasting, smooth horizontal gliding',
    ],
    img: '/images/profile-easy-slide.jpg',
  },
  {
    id: 'mono-slide',
    name: 'mono-slide',
    tagline: '60 mm · Monorail Sliding Concept',
    desc: 'A unique monorail system combining fixed and movable panes in a single frame. Built on a standardized 60 mm frame, it features a built-in PVC interlock for perfect weather sealing.',
    specs: [
      { label: 'Glazing Thickness', value: 'Up to 8 mm' },
      { label: 'Layout Concept', value: 'Fixed + Movable sashes' },
      { label: 'Gaskets System', value: 'Exchangeable gaskets' },
      { label: 'Frame Standard', value: '60 mm System' },
      { label: 'Sealing Tech', value: 'Integrated PVC Interlock' },
      { label: 'Combinations', value: 'Fanlights Available' },
    ],
    features: [
      'Designed to accommodate single glazing sheets up to 8 mm thickness',
      'Unique sliding window coupling a fixed picture pane with a moving sash',
      'Integrated PVC interlock profile to guarantee perfect airtight sealing',
      'Exchangeable weather gaskets for excellent protection',
      'Standardized 60 mm frame depth compatible with extensive accessories',
      'Supports complex custom layouts, including fanlights and window combos',
    ],
    img: '/images/profile-mono-slide.jpg',
  }
];

// ─── Lamination Options ───────────────────────────────────────────────────────
export const ALUDEC_LAMINATIONS = [
  { name: 'aludec DB703',       bg: '#434749', desc: 'Metallic iron mica with fine sparkles', texture: '/images/textures/texture-aludec-db703.jpg' },
  { name: 'aludec jet black',   bg: '#0e0f11', desc: 'Ultra-matt deep architectural black', texture: '/images/textures/texture-aludec-jet-black.jpg' },
  { name: 'aludec window grey', bg: '#8c8e90', desc: 'Sleek industrial window grey', texture: '/images/textures/texture-aludec-window-grey.jpg' },
  { name: 'aludec basalt grey', bg: '#3a3f41', desc: 'Elegant dark volcanic basalt stone', texture: '/images/textures/texture-aludec-basalt-grey.jpg' },
  { name: 'aludec anthracite grey', bg: '#2b2d30', desc: 'Prestige deep dark anthracite', texture: '/images/textures/texture-aludec-anthracite-grey.jpg' },
  { name: 'aludec traffic white', bg: '#e8e9eb', desc: 'Satin powder-coated traffic white', texture: '/images/textures/texture-aludec-traffic-white.jpg' },
  { name: 'aludec umbra grey',  bg: '#463f3a', desc: 'Warm organic earthy umbra grey', texture: '/images/textures/texture-aludec-umbra-grey.jpg' },
];

export const WOODEC_LAMINATIONS = [
  { name: 'sheffield oak alpine', bg: '#cdbeab', desc: 'Pale Scandinavian timber grain', texture: '/images/textures/texture-woodec-sheffield-oak-alpine.jpg' },
  { name: 'sheffield oak concrete',bg: '#9f9284', desc: 'Cool concrete grey oak touch', texture: '/images/textures/texture-woodec-sheffield-oak-concrete.jpg' },
  { name: 'turner oak toffee',   bg: '#b08754', desc: 'Rich honey oak woodgrain', texture: '/images/textures/texture-woodec-turner-oak-toffee.jpg' },
  { name: 'turner oak malt',     bg: '#c5b095', desc: 'Sandy-malt natural wood aesthetic', texture: '/images/textures/texture-woodec-turner-oak-malt.jpg' },
];

// ─── Window Types ─────────────────────────────────────────────────────────────
export const WINDOW_TYPES = [
  { num: '01', title: 'Sliding Windows', desc: 'Sleek and space-saving — sliding windows provide smooth operation and modern aesthetics for any room.', img: '/images/sliding-windows.jpg', overview: 'Glide horizontally on tracks requiring no swing space. Available in 2-track and 3-track configurations with wind resistance up to 2 kPa.', features: ['2-track & 3-track configurations', 'Wind resistance up to 2 kPa', 'Smooth stainless steel rollers', 'Anti-lift security locks', 'Glazing up to 11 mm', 'Max size 2.2 m × 2.1 m'], applications: ['Apartments & high-rises', 'Commercial buildings', 'Industrial facilities'] },
  { num: '02', title: 'Casement Windows', desc: 'Reliable, energy-efficient, and versatile — casement windows offer maximum ventilation and superior security.', img: '/images/casement-windows.jpg', overview: 'Hinged at the side and opening outward like a door, casement windows provide excellent ventilation, unobstructed views, and a tight seal when closed.', features: ['Maximum ventilation with full opening', 'Multi-point locking for superior security', 'Excellent thermal and acoustic insulation', 'Available in single and double sash', 'Easy to clean from inside', 'Compatible with mosquito mesh'], applications: ['Residential bedrooms & living rooms', 'Commercial offices', 'Schools & institutions'] },
  { num: '03', title: 'Arch Windows', desc: "Elevate your home's aesthetic with beautifully designed arch windows that bring timeless charm.", img: '/images/arch-windows.jpg', overview: 'Curved top adds elegance and grandeur to any facade. Available as fixed or with operable lower sections in any radius.', features: ['Custom arch profiles to any radius', 'Fixed or operable lower section', 'Seamless curved uPVC extrusion', 'Matches standard window systems', 'Available in all lamination finishes', 'Adds architectural character'], applications: ['Heritage & luxury residences', 'Churches & institutions', 'Premium commercial buildings'] },
  { num: '04', title: 'Combination Windows', desc: 'Versatile combination systems that blend fixed, sliding, and casement panels into one seamless unit.', img: '/images/combination-windows.jpg', overview: 'Combination windows merge multiple window types — fixed, operable, and ventilator — into a single frame system, maximising light, ventilation, and design flexibility.', features: ['Mix of fixed and operable panels', 'Custom configurations available', 'Seamless frame joining', 'Maximises natural light', 'Suitable for large openings', 'Available in all profile systems'], applications: ['Living rooms & lobbies', 'Commercial facades', 'Institutional buildings'] },
  { num: '05', title: 'Tilt and Turn Windows', desc: "Innovative and flexible — tilt-and-turn windows offer easy ventilation control and enhanced security.", img: '/images/tilt-turn-windows.jpg', overview: "Two opening modes with a single handle — tilt inward from the top for secure ventilation, or turn fully open like a casement. Ideal for high-rise buildings.", features: ['Two opening modes with one handle', 'Tilt mode for secure ventilation', 'Turn mode for full access & cleaning', 'Child-safe ventilation position', 'Excellent burglar resistance', 'Ideal for high-rise buildings'], applications: ['High-rise apartments', 'Hotels & serviced apartments', 'Healthcare facilities'] },
  { num: '06', title: 'Villa Windows', desc: 'Premium large-format uPVC windows designed for villas and luxury residences demanding elegance and performance.', img: '/images/villa-windows.jpg', overview: 'Villa windows are large-format, high-performance uPVC systems designed for premium residences. They combine expansive glass areas with robust profiles for maximum light, views, and thermal comfort.', features: ['Large-format glass panels', 'Premium multi-point locking', 'Superior thermal & acoustic performance', 'Floor-to-ceiling options available', 'Available in all lamination finishes', 'Custom sizes for any opening'], applications: ['Luxury villas & bungalows', 'Premium residential projects', 'Resort & hospitality buildings'] },
];

// ─── Routing helpers ──────────────────────────────────────────────────────────
/** Product-detail keys (as used by UPVCProductDetail) ⇄ URL slugs */
export const PRODUCT_SLUGS: Record<string, string> = {
  'sliding-windows': 'Sliding Windows',
  'casement-windows': 'Casement Windows',
  'arch-windows': 'Arch Windows',
  'combination-windows': 'Combination Windows',
  'tilt-and-turn-windows': 'Tilt and Turn Windows',
  'villa-windows': 'Villa Windows',
};

export const slugForProduct = (title: string) =>
  Object.entries(PRODUCT_SLUGS).find(([, t]) => t === title)?.[0] ?? 'sliding-windows';

/** How each window type opens — drives the 3D type viewer. */
export type WindowKind = 'sliding' | 'casement' | 'arch' | 'combination' | 'tilt-turn' | 'villa';
export const KIND_BY_TITLE: Record<string, WindowKind> = {
  'Sliding Windows': 'sliding',
  'Casement Windows': 'casement',
  'Arch Windows': 'arch',
  'Combination Windows': 'combination',
  'Tilt and Turn Windows': 'tilt-turn',
  'Villa Windows': 'villa',
};

// ─── Benefit groups (Why uPVC) — each maps to a part of the profile cut-through ─
export type ProfilePart = 'chambers' | 'glass' | 'steel' | 'gaskets' | 'surface';
export const BENEFIT_GROUPS: { id: string; title: string; part: ProfilePart; partLabel: string; items: string[] }[] = [
  { id: 'comfort', title: 'Comfort', part: 'chambers', partLabel: 'Multi-chamber profile', items: ['Thermal Insulation'] },
  { id: 'quiet', title: 'Quiet', part: 'glass', partLabel: 'Double-glazed unit', items: ['Sound Insulation'] },
  { id: 'protection', title: 'Protection', part: 'steel', partLabel: 'Steel reinforcement', items: ['Security', 'Wind & Weather Resistance'] },
  { id: 'sealed', title: 'Sealed', part: 'gaskets', partLabel: 'EPDM gaskets', items: ['Waterproof', 'UV & Corrosion Resistant'] },
  { id: 'design', title: 'Low upkeep, any look', part: 'surface', partLabel: 'Laminated uPVC surface', items: ['Zero Maintenance', 'Design Flexibility'] },
];

export const profileCategory = (p: { tagline: string; name: string }) =>
  /slid/i.test(p.tagline + p.name) ? 'Sliding' : 'Casement';
