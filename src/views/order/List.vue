<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">订单列表</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" v-loading="searchState">
                        <!-- 搜索条件 start -->
                        <el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline">
                            <el-form-item label="订单编号">
                                <el-input v-model="postData.order_info_no" placeholder="请输入订单号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="商品货号">
                                <el-input v-model="postData.goods_spu_id" placeholder="请输入商户货号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="下单时间">
                                <!--:default-time="['12:00:00']"-->
                                <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="订单状态">
                                <el-select v-model="postData.order_status" placeholder="全部" clearable>
                                    <el-option v-for="item in orderState"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商品名称">
                                <el-input v-model="postData.goods_spu_name" placeholder="请输入订单号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="订单类型">
                                <el-select v-model="postData.order_type" placeholder="全部" clearable>
                                    <el-option v-for="item in orderType"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="维权状态">
                                <el-select v-model="postData.after_sales_service" placeholder="全部" clearable>
                                    <el-option v-for="item in activist"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item label="拼团订单">
                                <el-select v-model="postData.status" placeholder="全部" clearable>
                                    <el-option v-for="item in assemble"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item> -->
                            <el-form-item label="虚拟订单">
                                <el-select v-model="postData.is_virtual" placeholder="全部" clearable>
                                    <el-option v-for="item in virtual"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary"  size="small"  @click="searchHandle">筛选</el-button>
                            </el-form-item>
                        </el-form>
                        <!-- 搜索条件 end -->
                        <!-- 订单状态 -->
                        <el-tabs  type="card" v-model="selStateTab" @tab-click="handleSelTab">
                            <el-tab-pane label="全部" name="0"></el-tab-pane>
                            <el-tab-pane :label="item.label" :name="item.value" v-for="item in orderState" :key="item.value"></el-tab-pane>
                        </el-tabs>
                        <!-- 表格 start -->
                        <template>
                            <el-table  :data="tableData" style="width: 100%;min-width: 780px;" >
                                <el-table-column prop="infos" label="商品信息" min-width="200px">
                                     <template slot-scope="scope">
                                         <div class="order_infos">
                                           <img :src="scope.row.pic_path" alt="">
                                           <div class="order_name" style="color:#409EFF">{{scope.row.goods_spu_name}}</div>
                                         </div>
                                        {{scope.row.goods_sku}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="order_info_no" label="订单编号">
                                </el-table-column>
                                <el-table-column prop="order_time_date" label="下单时间">
                                </el-table-column>
                                <el-table-column prop="goods_sku_price" label="单价(元)">
                                </el-table-column>
                                <el-table-column prop="goods_sku_count" label="数量">
                                </el-table-column>
                                <el-table-column prop="str_after_sale" label="售后">
                                </el-table-column>
                                <el-table-column prop="goods_sku_real_price" label="实收金额(元)">
                                </el-table-column>
                                <el-table-column prop="str_order_source" label="订单来源">
                                </el-table-column>

                                <el-table-column prop="phone" label="买家">
                                </el-table-column>
                                <el-table-column prop="str_order_type" label="订单类型">
                                </el-table-column>
                                <el-table-column prop="str_order_status" label="订单状态">
                                </el-table-column>
                              
                                <el-table-column label="操作" min-width='50'>
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="toDetail(scope.row)">查看详情</el-button>
                                        <el-button type="text" @click="sendGood(scope.row)" v-if="scope.row.order_status==2">发货</el-button>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </template>
                        <!-- 表格 end -->

                        <template>
                            <div class="block" style="text-align: center;margin-top: 30px;">
                                <el-pagination @size-change="handleSizeChange"
                                               @current-change="jumpPagination"
                                               @prev-click="prevClick"
                                               @next-click="nextClick"
                                               :current-page="pagination.currentPage"
                                               :page-sizes="pagination.pageCount"
                                               :page-size="pagination.pageSize"
                                               layout="total, sizes, prev, pager, next, jumper"
                                               :total="pagination.total">
                                </el-pagination>
                            </div>
                        </template>

                    </div>
                </div>
                <common-footer></common-footer>
            </div>
        </div>
        <!-- //发货 -->
        <el-dialog title="发货" :visible.sync="dialogFormVisible" center width="40%">
            <el-form :model="form" :rules="rules" ref="freForm">
                <el-form-item label="快递公司" label-width="80px" prop="sys_logistics_id">
                    <el-select v-model="form.sys_logistics_id" filterable placeholder="请选择快递公司名称">
                        <el-option
                        v-for="item in comOptions"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号" label-width="80px" prop="logistics_no">
                    <el-input v-model="form.logistics_no" autocomplete="off" placeholder="请输入快递单号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="tosend">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CommonFooter from '../../components/CommonFooter.vue'
    export default {
        name: "list",
        components: {
            // second_nav,
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data: function () {
            return {
                selStateTab:"0",//tab选择订单状态
                searchState: false,//loading圈圈
                date: new Date(),
                //页面所需
                "pagination": {
                    "total": 0,
                    "pageCount": [10,20,50,100],
                    "currentPage": 1,
                    "pageSize": 10,
                },
                //接口参数
                "postData": {
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                    "date":"",//选择时间
                    "order_info_no":'',//订单编号
                    "start_order_time": '',//下单开始时间
                    "end_order_time": '',//下单结束时间
                    "goods_spu_id": '',//商品货号
                    "goods_spu_name": '',//商品名称
                    "is_virtual": '',//是否为虚拟订单（0否1是）
                    "order_status": '',//订单状态:订单状态1：待付款2：待发货3：待收货,4已完成 ,5:已关闭 6:已取消 7:已退款(系统出库失败 自动退款)9:退款中
                    "after_sales_service":'',//维权状态1售后中2售后结束（未实现，先预留）
                    "order_type":'',//订单类型1自营2分销（未实现，先预留）
                },
                orderState: [
                    {
                        value: '1',
                        label: '待付款'
                    },
                    {
                        value: '2',
                        label: '待发货'
                    },
                     {
                        value: '3',
                        label: '待收货'
                    },
                    {
                        value: '4',
                        label: '已完成'
                    },
                     {
                        value: '5',
                        label: '已关闭'
                    },
                    {
                        value: '6',
                        label: '已取消'
                    },
                    {
                        value: '9',
                        label: '退款中'
                    },
                    {
                        value: '7',
                        label: '已退款'
                    }
                   
                   
                ],//订单状态
                orderType:[
                    {
                      value:"1",
                      label:"自营订单",
                    },
                    {
                      value:"2",
                      label:"分销订单",
                    }
                ],//订单类型
                activist:[
                    {
                      value:"1",
                      label:"售后中",
                    },
                    {
                      value:"2",
                      label:"售后结束",
                    }
                ],//维权状态
                assemble:[
                    {
                      value:"1",
                      label:"是",
                    },
                    {
                      value:"2",
                      label:"否",
                    }
                ],//拼团状态
                virtual:[
                    {
                        value:"0",
                        label:"否"
                    },
                     {
                        value:"1",
                        label:"是"
                    }
                ],//虚拟订单
                tableData: [],//列表数据
                form:{//发货弹框表单
                  sys_logistics_id:"",//物流公司id
                  logistics_no:"",//物流单号
                  order_info_ids:[],//主订单编号集合
                  order_product_ids:[],//子订单id集合
                },
                comOptions:[
                    {
                        id: '选项1',
                        value: '黄金糕'
                    }, 
                ],//快递公司
                dialogFormVisible:false,//是否展示发货弹框
                rules:{//验证规则
                    sys_logistics_id: [
                        {
                            required: true,
                            message: '请选择快递公司',
                            trigger: 'change'
                        }
                    ],
                    logistics_no: [
                        {
                            required: true,
                            message: '请输入快递单号',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        methods: {
            //点击确定发货
            tosend(){
                console.log("this.form",this.form)
                 this.$refs['freForm'].validate((valid) => {
                    if (valid) {
                        this.searchState = true;
                        this.$axios.post('/shop/admin/mall/goods/order/shipped', this.form)
                        .then(res => {
                            console.log("re",res)
                            this.searchState = false;
                            this.dialogFormVisible = false
                            this.$message.success("发货成功")
                            this.form.logistics_no = ""//清除快递单号
                            this.getData()//重新获取数据
                        })
                        .catch((rej) => {
                            console.log("失败",rej)
                            this.searchState = false;
                            this.$message(rej.data.message);
                        });
                    }})
            },
            //点击发货按钮
            sendGood(row){
              console.log("row",row)
              this.form.order_product_ids = []//先清空
              this.form.order_info_ids = []//先清空
            //   this.form.logistics_no = ""
              this.form.order_product_ids = [row.order_product_id]
              this.form.order_info_ids = [row.order_info_id]
              this.$axios.post('/shop/admin/mall/goods/order/logistics')
                .then(res => {
                    console.log("ressss",res)
                    this.comOptions = res.data.data
                    this.dialogFormVisible = true
                   
                })
                .catch((rej) => {
                    console.log("失败",rej)
                    this.$message(rej.data.message);
                });
              
            },
            //查看详情
            toDetail(row){
               let order_info_no  = row.order_info_no 
               this.$router.push("/order/list/detail?order_info_no="+order_info_no)
            },
            //选中tab
            handleSelTab(tab){
                console.log(tab,tab.name,tab.label,this.selStateTab);
                this.postData.order_status = this.selStateTab==0?'':this.selStateTab
                this.pagination.currentPage = 1;
                this.postData.cursor = 1;
                this.getData()
            },
            //点击筛选
            searchHandle(){
               console.log("筛选",this.postData)
               //让tab为选择下拉框的内容
                this.selStateTab  = this.postData.order_status?this.postData.order_status:"0"
                console.log("selStateTab",this.selStateTab)
                this.pagination.currentPage = 1;
                this.postData.cursor = 1;
                this.getData()
            },
              /**
             * 获取列表数据
             */
            getData() {
                //初始化列表
                this.searchState = true;
                this.$axios.post('/shop/admin/mall/goods/order/list', this.postData)
                .then(res => {
                    console.log("re",res)
                    this.searchState = false;
                    this.tableData = res.data.data.data;
                    this.pagination.total = Number(res.data.data.count);
                    this.pagination.currentPage = res.data.data.cursor;
                })
                .catch((rej) => {
                    console.log("失败",rej)
                    this.searchState = false;
                    this.$message(rej.data.message);
                });
            },
            /**
             *  选择时间
             */
            changeDate(val) {
                console.log(val, this.postData.date);
                if(val){
                    let start = new Date(val[0]),end = new Date(val[1]);
                    console.log(start,end);
                    this.postData.start_order_time = start.valueOf();
                    this.postData.end_order_time = end.valueOf();
                }else {
                    this.postData.start_order_time = this.postData.end_order_time = '';
                }
                console.log(this.postData)
            },
            
            /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.pagination.currentPage = this.postData.cursor = val;
                // this.postData.cursor = val;
                this.getData();
            },
            /**
             * 上一页
             */
            prevClick() {
                this.pagination.currentPage --;
                this.postData.cursor --;
                this.getData();
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage ++;
                this.postData.cursor ++;
                this.getData();
            },
            /**
             * 每页条数
             * @param val
             */
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagination.size = this.postData.size = val;
                this.getData();
            },
    
        },
        beforeMount() {
            // 获取列表数据
            this.getData();
        },
    }
</script>


<style scoped>
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
    .order_infos{
        display: flex;
        flex-wrap: wrap;
    }
    .order_name{
        flex:1;
    }
    .order_infos img{
       width: 80px;
       height: 80px;
       margin: 5px
    }
    >>>.el-dialog .el-input__inner{
        width: 70%;
    }
    >>>.el-select .el-input__inner{
        width:100%
    }
    >>>.el-dialog .el-select{
        width: 70%;
    }
</style>
