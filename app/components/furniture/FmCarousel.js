'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FM_CATEGORY_URL } from '../../furniture-data';

export default function FmCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const go = (step) => setIndex((i) => (i + step + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <div className="fm-carousel">
      {/*
        PRODUCT ANALYTICS BEST PRACTICE: every slide links to the same page, so give
        each banner its own action name to compare which campaign drives traffic, e.g.
        data-dd-action-name={`Hero banner: ${slide.id}`}. Without it, the name is the
        banner's text, which changes whenever marketing changes the copy.
      */}
      <Link href={FM_CATEGORY_URL} className="fm-banner" style={{ background: slide.bg }}>
        <div className="fm-banner-panel" style={{ background: slide.panel }}>
          <h2 className="fm-banner-title">{slide.title}</h2>
          <p className="fm-banner-subtitle">{slide.subtitle}</p>
          <p className="fm-banner-text">{slide.text}</p>
          <span className="fm-pill" style={{ color: slide.panel }}>Shop now</span>
        </div>
        <div className="fm-banner-art" aria-hidden="true">{slide.emoji}</div>
      </Link>

      <button className="fm-arrow left" aria-label="Previous banner" onClick={() => go(-1)}>‹</button>
      <button className="fm-arrow right" aria-label="Next banner" onClick={() => go(1)}>›</button>

      <div className="fm-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`fm-dot ${i === index ? 'active' : ''}`}
            aria-label={`Go to banner ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
