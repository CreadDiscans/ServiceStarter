import { Singletone } from "./Singletone";
import queryString from 'query-string';
import { auth } from "../types/custom.types";
import AsyncStorage from "@react-native-community/async-storage";

export class ApiService extends Singletone<ApiService> {

    apiUrl = __DEV__ ? 'http://localhost:8000' : 'http://localhost:8000' // dev : prod
    headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: ''
    }

    signin(username:string, password:string) {
        return this.post<{token:string}>('/api/token-auth/', {
            username:username,
            password:password
        }).then(res=> {
            this.headers.Authorization = 'JWT '+res.token
            AsyncStorage.setItem('auth', JSON.stringify({
                username:username,
                password:password,
                token:res.token
            }))
            return this.get<auth.User>('/api-user/', {self:true})
        })
    }

    signup(username:string, email:string, password:string) {
        return this.get<auth.User[]>('/api-user/', {
            username: username
        }).then(res=> {
            if (res.length > 0) {
                return Promise.reject('exist User')
            } else {
                return this.post<auth.User>('/api-user/', {
                    username:username,
                    email:email,
                    password:password
                })
            }
        })
    }

    signout() {
        AsyncStorage.removeItem('auth')
        delete this.headers.Authorization
    }

    private parseJwt(token:string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }

    private isTokenExpired(token:string) {
        const payload = this.parseJwt(token);
        const expDate = new Date(payload.exp*1000);
        const current = new Date();
        if (current < expDate) {
            return false;
        } else {
            return true;
        }
    }

    private async getHeader() {
        const auth = await AsyncStorage.getItem('auth')
        if (auth) {
            const authObj = JSON.parse(auth)
            if (this.isTokenExpired(authObj.token)) {
                await this.signin(authObj.username, authObj.password)
            }
        }
        return this.headers
    }

    get<T>(path:string, query:object={}):Promise<T> {
        return this.request<T>('GET', path+'?'+queryString.stringify(query))
    }

    post<T>(path:string, body:object={}):Promise<T> {
        return this.request<T>('POST', path, body)
    }

    put<T>(path:string, body:object={}):Promise<T> {
        return this.request<T>('PUT', path, body)
    }

    delete<T>(path:string, query:object={}):Promise<T> {
        return this.request<T>('DELETE', path+'?'+queryString.stringify(query))
    }

    patch<T>(path:string, body:object={}):Promise<T> {
        return this.request<T>('PATCH', path, body)
    }

    private async request<T>(method:string, path:string, body:object={}):Promise<T> {
        const data:RequestInit = {
            method: method,
            headers: await this.getHeader()
        }
        if (Object.keys(body).length >0) {
            data.body = JSON.stringify(body)
        }

        return fetch(this.apiUrl+path, data)
        .then(res=> res.json())
        .catch(err=> console.log(err))
    }
}