'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FM_CATEGORY_URL, fmCategories, fmRooms } from '../../furniture-data';

export default function FmCategoryTabs() {
  const [tab, setTab] = useState('categories');
  const tiles = tab === 'categories' ? fmCategories : fmRooms;

  return (
    <section className="fm-section">
      <div className="fm-tabs">
        <button className={`fm-tab ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>
          Shop by categories
        </button>
        <button className={`fm-tab ${tab === 'rooms' ? 'active' : ''}`} onClick={() => setTab('rooms')}>
          Shop rooms
        </button>
      </div>
      <div className="fm-scroll-row">
        {tiles.map((t) => {
          const body = (
            <>
              <span className="fm-tile-art" aria-hidden="true">{t.emoji}</span>
              <span className="fm-tile-name">{t.name}</span>
            </>
          );
          return t.link ? (
            <Link key={t.id} href={FM_CATEGORY_URL} className="fm-tile">{body}</Link>
          ) : (
            <span key={t.id} className="fm-tile fm-tile-inert">{body}</span>
          );
        })}
      </div>
    </section>
  );
}
