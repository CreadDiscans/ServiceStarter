import {BehaviorSubject} from 'rxjs';

class DataService {

  static subject = new BehaviorSubject();

  get = () => {
    return DataService.subject;
  }
}

export default DataService;