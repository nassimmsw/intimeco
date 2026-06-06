import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '../hooks/useStoreSettings';

const MAPS_URL = 'https://maps.app.goo.gl/ed64wpYFhfYRzWwg6';
const MAP_COORDS = '36.5381866,3.8321025';
const EMBED_URL = `https://www.google.com/maps?q=${MAP_COORDS}&z=18&output=embed`;

export default function StoreBoutique({ settings = DEFAULT_STORE_SETTINGS }) {
  const storeName = settings.store_name || DEFAULT_STORE_SETTINGS.store_name;
  const address = settings.store_address || DEFAULT_STORE_SETTINGS.store_address;
  const hours = settings.store_hours || DEFAULT_STORE_SETTINGS.store_hours;

  function getDirections() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(`geo:${MAP_COORDS}?q=${MAP_COORDS}(${encodeURIComponent(storeName)})`, '_self');
    } else {
      window.open(MAPS_URL, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <section
      id="boutique"
      className="relative py-14 px-4 overflow-hidden"
      style={{ background: '#F5C6CB' }}
    >
      <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full" style={{ height: '40px' }}>
          <path d="M0 40 Q360 0 720 20 Q1080 40 1440 10 L1440 0 L0 0 Z" fill="#FDE8EC" />
        </svg>
      </div>

      <div className="max-w-screen-xl mx-auto pt-6">
        <div className="text-center mb-10">
          <h2
            className="font-serif text-[#1C2340]"
            style={{ fontSize: '22px', letterSpacing: '0.08em', fontWeight: 600 }}
          >
            Notre Boutique
          </h2>
          <p
            className="font-sans text-[#5A6080] italic mt-1"
            style={{ fontSize: '15px' }}
          >
            Retrouvez-nous en boutique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-2xl p-6 space-y-5" style={{ boxShadow: '0 4px 24px rgba(28,35,64,0.1)' }}>
            <div>
              <h3
                className="font-serif text-[#1C2340]"
                style={{ fontSize: '22px', fontWeight: 600 }}
              >
                {storeName}
              </h3>
              <p
                className="font-script text-[#EBB4BB] mt-0.5"
                style={{ fontSize: '18px' }}
              >
                Lingerie pour elle
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-none flex items-center justify-center rounded-full bg-[#FDE8EC] mt-0.5"
                style={{ width: '36px', height: '36px' }}
              >
                <MapPin size={18} color="#1C2340" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                  Adresse
                </p>
                <p className="font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                  {address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-none flex items-center justify-center rounded-full bg-[#FDE8EC] mt-0.5"
                style={{ width: '36px', height: '36px' }}
              >
                <Clock size={18} color="#1C2340" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                  Horaires d&apos;ouverture
                </p>
                <p className="font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                  {hours}
                </p>
              </div>
            </div>

            <button
              id="store-directions-btn"
              onClick={getDirections}
              className="w-full flex items-center justify-center gap-2 border-2 border-[#1C2340] text-[#1C2340] font-sans font-semibold rounded-full hover:bg-[#FDE8EC] transition-colors duration-200"
              style={{ height: '48px', fontSize: '14px', letterSpacing: '0.04em' }}
            >
              <ExternalLink size={16} strokeWidth={1.8} />
              Obtenir l&apos;itineraire
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="rounded-2xl overflow-hidden border-2 border-[#F9D7DA]"
              style={{
                height: 'clamp(280px, 40vw, 420px)',
                boxShadow: '0 4px 24px rgba(28,35,64,0.1)',
              }}
            >
              <iframe
                title={`Localisation ${storeName}`}
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="store-view-map-btn"
              className="flex items-center justify-center gap-2 bg-white border border-[#EBB4BB] text-[#1C2340] font-sans font-semibold rounded-full hover:bg-[#FDE8EC] transition-colors duration-200 lg:hidden"
              style={{ height: '44px', fontSize: '14px' }}
            >
              <MapPin size={16} strokeWidth={1.8} />
              Voir sur Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
