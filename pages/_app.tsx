import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { app, auth, db, rtdb } from 'src/utils/firebaseClient'

export { app, auth, db, rtdb }

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
