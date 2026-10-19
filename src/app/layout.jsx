import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'PropertyTick | Hyperlocal Property Platform',
  description: 'Find, list, and close property deals with verified brokers, advocates, and colonizers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
