import './globals.css';
import Header from './components/Header';
import { CartProvider } from './components/CartContext';

export const metadata = {
  title: 'Supermarket | Online Grocery Shopping',
  description: 'Demo grocery store for Datadog Product Analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* TODO: Datadog Browser SDK (RUM + Product Analytics) init goes here */}
        <CartProvider>
          <Header />
          <main className="container main">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
