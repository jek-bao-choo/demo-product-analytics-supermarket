import Link from 'next/link';
import FmProductListing from '../../../components/furniture/FmProductListing';
import { FM_HOME_URL } from '../../../furniture-data';

export const metadata = {
  title: 'Sofas & armchairs | Furniture Mart',
};

export default function SofasPage() {
  return (
    <div className="fm-category-page fm-container">
      <ol className="fm-breadcrumb">
        <li><Link href={FM_HOME_URL}>Furniture Mart</Link></li>
        <li><Link href={FM_HOME_URL}>Products</Link></li>
        <li aria-current="page">Sofas &amp; armchairs</li>
      </ol>

      <div className="fm-plp-intro">
        <div>
          <h1 className="fm-page-title">Sofas &amp; armchairs</h1>
          <p className="fm-plp-desc">
            Sink into comfort. From compact 2-seat sofas to roomy corner sofas, sofa-beds for
            guests and armchairs for your reading corner, find the seat that fits your home
            and your budget.
          </p>
        </div>
        <div className="fm-plp-promo">
          <span className="fm-plp-promo-art" aria-hidden="true">🛋️</span>
          <div>
            <strong>Sofa week: up to 30% off</strong>
            <span className="fm-plp-promo-copy">Selected sofas and armchairs. Till 31 Oct.</span>
          </div>
        </div>
      </div>

      <FmProductListing />
    </div>
  );
}
