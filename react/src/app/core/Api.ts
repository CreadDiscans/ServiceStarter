import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import queryString from 'query-string';
import * as ApiType from 'types/api.types';
declare var csrf_token:string;

const domain = process.env.API_DOMAIN;
const jwtRefreshExp = 3 * 60 * 60 * 1000; // 만료 3시간 전

const KEY_JWT_TOKEN = 'jwt_token';
const KEY_USER_PROFILE = 'user_profile';
export const tokenExpiredSubject = new BehaviorSubject<boolean>(false);

const setHeader = async() => {
    return new Promise(resolve=> {
        axios.defaults.headers.common['X-CSRFToken'] = csrf_token;
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem(KEY_JWT_TOKEN);
            if (token === null) {
                delete axios.defaults.headers.common['Authorization']
                resolve()
            } else {
                const state = checkTokenExpired(token)
                if(state === 'valid') {
                    axios.defaults.headers.common['Authorization'] = 'JWT '+token;
                    resolve()
                } else if(state === 'refresh') {
                    delete axios.defaults.headers.common['Authorization']
                    axios.post(domain+'/api/token-refresh', {
                        token: token
                    }).then((res:any)=> {
                        localStorage.setItem(KEY_JWT_TOKEN, res.token);
                        axios.defaults.headers.common['Authorization'] = 'JWT '+res.token;
                        resolve();
                    })
                } else if (state === 'invalid') {
                    tokenExpiredSubject.next(true);
                    delete axios.defaults.headers.common['Authorization'];
                    resolve();
                }
            }
        } else {
            resolve()
        }
    })
}

const queryUrl = (url:string, query:any, id:number|undefined|string=undefined)=> {
    if (id) {
        if (url[url.length-1] !== '/') {
            url += '/';
        }
        url += id+'/';
    }
    if (Object.keys(query).length > 0) {
        url += '?';
        Object.keys(query).forEach((key, i)=> {
            if (i !== 0) {
                url += '&';
            }
            url += key + '=' + query[key]
        })
    }
    return url;
}

const checkTokenExpired = (token:string) => {
    const payload = parseJwt(token);
    const expDate = new Date(payload.exp*1000);
    const refreshDate = new Date(payload.exp*1000 - jwtRefreshExp);
    const current = new Date();
    if (current < refreshDate) {
        return 'valid';
    } 
    if (current < expDate) {
        return 'refresh';
    }
    return 'invalid'
}

const parseJwt = (token:string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export class Api{
    static async list<T>(url:string, query:object):Promise<T>{
        await setHeader();
        return axios.get(domain+url+'?'+queryString.stringify(query)).then(res=>res.data)
    }
    static async create<T>(url:string, body:object):Promise<T> {
        await setHeader();
        return axios.post(domain+url, body).then(res=>res.data);
    }
    static async retrieve<T>(url:string, id:number|string, query:object):Promise<T> {
        await setHeader();
        return axios.get(domain+queryUrl(url, query, id)).then(res=>res.data)
    }
    static async update<T>(url:string, id:number|string, body:object):Promise<T> {
        await setHeader();
        return axios.put(domain+queryUrl(url, {}, id), body).then(res=>res.data)
    }
    static async patch<T> (url:string, id:number|string, body:object):Promise<T> {
        await setHeader();
        return axios.patch(domain+queryUrl(url, {}, id), body).then(res=>res.data);
    }
    static async delete<T> (url:string, id:number|string):Promise<T> {
        await setHeader();
        return axios.delete(domain+queryUrl(url, {}, id)).then(res=>res.data);
    }
    static signIn(jwt_token:string, user_profile:ApiType.Profile|undefined) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(KEY_JWT_TOKEN, jwt_token);
            if (user_profile)
                localStorage.setItem(KEY_USER_PROFILE, JSON.stringify(user_profile));
        }
    }
    static signOut() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(KEY_JWT_TOKEN);
            localStorage.removeItem(KEY_USER_PROFILE);
        }
    }
}