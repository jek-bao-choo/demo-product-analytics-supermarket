import FmProductCard from './FmProductCard';

export default function FmProductRow({ title, products }) {
  return (
    <section className="fm-section">
      <div className="fm-section-head">
        <h2>{title}</h2>
        <a href="#" className="fm-see-all">See all ›</a>
      </div>
      <div className="fm-scroll-row">
        {products.map((p) => (
          <FmProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
