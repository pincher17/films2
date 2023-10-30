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
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  applicationName: 'Filmhub',
  verification: {
    yandex: '14eacbc578f7574d',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ru">
      <body className={inter.className}>
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
