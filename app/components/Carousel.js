'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CATEGORY_URL } from '../data';

export default function Carousel({ slides, tall = false }) {
  const [index, setIndex] = useState(0);
  const go = (step) => setIndex((i) => (i + step + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <div className={`carousel ${tall ? 'carousel-tall' : ''}`}>
      <Link href={CATEGORY_URL} className="banner" style={{ background: slide.bg }}>
        <div className="banner-copy">
          <span className="banner-eyebrow">{slide.eyebrow}</span>
          <h2 className="banner-title">{slide.title}</h2>
          <p className="banner-text">{slide.text}</p>
          <span className="pill">Shop now</span>
        </div>
        <div className="banner-art" aria-hidden="true">{slide.emoji}</div>
      </Link>

      <button className="carousel-arrow left" aria-label="Previous banner" onClick={() => go(-1)}>‹</button>
      <button className="carousel-arrow right" aria-label="Next banner" onClick={() => go(1)}>›</button>

      <div className="carousel-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === index ? 'active' : ''}`}
            aria-label={`Go to banner ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
