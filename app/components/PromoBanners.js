import Link from 'next/link';
import { CATEGORY_URL, promoBanners } from '../data';

export default function PromoBanners() {
  return (
    <div className="promo-banners">
      {promoBanners.map((b) => (
        <Link key={b.id} href={CATEGORY_URL} className="banner banner-small" style={{ background: b.bg }}>
          <div className="banner-copy">
            <span className="banner-eyebrow">{b.eyebrow}</span>
            <h3 className="banner-title">{b.title}</h3>
            <p className="banner-text">{b.text}</p>
          </div>
          <div className="banner-art" aria-hidden="true">{b.emoji}</div>
          <span className="pill pill-corner">Shop now</span>
        </Link>
      ))}
    </div>
  );
}
