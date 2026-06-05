import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import InTimeLogo from './InTimeLogo';

export default function Navbar({ cartCount, onMenuOpen, onCartOpen, onSearchOpen }) {
  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-[#F9D7DA]"
      style={{ height: '60px' }}
    >
      <div
        className="max-w-screen-xl mx-auto h-full px-4 flex items-center justify-between"
        style={{ height: '60px' }}
      >
        {/* Left: Hamburger */}
        <button
          id="nav-menu-btn"
          aria-label="Ouvrir le menu"
          onClick={onMenuOpen}
          className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#FDE8EC] transition-colors duration-200"
        >
          <Menu size={22} color="#1C2340" strokeWidth={1.8} />
        </button>

        {/* Center: Wordmark */}
        <a
          href="#hero"
          className="absolute left-1/2 -translate-x-1/2 flex items-center select-none"
          aria-label="Intime & Co — Accueil"
        >
          <span
            className="font-serif font-bold text-[#1C2340] tracking-wide"
            style={{ fontSize: '22px', letterSpacing: '0.04em' }}
          >
            Intime &amp; Co
          </span>
        </a>

        {/* Right: Search + Cart */}
        <div className="flex items-center gap-1">
          <button
            id="nav-search-btn"
            aria-label="Rechercher"
            onClick={onSearchOpen}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#FDE8EC] transition-colors duration-200"
          >
            <Search size={20} color="#1C2340" strokeWidth={1.8} />
          </button>

          <button
            id="nav-cart-btn"
            aria-label={`Panier — ${cartCount} article${cartCount !== 1 ? 's' : ''}`}
            onClick={onCartOpen}
            className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#FDE8EC] transition-colors duration-200"
          >
            <ShoppingBag size={20} color="#1C2340" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 flex items-center justify-center bg-[#1C2340] text-white rounded-full font-sans font-semibold leading-none"
                style={{ width: '17px', height: '17px', fontSize: '10px' }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop: Inline nav links (hidden on mobile) */}
      <nav
        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 items-center gap-8"
        style={{ height: '72px' }}
        aria-label="Navigation principale"
      >
        {['Accueil', 'Collections', 'Nouveautes', 'Promotions', 'Notre Boutique', 'Contact'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(' ', '-').replace('é', 'e').replace('è', 'e')}`}
            className="font-sans text-[#1C2340] hover:text-[#E8A5AE] transition-colors duration-200 text-[14px] tracking-wide"
          >
            {link}
          </a>
        ))}
      </nav>
    </header>
  );
}
