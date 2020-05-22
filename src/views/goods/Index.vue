<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">发布商品</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <div class="home-title">
                            <span class="home-title-t ly-title">商品类型</span>
                        </div>
                        <div class="home-figure show-data">
                            <el-row :gutter="10" style="margin: 20px 0">
                                <el-col :sm="4" v-for="(ele,i) in activityList" :key="i">
                                    <div class="grid-content">
                                        <h1>{{ele.title}}</h1>
                                        <p>{{ele.desc}}</p>
                                        <img :src="ele.icon" alt="">
                                        <el-button type="primary" size="mini" @click="jumpPage(ele)">立即发布</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="home-title">
                            <span class="home-title-t ly-title">提示</span>
                        </div>
                        <ol class="ly-introduce-text" style="margin-left: 15px">
                            <li v-for="(ele,i) in featureList" :key="i" style="padding-left: 10px">
                                <p>{{ele.desc}}</p>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data() {
            return {
                activityList: [
                    {
                        title: '实物',desc: '需要快递物流发货',icon: require('../../assets/img/goods/stGoods.png'),link:'/goods/edit',type: 1
                    },
                    {
                        title: '虚拟',desc: '无需快递物流',icon: require('../../assets/img/goods/xnGoods.png'),link:'/goods/virtualEdit',type: 2
                    }
                ],
                featureList: [
                    {desc: "实物商品需要物流发货，请选择正确的商品类目；"},
                    {desc: "虚拟商品不需要快递发货，用户付款后订单无需手动发货。"}
                ]
            }
        },
        methods: {
            /**
             *  跳转页面
             */
            jumpPage (data){
                this.$router.push({path:data.link});
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .ly-title {
        /*font-size: 16px;*/
        font-weight: 900;
    }
    .grid-content {
        height: auto;
        text-align: center;
        color: #8590a9;
        padding: 30px 0;
    }
    .grid-content h1,.grid-content p {
        margin: 0;
    }
    .grid-content h1 {
        font-size: 16px;
        color: #333;
    }
    .grid-content img {
        width: 110px;
        height: 110px;
        display: block;
        margin: 10px auto;
    }
</style>
