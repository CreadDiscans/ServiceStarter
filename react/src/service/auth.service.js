import jwt from 'jsonwebtoken';
import PubsubService from './pubsub.service';
import { RequestService } from './request.service';
import { map } from 'rxjs/operators';

export default class AuthService {
    
    static STORAGE_KEY_TOKEN = 'token'
    static URL_TOKEN_AUTH = 'api/token-auth/'

    constructor() {
        this.auth = {
            token: localStorage.getItem(AuthService.STORAGE_KEY_TOKEN)
        }
        if (!this.isExpired()) {
            PubsubService.pub(PubsubService.KEY_LOGIN, {login: true})
            RequestService.setHeader('Authorization', 'JWT ' + this.auth.token)
        }
    }

    isExpired() {
        if (!this.auth || !this.auth.token) {
            return true;
        }
        const decoded = jwt.decode(this.auth.token);
        if (new Date(decoded.exp*1000)> new Date()) {
            return false;
        }
        return true;
    }

    static login(username, password) {
        return RequestService.post(AuthService.URL_TOKEN_AUTH,{
            username: username,
            password: password
        }).pipe(
            map(res=> {
                RequestService.setHeader('Authorization', 'JWT ' + res.token)
                localStorage.setItem(AuthService.STORAGE_KEY_TOKEN, res.token)
                PubsubService.pub(PubsubService.KEY_LOGIN, {login: true})
                return res
            })
        )
    }

    static logout() {
        localStorage.removeItem(AuthService.STORAGE_KEY_TOKEN)
        RequestService.setHeader('Authorization', undefined)
        PubsubService.pub(PubsubService.KEY_LOGIN, {login:false})
    }
}