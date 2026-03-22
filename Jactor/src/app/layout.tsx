
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Vision 2030 | Global IT Excellence Initiative',
  description: 'Fueling the next generation through digital scholarship and free laptop provision.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased selection:bg-blue-200">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>

        {/* Start of Tawk.to Script */}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/69c03f7a4a2ad21c3adf09db/1jkbffue0';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();

            Tawk_API.customStyle = {
              visibility: {
                desktop: {
                  position: 'br',
                  xOffset: 20,
                  yOffset: 20
                },
                mobile: {
                  position: 'br',
                  xOffset: 15,
                  yOffset: 15
                }
              }
            };

            // Add support label and customize bubble
            Tawk_API.onLoad = function(){
              Tawk_API.setAttributes({
                'name'  : 'Vision 2030 Support',
              }, function(error){});
            };
          `}
        </Script>
        {/* End of Tawk.to Script */}
      </body>
    </html>
  );
}
