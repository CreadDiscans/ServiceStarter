import queryString from 'query-string';
import AsyncStorage from "@react-native-community/async-storage";
import { auth } from '../types/custom.types';
import * as ApiType from '../types/api.types';

const apiUrl = 'https://servicestarter.kro.kr'
const headers = {
    'Content-Type': 'application/json',
    Authorization: ''
}
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const atob = (input:string) => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
}

const parseJwt = (token:string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const isTokenExpired = (token:string) => {
    const payload = parseJwt(token);
    const expDate = new Date(payload.exp*1000);
    const current = new Date();
    if (current < expDate) {
        return false;
    } else {
        return true;
    }
}

const getHeader = async() => {
    const auth = await AsyncStorage.getItem('auth')
    if (auth) {
        const authObj = JSON.parse(auth)
        if (isTokenExpired(authObj.token)) {
            const jwt = await Api.create<{token:string}>('/api/token-auth/', {
                username:authObj.username,
                password:authObj.password
            }).catch(err=> undefined)
            if (!jwt) Api.signOut()
            else {
                authObj.token = jwt.token
                Api.signIn(undefined, authObj)
            }
        }
        headers.Authorization = 'JWT '+authObj.token
    }
    return headers
}

const request = async(method:string, path:string, body:object={}) => {
    const data:RequestInit = {
        method: method,
        headers: method === 'GET' || 
            path === '/api/token-auth/' || 
            path === '/api-user/' || 
            path === '/social/' ? 
            headers : await getHeader()
    }
    if (Object.keys(body).length >0) {
        data.body = JSON.stringify(body)
    }
    return fetch(apiUrl+path, data)
    .then(res=> res.json())
}

export class Api {

    static signIn(profile:ApiType.Profile|undefined,
        auth:{username:string,password:string, token:string}|undefined) {
        if (profile) AsyncStorage.setItem('profile', JSON.stringify(profile))
        if (auth) AsyncStorage.setItem('auth', JSON.stringify(auth))
    }

    static signOut() {
        AsyncStorage.removeItem('profile')
        AsyncStorage.removeItem('auth')
    }

    static list<T>(path:string, query:object={}):Promise<T> {
        return request('GET', path+'?'+queryString.stringify(query))
    }

    static create<T>(path:string, body:object={}):Promise<T> {
        return request('POST', path, body)
    }

    static retrieve<T>(path:string, id:number, query:object={}):Promise<T> {
        return request('GET', path+id+'/'+'?'+queryString.stringify(query))
    }

    static update<T>(path:string, id:number, body:object={}):Promise<T> {
        return request('PUT', path+id+'/', body)
    }

    static delete<T>(path:string, id:number):Promise<T> {
        return request('DELETE', path+id+'/')
    }

    static patch<T>(path:string, id:number, body:object={}):Promise<T> {
        return request('PATCH', path+id+'/', body)
    }
}