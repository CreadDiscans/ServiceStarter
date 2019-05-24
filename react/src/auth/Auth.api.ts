import axios from 'axios';

export const tokenAuth = (username:string, password:string) => axios.post('/api/token-auth/', {
  username:username,
  password:password
}).then(res => {
  axios.defaults.headers.common['Authorization'] = 'JWT ' + res.data.token;
  return Promise.all([axios.get('/api-user/?self=true'), res]);
})

export const logout = () => {
  delete axios.defaults.headers.common['Authorization'];
  return undefined;
}