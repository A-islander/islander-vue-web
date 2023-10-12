import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElLoading } from 'element-plus'
import store from './store'

let loading: any

const loadingStr = ['k3u7DKB说：wssbhhhaaaaaaaaaaaaaaaaaaaaaaa'];

let getLoadingStr = () => {
    let index = Math.floor((Math.random() * loadingStr.length));
    return loadingStr[index];
}

const startLoading = () => {
    interface Options {
        lock: boolean;
        text: string;
    }
    const options: Options = {
        lock: true,
        text: getLoadingStr(),
    }
    // loading = ElLoading.service(options)
}

const endLoading = () => {
    // loading.close()
}

// axios.defaults.baseURL = 'http://127.0.0.1:12345/'
axios.defaults.baseURL = 'https://forum-api.islander.top/'
// axios.defaults.headers.common['Authorization'] = store.getters.getAuthToken

// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    startLoading()
    return config
})

// 响应拦截
axios.interceptors.response.use((response: AxiosResponse<any>) => {
    endLoading()
    if (response.data.code == 403) {
        alert("没有饼干！！！")
    } else if (response.data.code == 429) {
        alert("访问太快啦！！！")
    }
    return response
}, error => {
    endLoading()
    return Promise.reject(error)
})
export default axios