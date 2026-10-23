import Header from '../components/Header';
import { CartProvider } from '../components/CartContext';
import StoreContext from '../components/StoreContext';

export const metadata = {
  title: 'Supermarket | Online Grocery Shopping',
  description: 'Demo grocery store for Datadog Product Analytics',
};

export default function SupermarketLayout({ children }) {
  return (
    <CartProvider>
      <StoreContext store="supermarket" />
      <Header />
      <main className="container main">{children}</main>
    </CartProvider>
  );
}
