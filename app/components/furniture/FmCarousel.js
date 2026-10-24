'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useOpenFeatureClientStatus, useStringFlagValue } from '@openfeature/react-sdk';
import { FM_CATEGORY_URL } from '../../furniture-data';
import { leadWith } from '../../flags';

export default function FmCarousel({ flagKey, ...props }) {
  return flagKey ? <FlaggedFmCarousel flagKey={flagKey} {...props} /> : <FmCarouselView {...props} />;
}

// Datadog Feature Flag: the flag value is the id of the slide to show first. Until
// the flags arrive, the banner keeps its space but shows no campaign, so visitors do
// not see one campaign swap to another.
function FlaggedFmCarousel({ flagKey, slides, ...props }) {
  const lead = useStringFlagValue(flagKey, slides[0].id);
  const pending = useOpenFeatureClientStatus() === 'NOT_READY';
  return <FmCarouselView {...props} slides={leadWith(slides, lead)} pending={pending} />;
}

function FmCarouselView({ slides, pending = false }) {
  const [index, setIndex] = useState(0);
  const go = (step) => setIndex((i) => (i + step + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <div className="fm-carousel">
      {/*
        PRODUCT ANALYTICS BEST PRACTICE: every slide links to the same page, so each
        banner gets its own action name to compare which campaign drives traffic.
        Without it, the name is the banner's text, which changes whenever marketing
        changes the copy. Experiments can use these clicks as a metric.
      */}
      <Link
        href={FM_CATEGORY_URL}
        className={`fm-banner ${pending ? 'banner-pending' : ''}`}
        style={{ background: pending ? '#e9e9e9' : slide.bg }}
        data-dd-action-name={`Hero banner: ${slide.id}`}
      >
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
