<template>
    <div class="first-nav" id="first-nav" v-bind:style="{height: (getWinHeight-60)+'px' }">
        <div class="first-nav-main">
            <el-row class="tac">
                <el-col>
                    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
                             @close="handleClose" :unique-opened="false" :router="uniqueOpened" :default-openeds="defaultOpeneds">
                        <template v-for="navItem in navData">
                           <template v-if="navItem.id == $store.state.Tid">
                                      <!-- <el-menu-item :index="navItem.url" v-if="!navItem.children">
                                        <template slot="title">
                                            <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg">
                                            <span>{{navItem.name}}</span>
                                        </template>
                                    </el-menu-item> -->
                                    <!-- <el-submenu :index="navItem.depth+'-'+navItem.id"> -->
                                        <!-- <template slot="title">
                                            <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg">
                                            <span>{{navItem.name}}</span>
                                        </template> -->
                                        <template v-for="childItem in navItem.children" >
                                            <el-menu-item :index="childItem.url" v-if="!childItem.children" :class="$route.path==childItem.url?'is-active':''">
                                                {{childItem.name}}
                                            </el-menu-item>
                                            <el-submenu :index="childItem.depth+'-'+childItem.id" v-else>
                                                <template slot="title">{{childItem.name}}</template>
                                                <el-menu-item :index="childChildItem.url" :class="$route.path==childChildItem.url?'is-active':''"
                                                            v-for="childChildItem in childItem.children">
                                                    {{childChildItem.name}}
                                                </el-menu-item>
                                            </el-submenu>
                                        </template>
                                    <!-- </el-submenu> -->
                            <!-- <el-menu-item :index="navItem.url" v-if="!navItem.children">
                                <template slot="title">
                                    <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg">
                                    <span>{{navItem.name}}</span>
                                </template>
                            </el-menu-item>
                            <el-submenu :index="navItem.depth+'-'+navItem.id" v-else>
                                <template slot="title">
                                    <img :src="require(`../assets/img/nav/${navItem.ico_url}`)" class="title-icon-svg">
                                    <span>{{navItem.name}}</span>
                                </template>
                                <template v-for="childItem in navItem.children">
                                    <el-menu-item :index="childItem.url" v-if="!childItem.children">{{childItem.name}}
                                    </el-menu-item>
                                    <el-submenu :index="childItem.depth+'-'+childItem.id" v-else>
                                        <template slot="title">{{childItem.name}}</template>
                                        <el-menu-item :index="childChildItem.url"
                                                      v-for="childChildItem in childItem.children">
                                            {{childChildItem.name}}
                                        </el-menu-item>
                                    </el-submenu>
                                </template>
                            </el-submenu> -->
                        </template>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ico_sc from '../assets/img/sc.svg'
    import ico_mp from '../assets/img/mp.svg'
    import ico_wm from '../assets/img/wm.svg'

    export default {
        name: "CommonLefter",
        data: function () {
            return {
                uniqueOpened: true,
                icos: {ico_sc: ico_sc, ico_mp: ico_mp, ico_wm: ico_wm},
                Tid:2,
                navData: [
                    {
                        id: 1, name: '首页', url: '/home', depth: 1, ico_url: 'home@2x.png',
                        children: [
                            {id: 21, name: '首页', url: '/home', depth: 2, ico_url: ''}
                        ]
                    },
                    {
                        id: 2, name: '商品管理', url: '', depth: 1, ico_url: 'agen@2x.png',
                        children: [
                            {id: 21, name: '商品列表', url: '/goods/list', depth: 2, ico_url: ''},
                            {id: 20, name: '发布商品', url: '/goods/index', depth: 2, ico_url: ''},
                            {id: 24, name: '货源中心', url: '/agent/distributor', depth: 2, ico_url: ''},
                            {id: 25, name: '视频管理', url: '/goods/video/list', depth: 2, ico_url: ''},
                        ]
                    },
                     {
                        id: 3, name: '订单管理', url: '/order', depth: 1, ico_url: 'admn@2x.png',
                        children: [
                            {id:30, name: '订单列表', url: '/order/list', depth: 2, ico_url: ''},
                        ]
                    },
                    {
                        id: 4, name: '运营管理', url: '/operating', depth: 1, ico_url: 'admn@2x.png',
                        children: [
                            {id: 40, name: '运费模板', url: '/operating/freight', depth: 2, ico_url: ''},
                        ]
                    },
                ],
                // navData: [],
                navDataOn:[],//顶部选中的nav二级菜单数组
                navDataExtend:[],
                defaultOpeneds: [],
            }
        },
        //计算属性，可缓存值，没有变化不会重新计算结果
        computed: {
            getWinHeight() {
                return this.$winHeight;
            },
        },
    
       
        mounted: function () {
            // this.loadMenu();
            // console.log("store",this.$store.state.Tid)
           
            // if (this.navData) {
            //     if(this.$webConfig.leftMenuShow==1){
            //         this.navData.push({id: 8, name: '交易数据', url: '/transaction', depth: 1, ico_url: 'tran@2x.png',});
            //     }
            //     this.navData=[...this.navData,...this.navDataExtend];
            //     this.navData.forEach(item => {
            //         if (item.children) {
            //             this.defaultOpeneds.push(item.depth + '-' + item.id);
            //             item.children.forEach(m=>{
            //                 this.defaultOpeneds.push(m.depth + '-' + m.id);
            //             })
            //         }
            //     })
            // }
        },
        methods: {
            loadMenu() {
                this.$axios.get("/agent/menu/getMenu").then(res => {
                    this.navData = res.data.data;
                })
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>
