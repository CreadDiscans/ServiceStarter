import axios from 'axios';

export const login = (username:string, password:string) => axios.post('/api/token-auth/', {
  username:username,
  password:password
}).then((res:any)=> {
  axios.defaults.headers.common['Authorization'] = 'JWT '+res.token;
  return true
})

export const logout = () => {
  delete axios.defaults.headers.common['Authorization']
}