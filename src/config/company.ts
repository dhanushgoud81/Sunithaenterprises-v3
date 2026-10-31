/**
 * Company details — the single place to edit contact information.
 *
 * ⚠️ PLACEHOLDERS: every value below was carried over from a previous project
 * and is NOT yet verified for Sunitha Enterprises. Replace them with the real
 * details; every page (navbar, footer, contact page, WhatsApp button, form)
 * reads from here.
 */
export const COMPANY = {
  name: 'Sunitha Enterprises',
  tagline: 'uPVC Windows & Doors',

  phoneDisplay: '+91 98660 89771',        // PLACEHOLDER
  phoneHref: 'tel:+919866089771',         // PLACEHOLDER
  whatsappNumber: '919866089771',         // PLACEHOLDER (digits only, with country code)
  email: 'sales@srikalaprojects.com',     // PLACEHOLDER

  /** Inbox that receives contact-form submissions through FormSubmit.co */
  formInbox: 'ssrikalaprojects@gmail.com', // PLACEHOLDER
  formCc: 'sales@srikalaprojects.com',     // PLACEHOLDER

  hours: 'Mon–Sat, 09:00–18:00 IST',

  addressShort: 'Maheshwaram Mandal, Ranga Reddy, Telangana', // PLACEHOLDER
  addressLines: [                                             // PLACEHOLDER
    'Near Mankal Kaman, Sry No.319/A/1B/1C,',
    'Mankal, Tukkuguda, Maheshwaram Mandal,',
    'Ranga Reddy, Telangana - 501359',
  ],
  mapUrl: 'https://maps.app.goo.gl/8CgULSLTmw5RoYWv7',       // PLACEHOLDER

  socials: [                                                  // PLACEHOLDERS
    { label: 'Facebook', href: 'https://www.facebook.com/p/Srikala-projects-100054633062340/' },
    { label: 'Instagram', href: 'https://www.instagram.com/srikala_projects?igsh=MWsxbWN1Ympqd3djMA==' },
    { label: 'IndiaMART', href: 'https://m.indiamart.com/srikalaprojects/' },
  ],
} as const;

export const whatsappLink = (message = "Hi Sunitha Enterprises, I'm interested in your uPVC windows & doors. Could you share more details?") =>
  `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
