import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from './registry'
import { Providers } from "@/redux/provider";
import NextTopLoader from 'nextjs-toploader';

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
    canonical: 'https://filmhub.lol',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ru">
              <head>
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
        </head>
      <body className={inter.className}>
      <noscript><div><img src="https://mc.yandex.ru/watch/95416777" style={{position:"absolute", left:"-9999px"}} alt="" /></div></noscript>
      <Providers>
        <StyledComponentsRegistry>
        <NextTopLoader color='red' />
          {children}
        </StyledComponentsRegistry>
        </Providers>
        </body>
    </html>
  )
}
