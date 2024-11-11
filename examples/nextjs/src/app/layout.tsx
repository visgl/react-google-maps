import type {Metadata} from 'next';
import Script from 'next/script';

import Header from './components/header';

import styles from './layout.module.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'React Google Maps - NextJS Example'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <Header />
          {children}
        </div>

        <Script
          src="https://visgl.github.io/react-google-maps/scripts/examples.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
