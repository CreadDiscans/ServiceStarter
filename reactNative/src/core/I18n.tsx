import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ko from './lang/ko.json'
import en from './lang/en.json'

const getResources = (langs: { [lang: string]: any }) => {
    const resource: any = {}
    Object.keys(langs).forEach(lang => {
        resource[lang] = {
            translation: langs[lang]
        }
    })
    return resource
}

i18n.use(initReactI18next)
    .init({
        resources: getResources({
            ko, en
        }),
        lng: 'ko',
    })
export default i18n