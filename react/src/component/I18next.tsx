import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import koKR from 'app/lang/ko-KR.json';
import enUS from 'app/lang/en-US.json';
import { Container } from 'reactstrap';

let lang = 'ko-KR'

if (typeof localStorage !== 'undefined') {
    lang = localStorage.getItem('lang') || navigator.language
}

i18n.use(initReactI18next)
.init({
    resources: {
        'en-US': {translation: enUS},
        'ko-KR': {translation: koKR},
    },
    lng: lang,
    fallbackLng: lang,
    interpolation: {
        escapeValue: false
    }
})

export const translation = (prefix:string, keys:Array<string>) => {
    const out:any = {}
    keys.map(key=> out[key] = i18n.t(prefix+'.'+key))
    return out
}

interface Props {

}

export class I18next extends React.Component<Props> {
    state:any = {
        str:translation('i18n', [
            'item'
        ]),
        hover:undefined
    }

    changeLanguage(lang:string) {
        localStorage.setItem('lang', lang)
        location.reload()
    }

    render() {
        return <div style={{position:'fixed', width:'100%', color:'#999', fontSize:10, zIndex:2000}}>
            <Container>
                <div className="d-flex flex-row float-right" style={{marginRight:60}}>
                    {[
                        ['en-US', 'English'], 
                        ['ko-KR', 'Korean']
                    ].map(item=> 
                    <div key={item[0]} style={this.state.hover === item[0] ? {color:'white', cursor:'pointer'}:{}} 
                        className="mx-2" 
                        onClick={()=>this.changeLanguage(item[0])}
                        onMouseOver={()=>this.setState({hover:item[0]})}
                        onMouseLeave={()=>this.setState({hover:undefined})}>{item[1]}</div>)}
                </div>
            </Container>
        </div>
    }
}