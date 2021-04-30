import axios from 'axios';
import queryString from 'query-string';
import { U } from './U';

const domain = 'http://localhost:8000'

const KEY_JWT_TOKEN = 'jwt_token'

const setHeader = async () => {
    return new Promise((resolve:any) => {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem(KEY_JWT_TOKEN);
            if (token === null) {
                delete axios.defaults.headers.common['Authorization']
                resolve()
            } else {
                if (isTokenExpired(token)) {
                    axios.post(domain+'/api/token-refresh/',{token})
                    .then(res=> {
                        Api.signIn(res.data.token)
                        axios.defaults.headers.common['Authorization'] = 'JWT ' + res.data.token;
                        resolve()
                    })
                    .catch(err=> {
                        Api.signOut()
                        location.href = '/signin'
                        delete axios.defaults.headers.common['Authorization']
                    })
                } else {
                    axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
                    resolve()
                }
            }
        } else {
            resolve()
        }
    })
}

const queryUrl = (url: string, query: any, id: number | undefined | string = undefined) => {
    if (id !== undefined) {
        if (url[url.length - 1] !== '/') {
            url += '/';
        }
        url += id + '/';
    }
    if (Object.keys(query).length > 0) {
        url += '?';
        Object.keys(query).forEach((key, i) => {
            if (i !== 0) {
                url += '&';
            }
            url += key + '=' + query[key]
        })
    }
    return url;
}

const isTokenExpired = (token: string) => {
    const payload = parseJwt(token);
    const expDate = new Date(payload.exp * 1000);
    const current = new Date();
    return current > expDate
}

const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export class Api {

    static async list<T>(url: string, query: object): Promise<T> {
        await setHeader();
        return axios.get(domain + url + '?' + queryString.stringify(query))
    }
    static async create<T>(url: string, body: object): Promise<T> {
        await setHeader();
        return axios.post(domain + url, body)
    }
    static async retrieve<T>(url: string, id: number | string, query: object): Promise<T> {
        await setHeader();
        return axios.get(domain + queryUrl(url, query, id))
    }
    static async update<T>(url: string, id: number | string, body: object): Promise<T> {
        await setHeader();
        return axios.put(domain + queryUrl(url, {}, id), body)
    }
    static async patch<T>(url: string, id: number | string, body: object): Promise<T> {
        await setHeader();
        return axios.patch(domain + queryUrl(url, {}, id), body)
    }
    static async delete<T>(url: string, id: number | string): Promise<T> {
        await setHeader();
        return axios.delete(domain + queryUrl(url, {}, id))
    }
    static async upload(file: File): Promise<{ uploaded: boolean, url: string }> {
        await setHeader()
        const formData = new FormData()
        formData.append('upload', file)
        return axios.post(domain + '/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
    static async expand<T>(arr: Array<any>, key: string, url: string, mtm: boolean = false): Promise<T[]> {
        let ids
        if (mtm) ids = U.union(arr.filter(item => item[key]).map((item: any) => item[key]))
        else ids = U.union([arr.filter(item => item[key]).map((item: any) => item[key])])
        if (ids.length > 0) {
            const res: Array<any> = await Api.list(url, {
                'pk__in[]': ids
            })
            if (mtm) arr.forEach((item: any) => item[key] = item[key].map((id: number) => res.filter(r => r.id === id)[0]))
            else arr.forEach((item: any) => item[key] = res.filter(r => r.id === item[key])[0])
        }
        return Promise.resolve(arr)
    }
    static signIn(jwt_token: string) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(KEY_JWT_TOKEN, jwt_token);
            // if (user_profile)
            //     localStorage.setItem(KEY_USER_PROFILE, JSON.stringify(user_profile));
        }
    }
    static signOut() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(KEY_JWT_TOKEN);
            // localStorage.removeItem(KEY_USER_PROFILE);
        }
    }
}