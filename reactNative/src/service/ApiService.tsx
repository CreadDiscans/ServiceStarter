import { Singletone } from "./Singletone";
import queryString from 'query-string';
import { auth } from "../types/custom.types";

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
            return this.get<auth.User>('/api-user/', {self:true})
        }).catch(err=>console.log(err));
    }

    signup(username:string, email:string, password:string) {
        return this.post<auth.User>('/api-user/', {
            username:username,
            email:email,
            password:password
        })
    }

    signout() {
        delete this.headers.Authorization
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

    private request<T>(method:string, path:string, body:object={}):Promise<T>|any {
        const data:RequestInit = {
            method: method,
            headers: this.headers
        }
        if (Object.keys(body).length >0) {
            data.body = JSON.stringify(body)
        }

        return fetch(this.apiUrl+path, data)
        .then(res=> res.json())
        .catch(err=> console.log(err))
    }
}