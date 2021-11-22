import '~/styles/main.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { FaCocktail, FaMusic, FaTrain } from 'react-icons/fa'
import { QueryClient, QueryClientProvider } from 'react-query'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import EmojiFavicon from '~/components/primitives/EmojiFavicon'

const queryClient = new QueryClient()

function Footer() {
  return (
    <div className="flex flex-row items-stretch justify-center text-3xl text-gray-800">
      <div className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-pink-800 cursor-pointer hover:bg-pink-600">
        <FaMusic />
      </div>
      <div className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-yellow-800 cursor-pointer hover:bg-yellow-600">
        <FaCocktail />
      </div>
      <div className="flex flex-row items-center justify-center flex-1 px-2 py-3 bg-green-800 cursor-pointer hover:bg-green-600">
        <FaTrain />
      </div>
    </div>
  )
}

function App({ Component, pageProps }: AppProps) {
  useFathom()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fd015d" />
      </Head>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Footer />
      </QueryClientProvider>
      <EmojiFavicon emoji="🤖" />
    </>
  )
}

export default App
