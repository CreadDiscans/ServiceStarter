import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import React from 'react'
import { I18next } from '../component/I18next'

function Home() {
  const router = useRouter()
  const { t } = useTranslation('common')
  
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <I18next/>
        <h1>{t('activation.move')}</h1>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>
    </div>
  )
}

export const getStaticProps:GetStaticProps = async ({locale}) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
  }
})

export default Home