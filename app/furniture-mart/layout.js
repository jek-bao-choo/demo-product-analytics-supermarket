import FmHeader from '../components/furniture/FmHeader';
import { CartProvider } from '../components/CartContext';
import StoreContext from '../components/StoreContext';

export const metadata = {
  title: 'Furniture Mart | Affordable Home Furnishing',
  description: 'Demo furniture store for Datadog Product Analytics',
};

export default function FurnitureMartLayout({ children }) {
  return (
    <CartProvider>
      <StoreContext store="furniture-mart" />
      <div className="fm">
        <FmHeader />
        <main className="fm-main">{children}</main>
      </div>
    </CartProvider>
  );
}
