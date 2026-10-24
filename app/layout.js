import './globals.css';
import { DatadogAppRouter } from '@datadog/browser-rum-nextjs';
import FlagsProvider from './components/FlagsProvider';

export const metadata = {
  title: 'Demo Stores | Product Analytics',
  description: 'Demo stores (Supermarket and Furniture Mart) for Datadog Product Analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/*
          STEP 3: Add the Datadog component to the root layout.
            <DatadogAppRouter /> watches App Router page changes. It names each
            RUM view after its route pattern (for example, /category/[slug]
            instead of every individual URL), so views group together cleanly
            in funnels and user paths.

            NEW TO DATADOG RUM:
              Add this one line inside <body>.
            EXISTING RUM CUSTOMER:
              This is a new addition. If you currently track page changes
              yourself (for example, datadogRum.startView() in a usePathname
              effect), remove that code, because this component replaces it.
        */}
        <DatadogAppRouter />
        <FlagsProvider>{children}</FlagsProvider>
      </body>
    </html>
  );
}
