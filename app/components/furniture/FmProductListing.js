'use client';

import { useState } from 'react';
import FmProductCard from './FmProductCard';
import { sofaTypes, sofaProducts } from '../../furniture-data';

const sorts = {
  popular: { label: 'Most popular', fn: (a, b) => b.reviews - a.reviews },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Customer rating', fn: (a, b) => b.rating - a.rating },
};

export default function FmProductListing() {
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('popular');
  const [onlyLowerPrice, setOnlyLowerPrice] = useState(false);

  const products = sofaProducts
    .filter((p) => type === 'all' || p.type === type)
    .filter((p) => !onlyLowerPrice || p.was)
    .sort(sorts[sort].fn);

  return (
    <>
      {/*
        PRODUCT ANALYTICS BEST PRACTICE: filters and sorting change what the user sees
        without changing the page, so they do not show up as views. To analyse them,
        send a custom action, e.g. datadogRum.addAction('plp_filter', { type, sort }).
      */}
      <div className="fm-chips">
        {sofaTypes.map((t) => (
          <button
            key={t.id}
            className={`fm-chip ${type === t.id ? 'active' : ''}`}
            onClick={() => setType(t.id)}
          >
            <span className="fm-chip-art" aria-hidden="true">{t.emoji || '✨'}</span>
            <span className="fm-chip-name">{t.name}</span>
          </button>
        ))}
      </div>

      <div className="fm-filterbar">
        <label className="fm-filter">
          Sort{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(sorts).map(([id, s]) => (
              <option key={id} value={id}>{s.label}</option>
            ))}
          </select>
        </label>
        <button className="fm-filter" onClick={() => setOnlyLowerPrice((v) => !v)}>
          {onlyLowerPrice ? '✓ ' : ''}Lower price
        </button>
        <button className="fm-filter">Price ▾</button>
        <button className="fm-filter">Colour ▾</button>
        <button className="fm-filter">Material ▾</button>
        <span className="fm-result-count">{products.length} results</span>
      </div>

      <div className="fm-grid">
        {products.map((p) => (
          <FmProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
