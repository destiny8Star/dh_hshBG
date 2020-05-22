<template>
    <div class="main-top">
        <div class="first-nav-logo">
            <!--<img :src="oemData.pc_back_logo ? oemData.pc_back_logo : logoUrl" class="nav-logo">-->
            <!-- <img v-if="oemData.pc_back_logo" :src="oemData.pc_back_logo" class="nav-logo"> -->
            <img :src="logoUrl" class="nav-logo"/>
        </div>
        <!-- <div class="search" id="search">
                <div class="search-content" style="line-height: 60px">
                    欢迎进入总后台管理系统
                </div>
        </div>-->
        <!-- //菜单栏 -->
        <el-menu
                mode="horizontal"
                @select="handleSelect"
                class="el-menu-vertical-demo"
                :router="true" :default-active="activeName"
        >
            <template v-for="navItem in navData">
                <el-menu-item :index="navItem.url">
                    <template slot="title">
                        <!-- <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg"> -->
                        <span>{{navItem.name}}</span>
                    </template>
                </el-menu-item>
            </template>
        </el-menu>

        <!-- tab -->
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
            <template v-for="navItem in navData">
                <el-tab-pane :label="navItem.name" :name="navItem.id"></el-tab-pane>
            </template>
        </el-tabs> -->

        <!-- <div class="line"></div> -->

        <div class="tool">
            <!--<div class="tool-icon">
                      <i class="el-icon-setting"></i>
                  </div>
                  <div class="tool-icon">
                      <i class="el-icon-bell"></i>
                      &lt;!&ndash; <el-badge :value="5" class="item">
                          <i class="el-icon-bell"></i>
                      </el-badge> &ndash;&gt;
                  </div>
                  <div class="tool-icon">
                      <i class="el-icon-message"></i>
            </div>-->
            <div class="tool-msg">
                <!--<img src="../assets/img/tx.png" class="logo-img">-->
                <span class="tool-msg-t">欢迎您：{{ name ? name : '代理商' }}</span>
                <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
            <i style="display: inline-block;width: 10px;height: 10px;"></i>
          </span>
                    <el-dropdown-menu slot="dropdown">
                        <!--						<el-dropdown-item command="a">账户信息</el-dropdown-item>-->
                        <el-dropdown-item command="b">修改密码</el-dropdown-item>
                        <!--<el-dropdown-item command="b">退出登录</el-dropdown-item>-->
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-link @click="outLog" :underline="false" style="margin: 0 20px 0 0;">退出</el-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CommonHeader",
        data() {
            return {
                activeIndex: "1",
                activeIndex2: "1",
                activeId: sessionStorage.getItem("Tid"),//选中上面的tab id
                activeName: "",//选中上面的name
                name: this.$ls.get("__user_name"),
                oemData: this.$ls.get(this.$webConfig.oemData) || {},
                logoUrl: require("../assets/img/home/logo.png"),
                // logoUrl: require('../assets/img/home/default_logo.png'),
                navData: [
                    {
                        id: 1, name: '首页', url: '/home', depth: 1, ico_url: 'agen@2x.png',
                    },
                    {
                        id: 2, name: '商品管理', url: '/goods', depth: 1, ico_url: 'agen@2x.png'
                    },
                    {
                        id: 3, name: '订单管理', url: '/order', depth: 1, ico_url: 'admn@2x.png',
                        children: [
                            {id: 30, name: '订单列表', url: '/order/list', depth: 2, ico_url: ''},
                        ]
                    },
                    {
                        id: 4, name: '运营管理', url: '/operating', depth: 1, ico_url: 'admn@2x.png',
                        children: [
                            {id: 40, name: '运费模板', url: '/operating/freight', depth: 2, ico_url: '',},
                        ]
                    }
                   
                ],
            };
        },
        mounted() {
            //刷新--选中顶部tab
            let Tid = sessionStorage.getItem("Tid") || 1
            this.navData.forEach(item => {
                if (item.id == Tid) {
                    this.activeName = item.url
                }
            });
        },
        methods: {
            handleCommand(command) {
                console.log("click on item " + command);
                if (command == "a") {
                    this.$router.push("/account/info");
                } else if (command == "b") {
                    this.$router.push("/account/change");
                }
            },
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
                this.activeName = key;
                this.navData.forEach(item => {
                    if (item.url == key) {
                        this.$store.state.Tid = item.id
                        sessionStorage.setItem("Tid", item.id)//防止刷新问题
                    }
                });
                // console.log("store reset",this.$store.state.Tid)
            },
            //选中头部tab
            // handleClick(tab){
            //      console.log("tab",tab.index)
            //      let id = this.navData[tab.index].id
            //     this.$store.state.Tid = id
            //     sessionStorage.setItem("Tid",id)//防止刷新问题

            // },
            /**
             *  退出登录
             */
            outLog() {
                console.log("退出登录");
                var that = this,
                    text = "退出账号";
                console.log("退出登录");
                that.$confirm("此操作将退出账号 , 是否继续 ?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        localStorage.clear();
                        this.$ls.remove(this.$webConfig.authTokenName);
                        this.$message("退出成功");
                        this.$router.push("/");
                    })
                    .catch(() => {
                        that.$message({
                            center: true,
                            type: "info",
                            message: "已取消".concat(text).concat("操作")
                        });
                    });
            }
        }
    };
</script>
<style scoped>
    .main-top {
        display: flex;
    }

    .el-menu.el-menu--horizontal {
        border-bottom: 0;
    }

    .el-menu-vertical-demo {
        flex: 1;
    }

    /* .el-tabs{
      flex:1;
    }
   >>>.el-tabs__header{
      margin: 0;
      padding-left: 20px;
      line-height: 100%;
      font-size: 36px
    }
    >>>.el-tabs__nav-wrap::after{
     height: 0;
    }

    >>>.el-tabs__nav-scroll,>>>.el-tabs__header,>>>.el-tabs__nav-wrap,>>>.el-tabs__nav{
      height: 100%
    } */
    .main-top {
        background: #ededed;
        border-bottom: 1px solid transparent;
    }
    .first-nav-logo {
        border-bottom: 1px solid #e5e5e5;
    }
    .el-menu.el-menu--horizontal{
        background: #ededed;
    }
    .el-menu--horizontal>.el-menu-item {
        min-width: 120px;
        text-align: center;
        height: 59px;
        line-height: 59px;
        border-bottom: 0;
    }
    .el-menu--horizontal>.el-menu-item.is-active {
        background: #fff;
        color: #4F91FF;
        font-weight: bold;
        font-size: 18px;
        border-bottom: 0;
    }
</style>

