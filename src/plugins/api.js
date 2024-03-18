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
    if (url.indexOf('?') != -1) url += '&'
    else url+='?'
    return request({
        url: url + 't=' + new Date().getTime(),
        method: 'GET'
    })
}

export const user = {
    getQrCode: () => {
        return import.meta.env.VITE_APP_API+'/login/code?t=' + new Date().getTime()
    },
    getLoginState: () => get('/login?t=' + new Date().getTime()),
    getQrState: () => get('/login/state?t=' + new Date().getTime()),
    getUser: () => get('/user?t=' + new Date().getTime()),
}

export const study = {
    login: (name, pass) => {
        return post('/user/login', {
            name, pass: md5(pass)
        })
    },
    getSubjectList: () => get('/subject'),
    selectSubject: id => get('/subject/select?id=' + id),
    getCourse: id => get('/course?id=' + id),
    getWorkState: () => get('/work'),
    startWork: () => get('/work/start'),
    stopWork: () => get('/work/stop'),
    recoveryWork: () => get('/work/recovery'),
    workScreen: () => {
        return import.meta.env.VITE_APP_API+'/work/screen?t=' + new Date().getTime()
    },
}

export const setting = {
    getPush: () => get('/push'),
    savePush: (enable, path) => {
        return post('/push', { enable, path })
    },
}