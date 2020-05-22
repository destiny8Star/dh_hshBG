<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
             <div class="third-nav">
                <div class="third-nav-t" style="padding-right:50px">
                    订单详情
                    <el-button type="primary" size="mini" style="float: right;margin-top: 10px"
                        @click="$router.go(-1)">返回
                    </el-button>
                </div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" :style="{minHeight: (getWinHeight-20)+'px'}">
                        <div class="infoBox">
                            <div class="home-title">
                                <span class="home-title-t">订单信息</span>
                            </div>
                            <div class="realBoxs">
                                <div v-for="(ele,i) in orderData" :key="i">
                                    <p v-if="ele.value" class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
                                </div>
                            </div>
                            <div class="home-title">
                                <span class="home-title-t">收货信息</span>
                            </div>
                            <div class="realBoxs">
                                <div v-for="(ele,i) in takeData" :key="i">
                                    <p v-if="ele.value" class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
                                </div>
                            </div>
                            <div class="home-title">
                                <span class="home-title-t">费用信息</span>
                            </div>
                            <div class="realBoxs">
                                <div v-for="(ele,i) in feeData" :key="i">
                                    <p class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
                                </div>
                            </div>

                            <div class="home-title">
                                <span class="home-title-t">商品信息</span>
                            </div>
                            <!-- 表格 start -->
                            <template >
                                <el-table  ref="multipleTable" :data="goodsData" style="width: 100%;min-width: 780px;margin-top: 20px;background: #f7f8fa;">
                                    <el-table-column prop="goods_spu_id" label="商品货号">
                                    </el-table-column>
                                    <el-table-column prop="goods_spu_name" label="商品名称">
                                    </el-table-column>
                                    <el-table-column prop="pic_path" label="商品图片">
                                        <template slot-scope="scope">
                                            <div class="good_img" ><img :src="scope.row.pic_path" alt=""></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="goods_sku" label="商品规格">
                                    </el-table-column>
                                    <el-table-column prop="goods_sku_price" label="商品单价（元）">
                                    </el-table-column>
                                    <el-table-column prop="goods_sku_count" label="商品数量">
                                    </el-table-column>
                                    <el-table-column prop="goods_cost_price" label="单品成本价（元）">
                                    </el-table-column>
                                    <el-table-column prop="total_goods_cost_price" label="成本总价（元）">
                                    </el-table-column>
                                    <el-table-column prop="goods_sku_real_price" label="实际支付金额（元）">
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!-- 表格 end -->
                            <div class="home-title" v-if="is_virtual_order==0">
                                <span class="home-title-t">物流信息</span>
                            </div>
                             <!-- 表格 start -->
                            <template v-if="is_virtual_order==0">
                                <el-table  ref="multipleTable" :data="transData" style="width: 100%;min-width: 780px;margin-top: 20px;background: #f7f8fa;">
                                    <el-table-column prop="sys_logistics_name" label="快递公司">
                                    </el-table-column>
                                    <el-table-column prop="logistics_no" label="快递单号">
                                    </el-table-column>
                                    <el-table-column  label="商品信息">
                                        <template slot-scope="scope">
                                            <div style="margin:10px 0 ;" v-for="(item,ind) in scope.row.package_goods_resps">
                                                {{item.goods_spu_name}} [{{item.goods_sku?item.goods_sku:'默认'}}] x{{item.goods_sku_count}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="date_sent_time" label="发货时间">
                                    </el-table-column>
                                    <el-table-column prop="express_state" label="物流状态">
                                         <template slot-scope="scope">
                                            <div >
                                                {{scope.row.express_state==0?"待发货":scope.row.express_state==1?"已发货":"已签收"}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!-- 表格 end -->
                        </div>

                    </div>

                </div>
                <common-footer></common-footer>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonFooter from '../../components/CommonFooter.vue'
    export default {
        name: "listDetail",
        components: {
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data: function () {
            return {
                order_info_no: '',//订单号
                loading: false,
                is_virtual_order:0,//是否为虚拟订单 0否 1是
                orderData: [
                    {
                        table: '订单编号',
                        value: ''
                    },
                    {
                        table: '订单来源',
                        value: ''
                    },
                    {
                        table: '订单状态',
                        value: ''
                    },
                    {
                        table: '下单时间',
                        value: ''
                    },
                    {
                        table: '付款时间',
                        value: ''
                    },
                    {
                        table: '用户id',
                        value: ''
                    },
                    {
                        table: '付款方式',
                        value: ''
                    },
                ],
                takeData: [
                    {
                        table: '收件人',
                        value: ''
                    },
                    {
                        table: '联系方式',
                        value: ''
                    },
                    {
                        table: '收货地址',
                        value: ''
                    }
                 
                ],
                feeData: [
                    {
                        table: '运费（元）',
                        value: ''
                    },
                    {
                        table: '优惠券抵扣（元）',
                        value: ''
                    },
                    {
                        table: '应付金额（元）',
                        value: ''
                    },
                    {
                        table: '实际支付金额（元）',
                        value: ''
                    }
                ],
                goodsData:[],
                transData:[],// 0:待发货; 1:已发货 2:已签收
            }
        },
        methods: {
            /**
             * 获取数据
             */
            getData() {
                //初始化列表
                this.loading = true
                this.$axios.get('/shop/admin/mall/goods/order/detail?order_info_no=' + this.order_info_no)
                .then(res => {
                    console.log(res);
                        this.loading = false
                        let list = res.data.data;
                        this.is_virtual_order = list.is_virtual_order
                        //订单信息
                        this.orderData[0].value = list.order_info_no;
                        this.orderData[1].value = list.str_order_source;
                        this.orderData[2].value = list.str_order_status;
                        this.orderData[3].value = list.date_order_time;
                        this.orderData[4].value = list.date_pay_time;
                        this.orderData[5].value = list.user_id;
                        this.orderData[6].value = list.str_pay_type;
                        //收货信息
                        this.takeData[0].value = list.consignee;
                        this.takeData[1].value = list.consignee_tel;
                        this.takeData[2].value = list.consignee_address;
                        //费用信息
                        this.feeData[0].value = list.send_price;
                        this.feeData[1].value = list.discount_price;
                        this.feeData[2].value = list.price;
                        this.feeData[3].value = list.real_price;
                        //商品信息
                        this.goodsData= list.goods_list
                        //物流信息
                        this.transData = list.order_logistics_resps
                })
                .catch((rej) => {
                    this.loading = false
                    this.$message(rej.data.message);
                });
            },
       
        },
        created() {
            this.order_info_no = this.$route.query.order_info_no
            console.log('id', this.order_info_no)
            // 获取数据
            this.getData();
        },
    }
</script>

<style scoped>
    .home-title {
        margin: 20px 0 10px;
        font-weight: 800;
        background: #f7f8fa;
    }

    .main-inner {
        padding: 13px 40px;
    }

    .realBoxs {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .realBox {
        width: 30%;
        min-width: 460px;
        max-width: 460px;
        font-size: 16px;
        line-height: 32px;
        margin: 2px 20px 2px 0;
    }

    .realBox span {
        margin-left: 10px;
    }
    .good_img{
        width:100px;
        height: 100px;
        border-radius: 5px;
    }
    .good_img img{
         width:100px;
        height: 100px;
        border-radius: 5px;
    }
</style>

