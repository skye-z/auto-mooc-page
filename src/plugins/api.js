import request from './request'

function post(url, data) {
    return request({
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

function get(url) {
    return request({
        url: url,
        method: 'GET'
    })
}

export const user = {
    getQrCode:  () => {
        return '/api/login/code'
    },
    getLoginState:  () => get('/login'),
    getQrState:  () => get('/login/state'),
    getUser:  () => get('/user'),
}

export const study = {
    login: (name, pass) => {
        return post('/user/login', {
            name, pass: md5(pass)
        })
    },
    getSubjectList:  () => get('/subject'),
    selectSubject:  id => get('/subject/select?id='+id),
    getCourse:  id => get('/course?id='+id),
    getWorkState:  () => get('/work'),
    startWork:  () => get('/work/start'),
    stopWork:  () => get('/work/stop'),
    recoveryWork:  () => get('/work/recovery'),
    workScreen:  () => {
        return '/api/work/screen'
    },
}

export const setting = {
    getPush:  () => get('/push'),
    savePush: (enable,path) => {
        return post('/user/login', {enable,path})
    },
}