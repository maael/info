import '~/styles/main.css'
import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { FaCocktail, FaMusic, FaTrain, FaBook, FaDice } from 'react-icons/fa'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useSwipeable } from 'react-swipeable'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import EmojiFavicon from '~/components/primitives/EmojiFavicon'
import NeonText from '~/components/primitives/NeonText'
import Main from '~/components/compositions/Main'

const queryClient = new QueryClient()

function Footer() {
  const [showQR, setShowQR] = React.useState(false)
  const swipeHandlers = useSwipeable({
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    onSwiped: () => {
      setShowQR(true)
    },
  })
  return (
    <>
      {showQR ? (
        <div
          className="absolute z-50 flex flex-col items-center justify-center inset-2"
          onClick={() => setShowQR(false)}
        >
          <div style={{ width: '80vmin', height: '80vmin' }} className="relative shadow-md">
            <Image src="/images/wifi.jpg" layout="fill" />
          </div>
          <NeonText Element="h1" className="mt-4 text-4xl">
            Scan for WiFi
          </NeonText>
          <p>Tap to close</p>
        </div>
      ) : null}
      <div
        className="z-50 flex flex-row items-stretch justify-center text-3xl text-gray-800 transition-all opacity-50 lg:text-xl hover:opacity-100"
        {...swipeHandlers}
      >
        <Link href="/">
          <a className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-pink-800 cursor-pointer lg:py-1 hover:bg-pink-600">
            <FaMusic />
          </a>
        </Link>
        <Link href="/drinks">
          <a className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-yellow-800 cursor-pointer lg:py-1 hover:bg-yellow-600">
            <FaCocktail />
          </a>
        </Link>
        <Link href="/games">
          <a className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-purple-800 cursor-pointer lg:py-1 hover:bg-purple-600">
            <FaDice />
          </a>
        </Link>
        <Link href="/guestbook">
          <a className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-blue-800 cursor-pointer lg:py-1 hover:bg-blue-600">
            <FaBook />
          </a>
        </Link>
        <Link href="/trains">
          <a className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-green-800 cursor-pointer lg:py-1 hover:bg-green-600">
            <FaTrain />
          </a>
        </Link>
      </div>
    </>
  )
}

function App({ Component, pageProps }: AppProps) {
  useFathom()
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        function (registration) {
          console.log('Service Worker registration successful with scope: ', registration.scope)
        },
        function (err) {
          console.log('Service Worker registration failed: ', err)
        }
      )
    }
  }, [])
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fd015d" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <div className="relative flex flex-col flex-1 p-5">
          <Component {...pageProps} />
          <Main />
        </div>
        <Footer />
      </QueryClientProvider>
      <EmojiFavicon emoji="ℹ️" />
    </>
  )
}

export default App
