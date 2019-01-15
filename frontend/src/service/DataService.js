import { map, catchError } from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';
import {of} from 'rxjs';

class DataService {
  auth = null;
  constructor() {
    if (process.env.NODE_ENV === 'development')
      this.host = 'https://localhost:8000/api/';
    else
      this.host = '/api/';
    const token = localStorage.getItem('token');
    if (token) {
      this.auth = {
        token : token
      }
    }
  }

  signin(username, password) {
    return this.create('token-auth/', {
      username: username,
      password: password
    }).pipe(
      map(userResponse => {
        this.auth = userResponse;
        localStorage.setItem('token', this.auth.token);
        return true;
      }),
      catchError(error => console.log('error: ', error))
    );
  }

  signout() {
    this.auth = null;
    localStorage.removeItem('token');
  }

  isSigned() {
    if (this.auth == null) {
      return of(false);
    }
    return this.create('token-verify/', {
      token: this.auth.token
    }).pipe(
      map(()=> true),
      catchError(() => false)
    );
  }

  select(url, param=null) {
    return ajax({
      url: this.host + url,
      method: 'GET',
      headers: this.getHeader(),
      param: param
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
    );
  }

  update(url, data) {
    return ajax({
      url: this.host + url,
      method: 'PATCH',
      headers: this.getHeader(),
      body: data
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  delete(url, param=null) {
    return ajax({
      url: this.host + url,
      method: 'DELETE',
      headers: this.getHeader(),
      param: param
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  getHeader() {
    const headers = {
      'Content-Type': 'application/json',
    }
    if (this.auth != null) {
      headers['Authorization'] = 'JWT ' +this.auth.token;
    }
    return headers;
  }
} 

export default DataService;