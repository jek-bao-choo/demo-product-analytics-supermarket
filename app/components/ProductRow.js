import ProductCard from './ProductCard';

export default function ProductRow({ title, subtitle, products }) {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>
        <a href="#" className="see-all">See all</a>
      </div>
      <div className="scroll-row">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
