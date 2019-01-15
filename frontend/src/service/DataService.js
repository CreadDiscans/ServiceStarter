import { map, catchError } from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';
import {of} from 'rxjs';
import jwt from 'jsonwebtoken';

class DataService {
  static auth = null;
  constructor() {
    if (process.env.NODE_ENV === 'development')
      this.host = 'https://localhost:8000/api/';
    else
      this.host = '/api/';

    if (DataService.auth === null && !this.isExpired()){
      DataService.auth = {
        token: localStorage.getItem('token')
      };
    };
  }

  isExpired() {
    let token;
    if (DataService.auth === null) {
      token = localStorage.getItem('token');
    } else {
      token = DataService.auth.token;
    }
    if (token && token != 'undefined') {
      const decoded = jwt.decode(token);
      if (new Date(decoded.exp*1000)> new Date()) {
        return false;
      }
    }
    return true;
  }

  signin(username, password) {
    return ajax({
      url: this.host + 'token-auth/',
      method: 'POST',
      headers: this.getHeader(),
      body: {
        username: username,
        password: password
      }
    }).pipe(
      map(userResponse => {
        DataService.auth = userResponse.response;
        localStorage.setItem('token', DataService.auth.token);
        return true;
      }),
      catchError(error => console.log('error: ', error))
    );
  }

  signout() {
    DataService.auth = null;
    localStorage.removeItem('token');
  }

  isSigned() {
    if (DataService.auth == null) {
      return of(false);
    }
    if (this.isExpired()) {
      return ajax({
        url: this.host + 'token-refresh/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: DataService.auth
      }).pipe(
        map((res)=> {
          DataService.auth = res.response;
          localStorage.setItem('token', DataService.auth.token);
          return true;
        }),
        catchError((err) => console.log(err))
      );
    } else {
      return of(true);
    }
  }

  select(url, param={}) {
    return ajax({
      url: this.host + url + this.getQuery(param),
      method: 'GET',
      headers: this.getHeader(),
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  create(url, data=null) {
    return ajax({
        url: this.host + url,
        method: 'POST',
        headers: this.getHeader(),
        body: data
      }).pipe(
        map(userResponse => userResponse.response),
        catchError(error => console.log('error: ', error))
    )
  }

  update(url, data) {
    return  ajax({
      url: this.host + url,
      method: 'PATCH',
      headers: this.getHeader(),
      body: data
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    )
  }

  delete(url, param={}) {
    return ajax({
      url: this.host + url,
      method: 'DELETE',
      headers: this.getHeader(),
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    )
  }

  getHeader() {
    const headers = {
      'Content-Type': 'application/json',
    }
    if (DataService.auth !== null) {
      headers['Authorization'] = 'JWT ' +DataService.auth.token;
    }
    return headers;
  }

  getQuery(params) {
    let query = '';
    for(let key in params) {
      query += key + '=' + params[key] + '&';
    }
    if (query.length != 0) {
      query = '?' + query.slice(0, -1);
    }
    return query;
  }
} 

export default DataService;