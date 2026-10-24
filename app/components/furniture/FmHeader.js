'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useCart } from '../CartContext';
import FmSideNav from './FmSideNav';
import { FM_HOME_URL, FM_CATEGORY_URL } from '../../furniture-data';

const topLinks = ['Food', 'Inspirations', 'Planning Tools', '📍 Track Your Order', '📍 Store Information', 'Free layout design', 'Services'];
const otherProducts = ['Beds & mattresses', 'Storage & organisation', 'Tables & desks', 'Lighting', 'Decoration'];
const navLinks = ['Rooms', 'Offers', '❤️Our top picks❤️', 'Furniture Mart for Business', 'Interior Design Service', 'Furniture Mart Family'];

export default function FmHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const closeSideNav = useCallback(() => setSideNavOpen(false), []);
  const onCategory = pathname.startsWith('/furniture-mart/category');

  return (
    <>
      <header className="fm-header">
        <div className="fm-topbar">
          <div className="fm-container fm-topbar-inner">
            <span className="fm-lang"><strong>EN</strong> | ID</span>
            <nav className="fm-toplinks">
              {topLinks.map((l) => (
                <button key={l} className="fm-link-btn">{l}</button>
              ))}
            </nav>
          </div>
        </div>

        <div className="fm-container fm-mainrow">
          <button
            className="fm-icon-btn"
            aria-label="Menu"
            aria-expanded={sideNavOpen}
            onClick={() => setSideNavOpen(true)}
          >
            ☰
          </button>
          <Link href={FM_HOME_URL} className="fm-logo" aria-label="Furniture Mart home">
            <span className="fm-logo-oval">Furniture Mart</span>
          </Link>
          <form className="fm-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <span aria-hidden="true">🔍</span>
            <input type="search" placeholder="Search..." />
          </form>
          <div className="fm-icons">
            {/*
              PRODUCT ANALYTICS BEST PRACTICE: identify users when they log in, as in the
              supermarket Header.js: datadogRum.setUser({ id }) / datadogRum.clearUser().
              This demo has no login; instrumentation-client.js uses a random visitor id.
            */}
            <button className="fm-icon-btn" aria-label="Log in">👤</button>
            <button className="fm-icon-btn" aria-label="Wishlist">♡</button>
            <button className="fm-icon-btn fm-cart" aria-label="Shopping bag">
              🧺{count > 0 && <span className="fm-cart-badge">{count}</span>}
            </button>
          </div>
        </div>

        <div className="fm-container fm-navrow">
          <nav className="fm-nav">
            <div
              className="fm-nav-dropdown"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className={`fm-nav-item ${onCategory ? 'active' : ''}`}
                onClick={() => setMenuOpen((o) => !o)}
              >
                Products
              </button>
              {menuOpen && (
                <ul className="fm-dropdown-menu">
                  <li>
                    <Link href={FM_CATEGORY_URL} onClick={() => setMenuOpen(false)}>
                      Sofas &amp; armchairs
                    </Link>
                  </li>
                  {otherProducts.map((c) => (
                    <li key={c}>
                      <span className="disabled">{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {navLinks.map((l) => (
              <button key={l} className="fm-nav-item">{l}</button>
            ))}
          </nav>
        </div>
      </header>
      <FmSideNav open={sideNavOpen} onClose={closeSideNav} />
    </>
  );
}
