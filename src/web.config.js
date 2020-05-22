const webConfig = Object.freeze({

    /*图片服务器*/
    apiResourceHost: process.env.VUE_APP_API_RESOURCE_HOST,
    apiResourceUpload: "/upload",
    apiResourceG: "/g",
    apiHost: process.env.VUE_APP_API_HOST,
    apiHosts: process.env.VUE_APP_API_HOSTS,
    qnUploadHost: process.env.VUE_APP_QN_UPLOAD_HOST,
    leftMenuShow:process.env.VUE_APP_LEFT_MENU_SHOW, //是否显示交易流水


    authTokenName: "shop-auth",
    authTokenPrefix: "",
    httpSuccessStatus: "200",
    loginExpire: "200302",
    permissionDenied: "30002",
    oemData:"_oemData",
    authRefreshTokenName:"refresh-auth"

});
export default webConfig;