import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aegis Health | Intelligent Disease Diagnosis & Doctor Recommender',
  description: 'AI-powered disease prediction and doctor recommendation system. Get instant symptoms analysis and match with local specialized physicians.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
