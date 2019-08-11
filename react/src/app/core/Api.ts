import axios from 'axios';
declare var csrf_token:string;

const KEY_JWT_TOKEN = 'jwt_token';
const KEY_USER_ID = 'user_id';

const setHeader = () => {
    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem(KEY_JWT_TOKEN);
        if (token === null) {
            delete axios.defaults.headers.common['Authorization']
        } else {
            axios.defaults.headers.common['Authorization'] = 'JWT '+token;
        }
    }
    axios.defaults.headers.common['X-CSRFToken'] = csrf_token;
}

const queryUrl = (url:string, query:any, id:number|undefined|string=undefined)=> {
    if (id) {
        if (url[url.length-1] !== '/') {
            url += '/';
        }
        url += id+'/';
    }
    if (Object.keys(query).length > 0) {
        url += '?';
        Object.keys(query).forEach((key, i)=> {
            if (i !== 0) {
                url += '&';
            }
            url += key + '=' + query[key]
        })
    }
    return url;
}

export const Api = {
    list:(url:string, query:object)=> {
        setHeader();
        return axios.get(queryUrl(url, query)).then(res=>res.data);
    },
    create:(url:string, body:object)=> {
        setHeader();
        return axios.post(url, body).then(res=>res.data);
    },
    retrieve:(url:string, id:number|string, query:object)=> {
        setHeader();
        return axios.get(queryUrl(url, query, id)).then(res=>res.data)
    },
    update:(url:string, id:number|string, body:object)=> {
        setHeader();
        return axios.put(queryUrl(url, {}, id), body).then(res=>res.data)
    },
    patch:(url:string, id:number|string, body:object)=> {
        setHeader();
        return axios.patch(queryUrl(url, {}, id), body).then(res=>res.data);
    },
    delete:(url:string, id:number|string)=> {
        setHeader();
        return axios.delete(queryUrl(url, {}, id)).then(res=>res.data);
    },
    signIn:(jwt_token:string, user_id:string|number)=> {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(KEY_JWT_TOKEN, jwt_token);
            localStorage.setItem(KEY_USER_ID, String(user_id));
        }
    },
    signOut: ()=> {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(KEY_JWT_TOKEN);
            localStorage.removeItem(KEY_USER_ID);
        }
    }
}