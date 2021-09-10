import '~/styles/main.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { QueryClient, QueryClientProvider } from 'react-query'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import EmojiFavicon from '~/components/primitives/EmojiFavicon'

const queryClient = new QueryClient()

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
      </QueryClientProvider>
      <EmojiFavicon emoji="🤖" />
    </>
  )
}

export default App
