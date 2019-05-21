import { BehaviorSubject } from "rxjs";

export default class PubsubService {

    static KEY_LOGIN = 'login';

    static streams:any = {};

    static sub(key:string) {
        if (!(key in this.streams)) {
            this.streams[key] = new BehaviorSubject(undefined);
        }
        return this.streams[key];
    }

    static unsub(key:string) {
        if (key in this.streams) {
            delete this.streams[key];
        }
    }

    static pub(key:string, value:any) {
        if (key in this.streams) {
            this.streams[key].next(value);
        }
    }


}