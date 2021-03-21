import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import {useEffect} from 'react'

const ServiceStaterApp = ({ Component, pageProps }) => {
    const router = useRouter();
    const { locale } = router;

    return <Component {...pageProps} />
}

export default appWithTranslation(ServiceStaterApp)