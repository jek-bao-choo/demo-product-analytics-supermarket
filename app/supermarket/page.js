import Carousel from '../components/Carousel';
import PromoBanners from '../components/PromoBanners';
import VoucherRow from '../components/VoucherRow';
import ProductRow from '../components/ProductRow';
import { homeSlides, flashDeals } from '../data';
import { SUPERMARKET_HERO_FLAG } from '../flags';

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <Carousel slides={homeSlides} flagKey={SUPERMARKET_HERO_FLAG} />
        <PromoBanners />
      </div>
      <VoucherRow />
      <ProductRow title="Flash Deals" subtitle="Online Exclusive" products={flashDeals} />
    </>
  );
}
