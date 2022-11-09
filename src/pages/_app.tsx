import Head from 'next/head'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '../styles/global.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>NLW | Copa</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
