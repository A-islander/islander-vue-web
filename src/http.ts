import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElLoading } from 'element-plus'
import store from './store'

let loading: any

const startLoading = () => {
    interface Options {
        lock: boolean;
        text: string;
    }
    const options: Options = {
        lock: true,
        text: "加载中",
    }
    loading = ElLoading.service(options)
}

const endLoading = () => {
    loading.close()
}

// axios.defaults.baseURL = 'http://127.0.0.1:12345/'
axios.defaults.baseURL = 'http://forum-api.islander.top/'
// axios.defaults.headers.common['Authorization'] = store.getters.getAuthToken

// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    startLoading()
    return config
})

// 响应拦截
axios.interceptors.response.use((response: AxiosResponse<any>) => {
    endLoading()
    // if (response.data.code !== 200) {
    //     alert(response.data.msg)
    // }
    return response
}, error => {
    endLoading()
    return Promise.reject(error)
})
export default axios