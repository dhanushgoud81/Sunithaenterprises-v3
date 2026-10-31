import React, { useRef, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { PageWrapper } from './components/Shared';
import { useReveal } from './components/ui';
import { COMPANY, whatsappLink } from './config/company';
import { cn } from './lib/utils';

// Submissions are delivered by FormSubmit.co to the inbox set in src/config/company.ts.
// The first submission triggers a one-time activation email to that inbox.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${COMPANY.formInbox}`;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const PRODUCTS = [
  'Sliding windows & doors',
  'Casement windows',
  'Tilt & turn windows',
  'Arch windows',
  'Combination windows',
  'Villa windows',
  'Not sure yet',
];

const field = 'peer w-full rounded-[2px] border border-rule bg-white px-4 pt-6 pb-2.5 text-[1rem] text-ink outline-none transition-colors focus:border-glass placeholder-transparent';
const label = 'pointer-events-none absolute left-4 top-2 text-xs text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.9375rem] peer-focus:top-2 peer-focus:text-xs peer-focus:text-glass';

function Field({ id, name, text, type = 'text', required, autoComplete, inputMode }: {
  id: string; name: string; text: string; type?: string; required?: boolean; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div className="relative">
      <input id={id} name={name} type={type} required={required} placeholder=" " autoComplete={autoComplete} inputMode={inputMode} className={field} />
      <label htmlFor={id} className={label}>{text}{required && <span className="text-glass"> *</span>}</label>
    </div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>('idle');
  useReveal(ref);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setFormState('submitting');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(formRef.current),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setFormState('success'); formRef.current.reset(); }
      else setFormState('error');
    } catch {
      setFormState('error');
    }
  };

  const channels = [
    { icon: Phone, label: 'Call', value: COMPANY.phoneDisplay, href: COMPANY.phoneHref, mono: true },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Send us your sizes or photos', href: whatsappLink(), external: true },
    { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: Clock, label: 'Hours', value: COMPANY.hours },
  ];

  return (
    <PageWrapper>
      <section ref={ref} className="bg-paper" id="contact-hero" aria-labelledby="contact-title">
        <div className="shell pt-16 pb-12 lg:pt-24 lg:pb-16">
          <p data-reveal className="eyebrow text-glass mb-5">Contact</p>
          <h1 id="contact-title" data-reveal className="display-xl max-w-[16ch]">Get a quote for your windows.</h1>
          <p data-reveal className="mt-6 text-muted text-lg measure">
            Tell us about your openings. We'll review the details and get back to you with a recommendation and a preliminary quote.
          </p>
        </div>

        <div className="shell pb-20 lg:pb-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Channels */}
          <aside className="lg:col-span-4 flex flex-col gap-10">
            <ul className="flex flex-col border-t border-rule">
              {channels.map(c => {
                const inner = (
                  <>
                    <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-glass" aria-hidden="true" />
                    <span className="flex flex-col gap-1">
                      <span className="eyebrow text-muted">{c.label}</span>
                      <span className={cn('text-[1.0625rem] text-ink break-words', c.mono && 'font-mono tabular')}>{c.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={c.label} data-reveal className="border-b border-rule">
                    {c.href ? (
                      <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener noreferrer' : undefined} className="group flex gap-4 py-5 hover:text-glass">
                        {inner}
                        <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-rule transition-all group-hover:translate-x-1 group-hover:text-glass" aria-hidden="true" />
                      </a>
                    ) : <div className="flex gap-4 py-5">{inner}</div>}
                  </li>
                );
              })}
            </ul>

            <a data-reveal href={COMPANY.mapUrl} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-[4px] bg-mist aspect-[4/3]">
              <img src="/images/location-map.jpg" alt="Map showing the Sunitha Enterprises workshop location" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
              <span className="absolute inset-x-3 bottom-3 flex items-start gap-3 rounded-[2px] bg-anthracite/90 p-4 text-white backdrop-blur">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-glass-bright" aria-hidden="true" />
                <span className="text-sm leading-relaxed">
                  <span className="block font-medium">Workshop & office</span>
                  <span className="text-white/65">{COMPANY.addressLines.join(' ')}</span>
                </span>
              </span>
            </a>
          </aside>

          {/* Form */}
          <div data-reveal className="lg:col-span-8 rounded-[4px] border border-rule bg-white p-6 sm:p-10" id="contact-form">
            {formState === 'success' ? (
              <div className="flex flex-col items-start gap-5 py-10" role="status">
                <CheckCircle2 className="h-12 w-12 text-glass" aria-hidden="true" />
                <h2 className="text-3xl font-semibold font-semiwide">Thanks, we've received your request.</h2>
                <p className="text-muted measure">Our team will review your project and reply within 12 hours on working days.</p>
                <button onClick={() => setFormState('idle')} className="btn btn-line mt-2">Send another request</button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
                <div className="sm:col-span-2 mb-2">
                  <h2 className="text-2xl font-semibold font-semiwide">Project details</h2>
                  <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
                </div>
                <input type="hidden" name="_cc" value={COMPANY.formCc} />
                <input type="hidden" name="_subject" value="New quote request · Sunitha Enterprises website" />
                <input type="hidden" name="_template" value="table" />
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <Field id="cf-name" name="name" text="Full name" required autoComplete="name" />
                <Field id="cf-phone" name="phone" text="Phone" type="tel" autoComplete="tel" inputMode="tel" />
                <Field id="cf-email" name="email" text="Email" type="email" required autoComplete="email" />
                <Field id="cf-city" name="city" text="City / site location" autoComplete="address-level2" />

                <div className="relative">
                  <select id="cf-product" name="product" defaultValue="" className={cn(field, 'appearance-none pr-10')}>
                    <option value="" disabled>Choose a product</option>
                    {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <label htmlFor="cf-product" className="pointer-events-none absolute left-4 top-2 text-xs text-muted">Product</label>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                </div>
                <Field id="cf-count" name="windows" text="Approx. number of windows" type="number" inputMode="numeric" />

                <div className="relative sm:col-span-2">
                  <textarea id="cf-message" name="message" required rows={5} placeholder=" " className={cn(field, 'resize-none')} />
                  <label htmlFor="cf-message" className={label}>Sizes, rooms and anything else we should know<span className="text-glass"> *</span></label>
                </div>

                {formState === 'error' && (
                  <p className="sm:col-span-2 text-sm text-[#a3341f]" role="alert">
                    We couldn't send your request. Check your connection and try again, or message us on WhatsApp.
                  </p>
                )}

                <div className="sm:col-span-2 flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted">Prefer to talk? <a className="link-arrow" href={COMPANY.phoneHref}>Call us</a></p>
                  <button type="submit" disabled={formState === 'submitting'} className="btn btn-primary w-full sm:w-auto">
                    {formState === 'submitting' ? 'Sending…' : 'Send request'}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
