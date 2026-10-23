import Link from 'next/link';

export const metadata = {
  title: 'Demo Stores | Product Analytics',
};

const stores = [
  {
    id: 'supermarket',
    name: 'Supermarket',
    href: '/supermarket/',
    emoji: '🛒',
    text: 'Online grocery shopping: snacks, fresh produce and weekly deals.',
    bg: 'linear-gradient(135deg, #1454b8 0%, #e2231a 100%)',
  },
  {
    id: 'furniture-mart',
    name: 'Furniture Mart',
    href: '/furniture-mart/',
    emoji: '🛋️',
    text: 'Affordable home furnishing: sofas, storage and room ideas.',
    bg: 'linear-gradient(135deg, #0058a3 0%, #0058a3 60%, #ffdb00 100%)',
  },
];

export default function DirectoryPage() {
  return (
    <main className="directory container">
      <h1>Demo Stores</h1>
      <p className="directory-sub">Pick a store to start browsing.</p>
      <div className="directory-grid">
        {/*
          PRODUCT ANALYTICS BEST PRACTICE: a stable action name per card, so a
          "Directory -> store" funnel step keeps its name if the card copy changes.
        */}
        {stores.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className="directory-card"
            data-dd-action-name={`Directory: ${s.name}`}
          >
            <div className="directory-art" style={{ background: s.bg }} aria-hidden="true">{s.emoji}</div>
            <div className="directory-body">
              <h2>{s.name}</h2>
              <p>{s.text}</p>
              <span className="directory-cta">Visit store ›</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
