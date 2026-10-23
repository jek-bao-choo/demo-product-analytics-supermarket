import Carousel from '../../../components/Carousel';
import ProductRow from '../../../components/ProductRow';
import { categorySlides, snackDeals, bestSellers } from '../../../data';

export const metadata = {
  title: 'Snacks & Confectionery | Supermarket',
};

export default function SnacksPage() {
  return (
    <div className="category-page">
      <h1 className="page-title">Snacks &amp; Confectionery</h1>
      <Carousel slides={categorySlides} tall />
      <ProductRow title="Up to 20% OFF" products={snackDeals} />
      <ProductRow title="Best Sellers" products={bestSellers} />
    </div>
  );
}
