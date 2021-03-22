import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'

const ServiceStaterApp = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />
}

export default appWithTranslation(ServiceStaterApp)