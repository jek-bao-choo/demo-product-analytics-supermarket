import Carousel from '../components/Carousel';
import PromoBanners from '../components/PromoBanners';
import VoucherRow from '../components/VoucherRow';
import ProductRow from '../components/ProductRow';
import { homeSlides, flashDeals } from '../data';

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <Carousel slides={homeSlides} />
        <PromoBanners />
      </div>
      <VoucherRow />
      <ProductRow title="Flash Deals" subtitle="Online Exclusive" products={flashDeals} />
    </>
  );
}
