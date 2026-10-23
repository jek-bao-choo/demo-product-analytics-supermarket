import FmCarousel from '../components/furniture/FmCarousel';
import FmCategoryTabs from '../components/furniture/FmCategoryTabs';
import FmProductRow from '../components/furniture/FmProductRow';
import { fmHomeSlides, fmTopPicks, fmLowerPrice } from '../furniture-data';

export default function FurnitureMartHomePage() {
  return (
    <>
      <FmCarousel slides={fmHomeSlides} />
      <div className="fm-container">
        <FmCategoryTabs />
        <FmProductRow title="Our top picks" products={fmTopPicks} />
        <FmProductRow title="Lower price" products={fmLowerPrice} />
      </div>
    </>
  );
}
