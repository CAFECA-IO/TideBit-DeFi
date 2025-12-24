import type { Metadata } from 'next';
import { Manrope, Noto_Sans_TC, Noto_Sans_SC } from 'next/font/google';
import LockScreenMask from '@/components/common/lock_screen_mask';
import { GlobalProvider } from '@/contexts/global_context';
import { ModalProvider } from '@/contexts/modal_context';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/auth_context';

// Info: (20251216 - Julian) 英文字體用 Manrope
const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

// Info: (20251216 - Julian) 中文字體用 Noto Sans TC / SC
const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TideBit-DeFi V2',
  description: 'TideBit-DeFi V2 Application',
  authors: [{ name: 'CAFECA' }],
  keywords: ['CAFECA', 'TideBit-DeFi'],
  icons: { icon: '/logo/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} ${notoSansTC.className} ${notoSansSC.className} antialiased`}
      >
        <AuthProvider>
          <GlobalProvider>
            <ModalProvider>{children}</ModalProvider>
          </GlobalProvider>
        </AuthProvider>

        {/* Info: (20251216 - Julian) 全域鎖定螢幕遮罩 */}
        <LockScreenMask />
      </body>
    </html>
  );
}
