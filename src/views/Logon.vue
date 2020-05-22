<template>
    <!--sdfasdf-->
    <!--	adfasdf-->
    <div class="login1" :style="{height: (getWinHeight) + 'px'}">
        <div class="ly-login-content">
            <h1 class="ly-login-title">{{siteName}}总管理后台</h1>
            <div class="ly-login-content-inner">
                <div class="ly-login-main-content">
                    <div class="login-logo-img">
                        <img :src="siteLogo?siteLogo:logoUrl">
                    </div>
                    <div class="login-form">
                        <el-form ref="form" :model="form" :rules="rules">
                            <el-form-item prop="name">
                                <el-input v-model="form.name" placeholder="用户名" prefix-icon="el-icon-user">
                                    <!--<i slot="prefix" class="el-input__icon el-icon-user"></i>-->
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" v-model="form.password" @keyup.enter.native="onSubmit('form')" placeholder="密   码" prefix-icon="el-icon-lock"></el-input>
                            </el-form-item>
                            <el-form-item prop="rem">
                                <el-checkbox v-model="form.rem">记住密码,下次直接登录</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="onSubmit('form')" v-loading="submitState">登 录</el-button>
                                <!--<el-button @click="testHttp">Test</el-button>-->
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import test from "../util";
    //let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    let reg=/^\S{0,}$/;
    export default {
        name: "Logon",
        mounted: function () {
            // console.log(test.geta());
            // 获取cookie值
            this.getCookie();
            // this.getSiteInfo();
        },
        // mounted(){
        // 	let data=new Date()
        // 	let datas=new Date().format(data)
        // 	console.log("date",datas)
        // },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data() {
            var account = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('请输入账号'));
                }else if (!reg.test(value)) {
                    callback(new Error('请输入正确的账号'));
                }  else {
                    callback();
                }
            };
            var checkPass = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('请输入密码'));
                }  else {
                    callback();
                }
            };
            return {
                submitState: false,
                form: {
                    name: '',
                    password: '',
                    rem: false
                },
                rules: {
                    name: [
                        {
                            validator: account,
                            required: true,
                            // message: '请输入账号',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            validator: checkPass,
                            required: true,
                            // message: '请输入密码',
                            trigger: 'blur'
                        }
                    ]
                },
                siteName:'',
                siteLogo:'',
                logoUrl: require('../assets/img/home/default_logo.png'),
            }
        },
        methods: {
            /**
             * 提交
             * @param formName
             */
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitState = true;
                        const self = this;
                        //判断复选框是否被勾选 勾选则调用配置cookie方法
                        if (self.form.rem == true) {
                            console.log("checked == true");
                            //传入账号名，密码，和保存天数3个参数
                            self.setCookie(self.form.name, self.form.password,self.form.rem, 30);
                        }else {
                            console.log("清空Cookie");
                            //清空Cookie
                            self.clearCookie();
                        }
                        self.$ls.clear();//发起登陆，先把本地storage清除
                        this.$axios.post('/public/user/login',{pwd:this.form.password,username:this.form.name,login_type:1})
                        .then(res => {
                            console.log("登录成功",res)
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                localStorage.accountName = res.data.data.real_name;
                                this.$ls.set(this.$webConfig.authTokenName,res.data.data);
                                this.$ls.set("__user_name",this.form.name);
                                this.getUserInfo(res.data.data);
                                // this.getSiteInfo();
                            }else {
                                this.$message(res.data.message);
                            }
                            this.submitState = false;
                        }).catch((rej)=>{
                            this.submitState = false;
                            console.log("登录失败",rej)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /**
             * 获取用户信息
             * @param merAuth
             */
            getUserInfo(merAuth) {
                let headers={};
                headers[this.$webConfig.authTokenName] = `${this.$webConfig.authTokenPrefix}${merAuth}`
                this.$axios.get("/shop/user/name", {}, {headers}).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.$ls.set('accountName', res.data.data);
                        this.$router.push('/home');
                    } else {
                        this.$message(res.data.message);
                    }
                })
            },
            //设置cookie
            setCookie(c_name, c_pwd,c_status, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userPwdStatus" + "=" + c_status + ";path=/;expires=" + exdate.toGMTString();
                console.log(window.document.cookie);
            },
            //读取cookie
            getCookie: function() {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        console.log(arr,arr2);
                        if (arr2[0] == 'userName') {
                            this.form.name = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == 'userPwd') {
                            this.form.password = arr2[1];
                        } else if (arr2[0] == 'userPwdStatus') {
                            if(arr2[1] == 'true'){
                                this.form.rem = true;
                            }else {
                                this.form.rem = false;
                            }
                        }
                    }
                }
            },
            //清除cookie
            clearCookie: function() {
                this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
            },
            getSiteInfo() {
                let  host = window.location.origin;
                this.$axios.post("/public/oem/logo/copyright", {host:host})
                .then(res => {
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.siteName=res.data.data.name;
                        this.siteLogo = res.data.data.pc_back_logo;
                        this.$ls.set(this.$webConfig.oemData, res.data.data);
                        if(res.data.data.pc_back_icon) {
                            document.getElementById("__favicon").href = res.data.data.pc_back_icon;
                        }
                    } else {
                        this.$message(res.data.message);
                    }
                })
                .catch(rej=>{
                    console.log("失败",rej)
                    this.$message(rej.data.message);
                })
            },
        }
    }
</script>


