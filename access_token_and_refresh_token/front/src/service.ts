import axios, { AxiosRequestConfig } from "axios";
interface PendingQueue {
  config: AxiosRequestConfig
  resolve: (...args: any[]) => void
}
let refreshing = false;
const requestQueue:PendingQueue[] = [];

function getToken(){
  return localStorage.getItem("token");
}


const service = axios.create({
  baseURL: "http://localhost:3000",
  // withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


async function refreshToken(){
  const res = await service.get('/user/refreshToken',{
    params:{
      refresh_token: localStorage.getItem("refresh_token")
    }
  })
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  return res;
}


service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if(token){
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('response error:',error);
    const {data,config} = error.response;

    if(refreshing){
      return new Promise((resolve)=>{
        requestQueue.push({
          config,
          resolve
        });
      })
    }
    if(data.statusCode === 401 && !config.url.includes('/refreshToken')){
      refreshing = true;
      const res = await refreshToken();
      if(res.status === 200){
        refreshing = false;
        requestQueue.forEach((request)=>{
          const {config,resolve} = request;
          resolve(service(config));
        })

        return service(config);
      }else{
        alert("请重新登录.");
        Promise.reject(res.data);
      }
    }
    Promise.reject(error);
  }
);

export default service;