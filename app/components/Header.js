'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from './CartContext';
import { CATEGORY_URL } from '../data';

const otherCategories = ['Fruits & Vegetables', 'Meat & Seafood', 'Dairy, Chilled & Eggs', 'Beverages', 'Household'];

export default function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const onCategory = pathname.startsWith('/supermarket/category');

  return (
    <header className="header">
      <div className="header-top container">
        <Link href="/supermarket/" className="logo" aria-label="Supermarket home">
          <span className="logo-mark" aria-hidden="true">S</span>
          <span className="logo-text">Supermarket</span>
        </Link>
        <div className="header-top-right">
          <button className="link-btn">Get the app ▾</button>
          <button className="link-btn">📍 Enter your address or postal code ▾</button>
          <button className="link-btn">ⓘ Help Centre</button>
          <button className="btn btn-outline">Sign up</button>
          {/*
            PRODUCT ANALYTICS BEST PRACTICE: identify users when they log in.
              After login succeeds:   datadogRum.setUser({ id: '<internal user id>' })
              On logout:              datadogRum.clearUser()
            Product Analytics groups user profiles and retention by the user id. Visitors
            you never identify are still tracked with an anonymous id (usr.anonymous_id).
            Prefer an internal id over email or name unless your privacy policy allows them.
            This demo has no real login, so it does not call setUser.
          */}
          <button className="btn btn-solid">Log in</button>
        </div>
      </div>

      <div className="header-bottom container">
        <nav className="nav">
          <div
            className="nav-dropdown"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              className={`nav-item ${onCategory ? 'active' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
            >
              Categories
            </button>
            {menuOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link href={CATEGORY_URL} onClick={() => setMenuOpen(false)}>
                    Snacks &amp; Confectionery
                  </Link>
                </li>
                {otherCategories.map((c) => (
                  <li key={c}>
                    <span className="disabled">{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="nav-item">Promotions</button>
          <button className="nav-item">Shopping Lists</button>
          <button className="nav-item">More</button>
        </nav>

        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <span aria-hidden="true">🔍</span>
          <input type="search" placeholder="2 for $6.30 - Instant Curry Noodles 5-Pack (U.P $3.63 EA)" />
        </form>

        <div className="header-cart">
          <span className="fees">Fees may apply ⓘ</span>
          <button className="cart-btn">
            🛒 Cart{count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
