import { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt',
  'El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane',
];

const PAYMENT_METHODS = [
  {
    id: 'livraison',
    label: 'Paiement a la livraison',
    description: 'Payez en cash a la reception de votre commande',
    icon: '◈',
  },
  {
    id: 'baridimob',
    label: 'BaridiMob',
    description: 'Paiement via application BaridiMob Algerie Poste',
    icon: '◉',
  },
  {
    id: 'ccp',
    label: 'CCP',
    description: 'Virement CCP Algerie Poste',
    icon: '◈',
  },
];

function InputField({ label, id, type = 'text', placeholder, value, onChange, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
        {label}{required && <span className="text-[#E63946] ml-0.5">*</span>}
      </label>
      {children || (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="border border-[#EBB4BB] rounded-xl px-4 font-sans text-[#1C2340] placeholder-[#9CA3AF] outline-none focus:border-[#1C2340] transition-colors"
          style={{ height: '52px', fontSize: '15px' }}
        />
      )}
    </div>
  );
}

export default function CheckoutPage({ cartItems, onBack, onConfirm }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    wilaya: '',
    commune: '',
    payment: 'livraison',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= 3000 ? 0 : 400;
  const total = subtotal + deliveryFee;

  function handleSubmit(e) {
    e.preventDefault();
    setOrderPlaced(true);
    onConfirm?.();
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#FDE8EC] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg">
          <div
            className="w-16 h-16 rounded-full bg-[#F9D7DA] flex items-center justify-center mx-auto mb-4"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C2340" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '24px', fontWeight: 600 }}>
            Commande confirmee
          </h2>
          <p className="font-sans text-[#5A6080] mt-3 leading-relaxed" style={{ fontSize: '14px' }}>
            Merci pour votre commande. Vous serez contacte sous peu pour la livraison.
          </p>
          <button
            onClick={onBack}
            className="mt-6 w-full bg-[#1C2340] text-white font-sans font-semibold rounded-full"
            style={{ height: '52px', fontSize: '15px' }}
          >
            Retour a la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDE8EC]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#F9D7DA] flex items-center px-4" style={{ height: '60px' }}>
        <button
          id="checkout-back-btn"
          onClick={onBack}
          aria-label="Retour"
          className="flex items-center gap-1 font-sans text-[#1C2340] hover:text-[#E8A5AE] transition-colors"
          style={{ fontSize: '14px' }}
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
          Retour
        </button>
        <h1
          className="absolute left-1/2 -translate-x-1/2 font-serif text-[#1C2340]"
          style={{ fontSize: '20px', fontWeight: 600 }}
        >
          Commande
        </h1>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Delivery section */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '18px', fontWeight: 600 }}>
              Informations de livraison
            </h2>

            <InputField label="Nom complet" id="checkout-fullname" placeholder="Votre nom et prenom" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} required />
            <InputField label="Numero de telephone" id="checkout-phone" type="tel" placeholder="0X XX XX XX XX" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
            <InputField label="Adresse" id="checkout-address" placeholder="Rue, numero, quartier" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />

            {/* Wilaya select */}
            <InputField label="Wilaya" id="checkout-wilaya" required>
              <div className="relative">
                <select
                  id="checkout-wilaya"
                  value={form.wilaya}
                  onChange={(e) => setForm((p) => ({ ...p, wilaya: e.target.value }))}
                  required
                  className="w-full border border-[#EBB4BB] rounded-xl px-4 pr-10 font-sans text-[#1C2340] outline-none focus:border-[#1C2340] transition-colors appearance-none bg-white"
                  style={{ height: '52px', fontSize: '15px' }}
                >
                  <option value="">Choisir une wilaya</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  color="#9CA3AF"
                  strokeWidth={1.8}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </InputField>

            <InputField label="Commune" id="checkout-commune" placeholder="Commune / ville" value={form.commune} onChange={(e) => setForm((p) => ({ ...p, commune: e.target.value }))} required />
          </div>

          {/* Payment section */}
          <div className="bg-white rounded-2xl p-5 space-y-3">
            <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '18px', fontWeight: 600 }}>
              Mode de paiement
            </h2>
            {PAYMENT_METHODS.map((pm) => {
              const active = form.payment === pm.id;
              return (
                <label
                  key={pm.id}
                  htmlFor={`payment-${pm.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150"
                  style={{
                    borderColor: active ? '#1C2340' : '#EBB4BB',
                    background: active ? '#F9D7DA' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    id={`payment-${pm.id}`}
                    name="payment"
                    value={pm.id}
                    checked={active}
                    onChange={() => setForm((p) => ({ ...p, payment: pm.id }))}
                    className="sr-only"
                  />
                  <div
                    className="flex-none rounded-full border-2 flex items-center justify-center"
                    style={{
                      width: '22px',
                      height: '22px',
                      borderColor: active ? '#1C2340' : '#EBB4BB',
                    }}
                  >
                    {active && (
                      <div className="rounded-full bg-[#1C2340]" style={{ width: '10px', height: '10px' }} />
                    )}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '14px' }}>
                      {pm.label}
                    </p>
                    <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                      {pm.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Mobile order summary accordion */}
          <div className="bg-white rounded-2xl overflow-hidden lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((o) => !o)}
              className="w-full flex items-center justify-between px-5 py-4 font-sans font-semibold text-[#1C2340]"
              style={{ fontSize: '15px' }}
              aria-expanded={summaryOpen}
            >
              Resume de la commande ({cartItems.reduce((s, i) => s + i.qty, 0)} articles)
              <ChevronDown
                size={18}
                strokeWidth={1.8}
                style={{ transform: summaryOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
              />
            </button>
            {summaryOpen && (
              <div className="px-5 pb-5 space-y-3 border-t border-[#F9D7DA]">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-sans text-[#1C2340] truncate" style={{ fontSize: '13px', maxWidth: '200px' }}>
                        {item.name}
                      </p>
                      <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                        Qte: {item.qty}
                      </p>
                    </div>
                    <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '13px' }}>
                      {(item.price * item.qty).toLocaleString('fr-DZ')} DZD
                    </p>
                  </div>
                ))}
                <div className="border-t border-[#F9D7DA] pt-3 space-y-1">
                  <div className="flex justify-between font-sans text-[#5A6080]" style={{ fontSize: '13px' }}>
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString('fr-DZ')} DZD</span>
                  </div>
                  <div className="flex justify-between font-sans text-[#5A6080]" style={{ fontSize: '13px' }}>
                    <span>Livraison</span>
                    <span>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee} DZD`}</span>
                  </div>
                  <div className="flex justify-between font-sans font-bold text-[#1C2340]" style={{ fontSize: '15px' }}>
                    <span>Total</span>
                    <span>{total.toLocaleString('fr-DZ')} DZD</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            id="checkout-confirm-btn"
            type="submit"
            className="w-full bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors duration-200"
            style={{ height: '56px', fontSize: '15px', letterSpacing: '0.04em' }}
          >
            Confirmer la commande
          </button>
        </form>

        {/* Desktop sticky order summary */}
        <div className="hidden lg:block sticky top-24">
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '18px', fontWeight: 600 }}>
              Resume de la commande
            </h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 items-center">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="rounded-lg object-cover flex-none"
                    style={{ width: '52px', height: '52px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-[#1C2340] truncate" style={{ fontSize: '13px' }}>
                      {item.name}
                    </p>
                    <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                      Qte: {item.qty}
                    </p>
                  </div>
                  <p className="font-sans font-semibold text-[#1C2340]" style={{ fontSize: '13px' }}>
                    {(item.price * item.qty).toLocaleString('fr-DZ')} DZD
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#F9D7DA] pt-4 space-y-2">
              <div className="flex justify-between font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString('fr-DZ')} DZD</span>
              </div>
              <div className="flex justify-between font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                <span>Livraison</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee} DZD`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="font-sans text-[#9CA3AF] text-xs">
                  Livraison gratuite a partir de 3 000 DZD
                </p>
              )}
              <div className="flex justify-between font-sans font-bold text-[#1C2340] pt-2 border-t border-[#F9D7DA]" style={{ fontSize: '16px' }}>
                <span>Total</span>
                <span>{total.toLocaleString('fr-DZ')} DZD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
