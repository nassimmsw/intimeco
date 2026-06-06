import { Phone, MapPin } from 'lucide-react';

function InstagramIcon({ size = 20, color = '#1C2340' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const MAPS_URL = 'https://maps.app.goo.gl/eQraDcmneZppr5d26';

export default function ContactSection() {
  return (
    <section id="contact" className="py-14 px-4 bg-white">
      <div className="max-w-screen-md mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <h2
            className="font-serif text-[#1C2340]"
            style={{ fontSize: '22px', letterSpacing: '0.08em', fontWeight: 600 }}
          >
            Contactez-nous
          </h2>
          <p
            className="font-sans text-[#9CA3AF] italic mt-1"
            style={{ fontSize: '15px' }}
          >
            Nous sommes a votre ecoute
          </p>
        </div>

        {/* Contact rows */}
        <div className="space-y-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/inti.me15"
            target="_blank"
            rel="noopener noreferrer"
            id="contact-instagram"
            className="flex items-center gap-4 p-5 rounded-2xl bg-[#FDE8EC] hover:bg-[#F9D7DA] transition-colors duration-200 group"
          >
            <div
              className="flex-none flex items-center justify-center rounded-full bg-white"
              style={{ width: '48px', height: '48px' }}
            >
              <InstagramIcon size={22} color="#1C2340" />
            </div>
            <div>
              <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                Instagram
              </p>
              <p className="font-sans text-[#5A6080]" style={{ fontSize: '15px' }}>
                @inti.me15
              </p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C2340" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+213555000000"
            id="contact-phone"
            className="flex items-center gap-4 p-5 rounded-2xl bg-[#FDE8EC] hover:bg-[#F9D7DA] transition-colors duration-200 group"
          >
            <div
              className="flex-none flex items-center justify-center rounded-full bg-white"
              style={{ width: '48px', height: '48px' }}
            >
              <Phone size={22} color="#1C2340" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                Telephone
              </p>
              <p className="font-sans text-[#5A6080]" style={{ fontSize: '15px' }}>
                +213 555 00 00 00
              </p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C2340" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </div>
          </a>

          {/* Location */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-location"
            className="flex items-center gap-4 p-5 rounded-2xl bg-[#FDE8EC] hover:bg-[#F9D7DA] transition-colors duration-200 group"
          >
            <div
              className="flex-none flex items-center justify-center rounded-full bg-white"
              style={{ width: '48px', height: '48px' }}
            >
              <MapPin size={22} color="#1C2340" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                Boutique
              </p>
              <p className="font-sans text-[#5A6080]" style={{ fontSize: '15px' }}>
                Blida, Algerie
              </p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C2340" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
