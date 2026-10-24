'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useOpenFeatureClientStatus, useStringFlagValue } from '@openfeature/react-sdk';
import { CATEGORY_URL } from '../data';
import { leadWith } from '../flags';

export default function Carousel({ flagKey, ...props }) {
  return flagKey ? <FlaggedCarousel flagKey={flagKey} {...props} /> : <CarouselView {...props} />;
}

// Datadog Feature Flag: the flag value is the id of the slide to show first. Until
// the flags arrive, the banner keeps its space but shows no campaign, so visitors do
// not see one campaign swap to another.
function FlaggedCarousel({ flagKey, slides, ...props }) {
  const lead = useStringFlagValue(flagKey, slides[0].id);
  const pending = useOpenFeatureClientStatus() === 'NOT_READY';
  return <CarouselView {...props} slides={leadWith(slides, lead)} pending={pending} />;
}

function CarouselView({ slides, tall = false, pending = false }) {
  const [index, setIndex] = useState(0);
  const go = (step) => setIndex((i) => (i + step + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <div className={`carousel ${tall ? 'carousel-tall' : ''}`}>
      {/*
        PRODUCT ANALYTICS BEST PRACTICE: every slide links to the same page, so each
        banner gets its own action name to compare which campaign drives traffic.
        Without it, the name is the banner's text, which changes whenever marketing
        changes the copy. Experiments can use these clicks as a metric.
      */}
      <Link
        href={CATEGORY_URL}
        className={`banner ${pending ? 'banner-pending' : ''}`}
        style={{ background: pending ? '#e9e9e9' : slide.bg }}
        data-dd-action-name={`Hero banner: ${slide.id}`}
      >
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
