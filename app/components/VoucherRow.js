import { vouchers } from '../data';

export default function VoucherRow() {
  return (
    <section className="section">
      <div className="section-head">
        <h2>Vouchers available</h2>
        <a href="#" className="see-all">See all</a>
      </div>
      <div className="scroll-row">
        {vouchers.map((v) => (
          <button key={v.id} className="voucher">
            <span className="voucher-icon" aria-hidden="true">{v.icon}</span>
            <span className="voucher-body">
              <strong>{v.title}</strong>
              <span>{v.subtitle}</span>
              <small className={v.urgent ? 'urgent' : ''}>{v.note}</small>
            </span>
            <span className="chevron" aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}
