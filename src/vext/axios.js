//axios 配置
import axios from 'axios'
axios.defaults.baseURL = '/corp'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';
axios.defaults.method = 'post'
axios.defaults.withCredentials = true

//请求拦截器
axios.interceptors.request.use(function(config){ 
  if(['get','delete','head','options'].indexOf(config.method)>=0){
    config.url += (config.url.indexOf('?') >= 0 ? '&_tms=' : '?_tms=') + (new Date()).getTime();
  }
  return config;
},function(err){ 
  err.toString = ()=>{
    return '请求出错！';
  }
  return Promise.reject(err);
});

//响应拦截器
axios.interceptors.response.use(function(res){
  if(res.data && typeof(res.data) == "object"){
  	// 登录失效
  	if(res.data.code == 401){
  		window.location.replace('/corp/login');
  		return res;
  	}
  }
  return res;
},function(err){ 
  err.toString = ()=>{
    return '响应错误！错误码：' + err.response.status+'，'+err.response.statusText;
  } 
  return Promise.reject(err);
}); 

export default axios;