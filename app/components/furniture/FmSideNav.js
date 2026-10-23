'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FM_HOME_URL, FM_CATEGORY_URL } from '../../furniture-data';

const otherProducts = ['Beds & mattresses', 'Storage & organisation', 'Tables & desks', 'Lighting', 'Decoration'];
const mainLinks = ['Rooms', 'Offers', '❤️Our top picks❤️', 'Furniture Mart for Business', 'Interior Design Service', 'Furniture Mart Family'];
const secondaryLinks = ['Food', 'Inspirations', 'Planning Tools', 'Track Your Order', 'Store Information', 'Free layout design', 'Services'];

export default function FmSideNav({ open, onClose }) {
  const [productsOpen, setProductsOpen] = useState(false);

  // Close on Escape and stop the page behind the drawer from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`fm-overlay ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`fm-sidenav ${open ? 'open' : ''}`} aria-label="Main menu" aria-hidden={!open} inert={!open}>
        <div className="fm-sidenav-head">
          <button className="fm-icon-btn" aria-label="Close menu" onClick={onClose}>✕</button>
          <Link href={FM_HOME_URL} className="fm-logo" aria-label="Furniture Mart home" onClick={onClose}>
            <span className="fm-logo-oval">Furniture Mart</span>
          </Link>
        </div>

        <nav className="fm-sidenav-main">
          <button
            className="fm-sidenav-item"
            aria-expanded={productsOpen}
            onClick={() => setProductsOpen((o) => !o)}
          >
            Products <span aria-hidden="true">{productsOpen ? '−' : '›'}</span>
          </button>
          {productsOpen && (
            <ul className="fm-sidenav-sub">
              <li>
                <Link href={FM_CATEGORY_URL} onClick={onClose}>Sofas &amp; armchairs</Link>
              </li>
              {otherProducts.map((c) => (
                <li key={c}><span className="disabled">{c}</span></li>
              ))}
            </ul>
          )}
          {mainLinks.map((l) => (
            <button key={l} className="fm-sidenav-item">{l}</button>
          ))}
        </nav>

        <nav className="fm-sidenav-secondary">
          {secondaryLinks.map((l) => (
            <button key={l} className="fm-link-btn">{l}</button>
          ))}
        </nav>

        <div className="fm-sidenav-foot">🌐 Change country · <strong>EN</strong> | ID</div>
      </aside>
    </>
  );
}
