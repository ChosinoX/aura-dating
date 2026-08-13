import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aura Match - AI Seznamka',
  description: 'Seznamka založená na osobnostní kompatibilitě a AI společnících',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#020617', color: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}
