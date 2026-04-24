'use client';

import { useEffect, useState } from 'react';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    // Fetch background setting via API — tidak langsung ke DB
    fetch('/api/web/settings')
      .then(r => r.json())
      .then(data => {
        const settings = data?.data || data || {};
        const bg = settings?.website_background || settings?.umum?.website_background || '';
        if (bg) setBgUrl(bg);
      })
      .catch(() => {}); // Gagal = tidak ada background, fine
  }, []);

  return (
    <body
      className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col"
      style={bgUrl ? {
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : undefined}
    >
      {children}
    </body>
  );
}
