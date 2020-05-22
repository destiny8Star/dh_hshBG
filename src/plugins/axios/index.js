import axios from 'axios'

export default {
    install: (Vue, options) => {
        axios.defaults.baseURL = Vue.webConfig.apiHost;
        /*请求过滤*/
        axios.interceptors.request.use(
            config => {
                if (config.url != Vue.webConfig.qnUploadHost) {
                    config.withCredentials = true;
                    let authName = Vue.webConfig.authTokenName;
                    let authPrefix = Vue.webConfig.authTokenPrefix;
                    config.headers[authName] = `${authPrefix}${Vue.ls.get(authName)}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        /*响应过滤*/
        axios.interceptors.response.use(
            response => {
                if (response.headers[Vue.webConfig.authRefreshTokenName]) {
                    Vue.ls.set(Vue.webConfig.authTokenName, response.headers[Vue.webConfig.authRefreshTokenName]);
                }
                switch (response.data.code) {
                    case Vue.webConfig.httpSuccessStatus:
                        return response;
                    case Vue.webConfig.loginExpire:
                        let authName = Vue.webConfig.authTokenName;
                        Vue.ls.remove(authName);
                        Vue.ls.clear();//清除所有
                        options.router.push({path: "/"});
                        break;
                    case Vue.webConfig.permissionDenied:
                        options.element.Message({
                            showClose: true,
                            message: "没有权限执行该操作",
                            type: "error"
                        });
                        break;
                    default:
                        // console.log(response.data);
                        break;
                }
                return Promise.reject(response)
            },
            error => {
                console.log(error);
                return Promise.reject(error);
            }
        );

        // 添加全局方法
        Vue.axios = axios;
        // 添加实例方法
        Vue.prototype.$axios = axios;
    }
}
