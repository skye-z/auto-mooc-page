import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
    timeout: 60000
})

request.interceptors.response.use(
    response => {
        if (response.config.responseType === 'blob') {
          return response;
        }
        return response.data
    }, () => {
        window.$message.error('网络异常')
        throw "网络异常";
    }
)

export default request
