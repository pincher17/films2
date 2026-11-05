import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from './registry'
import { Providers } from "@/redux/provider";
import NextTopLoader from 'nextjs-toploader';
import NavigationSkeleton from '@/components/NavigationSkeleton/NavigationSkeleton';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Filmhub - смотреть фильмы бесплатно онлайн в хорошем качестве',
  description: `Смотрите новинки кино и сериалов в онлайн кинотеатре Filmhub. 
  Большой выбор фильмов, высокое качество видео и звука`,
  keywords: `filmhub, фильмхаб, фильм хаб, сериалы, kinogo, киного, фильмы онлайн, смотреть фильмы онлайн, смотреть фильмы бесплатно, кино онлайн`,
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  applicationName: 'Filmhub',
  verification: {
    yandex: '14eacbc578f7574d',
  },
  alternates: {
    canonical: 'https://filmhub.one',
  },
  other: {
    hdvb: '0e6fce67751495f8106975f552f21f9a:63c97b2ee9cedb6b8628e6008bebd0f0'
  },
  manifest: "/manifest.json",

  /* Open Graph — то, что показывают Telegram, WhatsApp, VK и поисковики,
     когда ссылку отправляют в чат. Без этих тегов превью было текстовым,
     без картинки. */
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://filmhub.one',
    siteName: 'Filmhub',
    title: 'Filmhub — смотреть фильмы и сериалы онлайн',
    description:
      'Новинки кино и сериалов в хорошем качестве. Большой выбор фильмов, удобный поиск и подборки.',
    images: [
      {
        url: 'https://filmhub.one/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Filmhub — фильмы и сериалы онлайн',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filmhub — смотреть фильмы и сериалы онлайн',
    description: 'Новинки кино и сериалов в хорошем качестве.',
    images: ['https://filmhub.one/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ru">
              <head>
              <link
          rel="manifest"
          crossOrigin="use-credentials"
          href="/manifest.json"
        />
        {/* Метрика подключается только в продакшене: в разработке она
            только сыпет ошибками в консоль */}
        {process.env.NODE_ENV === "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          
              ym(95416777, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true
              });
              `
            }}
          />
        ) : null}
        </head>
      <body className={inter.className}>
      <noscript><div><img src="https://mc.yandex.ru/watch/95416777" style={{position:"absolute", left:"-9999px"}} alt="" /></div></noscript>
      <Providers>
        <StyledComponentsRegistry>
        <NextTopLoader color='red' />
          {children}
        {/* Скелетон следующей страницы: показывается между кликом и переходом.
            Лежит в корневом макете, потому что главная рендерит шапку сама
            и не попадает под (wrap)-layout. Стоит после контента — при равном
            z-index так он оказывается сверху. */}
        <NavigationSkeleton />
        </StyledComponentsRegistry>
        </Providers>
        </body>
    </html>
  )
}
