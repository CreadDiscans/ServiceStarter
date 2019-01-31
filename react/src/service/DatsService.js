import { map, mergeMap, catchError } from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';
import {of} from 'rxjs';
import jwt from 'jsonwebtoken';
import { ConnectService } from './ConnectService';

export class DataService {
  static instance = null;

  // HOST = '/api/';
  HOST = 'http://localhost:8000/api/';
  constructor() {
    this.auth = {
      token: localStorage.getItem('token')
    }
    if (!this.isExpired()) {
      ConnectService.getInstance().get('login').next({login:true});
    }
  }

  static getInstance() {
    if (DataService.instance === null) {
      DataService.createInstance();
    }
    return DataService.instance;
  }

  static createInstance() {
    if (DataService.instance === null) {
      DataService.instance = new DataService();
    }
  }

  login(username, password) {
    return this.post('token-auth/', {
      username: username,
      password: password
    }).pipe(
      map(res=> {
        this.auth = res;
        localStorage.setItem('token', res.token);
        return true;
      })
    )
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

  signout() {
    this.auth = null;
    localStorage.removeItem('token');
  }

  isSigned() {
    if (this.isExpired()) {
      return of(false);
    } else {
      const last_refesh = localStorage.getItem('last_refresh');
      if (last_refesh === null || new Date() - new Date(Number(last_refesh)) > 10*1000) {
        return ajax({
          url: this.HOST + 'token-refresh/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            token: this.auth.token
          }
        }).pipe(
          map((res)=> {
            this.auth = res.response;
            localStorage.setItem('last_refresh', String(new Date().getTime()));
            localStorage.setItem('token', this.auth.token);
            return true;
          }),
          catchError((err) => console.log(err))
        );
      } else {
        console.log('4');
        return of(true);
      }
    }
  }

  get(url, param={}) {
    return this.getHeader().pipe(
      mergeMap(header=> {
        return ajax({
          url: this.HOST + url + this.getQuery(param),
          method: 'GET',
          headers: header,
        })
      }),
      map(userResponse => {
        return userResponse.response
      }),
      catchError(error => console.log('error: ', error))
    );
  }

  post(url, data=null) {
    return this.getHeader().pipe(
      mergeMap(header=> {
        return ajax({
          url: this.HOST + url,
          method: 'POST',
          headers: header,
          body: data
        })
      }),
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  put(url, data) {
    return this.getHeader().pipe(
      mergeMap(header=> {
        return ajax({
          url: this.HOST + url,
          method: 'PATCH',
          headers: header,
          body: data
        })
      }),
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  delete(url, param={}) {
    return this.getHeader().pipe(
      mergeMap(header=> {
        return ajax({
          url: this.HOST + url,
          method: 'DELETE',
          headers: header,
        })
      }),
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  getHeader() {
    const headers = {
      'Content-Type': 'application/json',
    }
    return this.isSigned().pipe(
      map(result=> {
        if (result) {
          headers['Authorization'] = 'JWT ' + this.auth.token;
        }
        return headers;
      })
    )
  }

  getQuery(params) {
    let query = '';
    for(let key in params) {
      query += key + '=' + params[key] + '&';
    }
    if (query.length !== 0) {
      query = '?' + query.slice(0, -1);
    }
    return query;
  }
} 
