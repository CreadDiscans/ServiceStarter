import {BehaviorSubject} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';

class DataService {

  static subject = new BehaviorSubject();

  get = () => {
    return DataService.subject;
  }

  host = 'https://localhost:8000/api/'

  select(url, param=null) {
    return ajax({
      url: this.host + url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      param: param
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }

  create(url, data) {
    return ajax({
      url: this.host + url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
      param: param
    }).pipe(
      map(userResponse => userResponse.response),
      catchError(error => console.log('error: ', error))
    );
  }
} 

export default DataService;