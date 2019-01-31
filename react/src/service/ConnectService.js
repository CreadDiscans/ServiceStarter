import {BehaviorSubject} from 'rxjs';

export class ConnectService {
  static instance = null;

  pool = {}

  static getInstance() {
    if (ConnectService.instance === null) {
      ConnectService.createInstance();
    }
    return ConnectService.instance;
  }

  static createInstance() {
    if (ConnectService.instance === null) {
      ConnectService.instance = new ConnectService();
    }
  }

  get(key) {
    if (!(key in this.pool)) {
      this.pool[key] = new BehaviorSubject({});
    }
    return this.pool[key];
  }
}