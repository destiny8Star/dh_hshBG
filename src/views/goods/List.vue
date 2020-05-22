<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- <div class="third-nav" v-if="pay_channel_type==2">
                 <div class="third-nav-t">账单列表</div>
             </div>-->
            <!-- tab按钮 start -->
            <!--<div class="third-nav" v-else-if="pay_channel_type==1">-->
            <div class="third-nav">
                <el-menu :default-active="tabIndex" class="el-menu-demo" mode="horizontal" @select="tabSelect">
                    <el-menu-item v-for="(ele,i) in tabList" :key="i" :index="ele.value">{{ele.label}}({{ele.num}})</el-menu-item>
                </el-menu>
            </div>
            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <!-- 搜索条件 start -->
                        <el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline">
                            <el-form-item label="商品名称" prop="goods_spu_name">
                                <el-input v-model="postData.goods_spu_name" placeholder="请输入商品名称" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="商品货号" prop="goods_spu_id">
                                <el-input v-model="postData.goods_spu_id" placeholder="请输入商品货号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="销量" prop="sales_num_first">
                                <el-col :span="8">
                                    <el-input v-model="postData.sales_num_first" clearable type="number"></el-input>
                                </el-col>
                                <!--<el-col class="line">-</el-col>-->
                                <!--<el-col :span="8">-->
                                    <!--<el-input v-model="postData.sales_num_second" clearable></el-input>-->
                                <!--</el-col>-->
                            </el-form-item>
                            <el-form-item>
                                <el-col class="line">-</el-col>
                            </el-form-item>
                            <el-form-item prop="sales_num_second">
                                <el-col :span="8">
                                    <el-input v-model="postData.sales_num_second" clearable type="number"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="商品类型" prop="goods_type">
                                <el-select v-model="postData.goods_type" placeholder="商品类型" clearable>
                                    <el-option v-for="item in typeList"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="resetForm('postData')" size="small" v-loading="searchState">重置</el-button>
                            </el-form-item>
                        </el-form>
                        <!-- 搜索条件 end -->

                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column prop="id" label="商品货号">
                                </el-table-column>
                                <el-table-column prop="goods_type" label="商品类型">
                                    <template slot-scope="scope">
                                        <p>{{mapType[scope.row.goods_type]}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="商品名称" width="260" show-overflow-tooltip>
                                    <el-col slot-scope="scope" class="ly-flex-start">
                                        <img class="smallImg" :src="scope.row.goods_url" alt="">
                                        <p class="goodsName">{{scope.row.name}}</p>
                                    </el-col>
                                </el-table-column>
                                <el-table-column prop="goods_price" label="价格">
                                </el-table-column>
                                <el-table-column prop="goods_sold_num" label="销量">
                                </el-table-column>
                                <el-table-column prop="spu_stock" label="库存">
                                </el-table-column>
                                <el-table-column prop="create_time_str" label="创建时间">
                                </el-table-column>
                                <el-table-column prop="goods_status" label="商品状态">
                                    <template slot-scope="scope">
                                        <p>{{mapStatus[scope.row.goods_status]}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width='150'>
                                    <template slot-scope="scope">
                                        <a class="table-func" @click="editClick(scope.row)">
                                            编辑
                                        </a>
                                        <el-row>
                                            <el-switch
                                                    v-model="scope.row.goods_status"
                                                    @change="upDown(scope.row)"
                                                    :active-value = "upStatus"
                                                    :inactive-value = "offStatus"
                                                    active-text="上架"
                                                    inactive-text="下架">
                                            </el-switch>
                                        </el-row>
                                        <!--<el-button type="text" @click="refresh(scope.row)">刷新</el-button>-->
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
    </div>
</template>

<script>
    // import second_nav from '../../components/second-nav.vue'
    import CommonFooter from '../../components/CommonFooter.vue'
    const mapType = {1:'实物商品',2:'虚拟商品'};//商品类型
    const mapStatus = {1:'上架中',2:'仓库中'};//商品状态
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
                rules: {},
                pay_channel_type: '',//通道【1：直连；2：间连】
                mapType: {1:'实物商品',2:'虚拟商品'},//商品类型
                mapStatus: {1: '上架',0:'仓库中'},//商品状态
                upStatus: 1,
                offStatus: 0,
                unlink: true,
                searchState: false,
                date: new Date(),
                //页面所需
                "pagination": {
                    "total": 0,
                    "pageCount": [10,20,50,100],
                    "currentPage": 1,
                    "pageSize": 10,
                    "show": '1-5'
                },
                //接口参数
                "postData": {
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                    "goods_spu_name": '',
                    "goods_spu_id": '',
                    "goods_type": '',
                    "sales_num_first": '',
                    "sales_num_second": '',
                    "goods_status": '',//【''-全部商品，1-上架中, 0-仓库中】
                },
                tabIndex: '',//tab选中值
                tabList: [
                    {
                        value: '',
                        label: '全部商品',
                        num: 0
                    },
                    {
                        value: '1',
                        label: '上架中',
                        num: 0
                    },
                    {
                        value: '0',
                        label: '仓库中',
                        num: 0
                    }
                ],
                typeList: [
                    {
                        value: '1',
                        label: '实物商品'
                    },
                    {
                        value: '2',
                        label: '虚拟商品'
                    }
                ],
                tableData: [
                    {url: require('../../assets/img/bb.png'),goods_spu_name: 'v库福幺姑爷Uyghur醐UyghurUyghur基因特工呀'}
                ],
            }
        },
        methods: {
            /**
             * 初始化搜索表单
             */
            resetForm(formName){
                console.log('重置搜索表单');
                this.$refs[formName].resetFields();
                console.log(this.postData);
            },
            /**
             * tab选择
             * @param key
             * @param keyPath
             */
            tabSelect(key, keyPath) {
                console.log(this.postData);
                this.tabIndex = key;
                this.postData.goods_status = key;
                console.log(key, keyPath,this.tabIndex);
                this.pagination.currentPage = this.postData.cursor = 1;
                this.postData.size = 10;
                this.resetForm('postData');
                this.getData();
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
            /**
             * 获取列表数据
             */
            getData() {
                let api = 'shop/admin/mall/goods/shopMallGoodsSpuList';
                console.log(this.postData,api);
                //初始化列表
                this.$axios.post(api, this.postData).then(res => {
                    console.log('获取列表数据',res);
                    this.tableData = res.data.data.data;
                    this.pagination.total = Number(res.data.data.count);
                    this.pagination.currentPage = res.data.data.cursor;
                    this.searchState = false;
                })
                    .catch(() => {
                        this.searchState = false;
                    });
            },
            /**
             * 获取列表不同类型顶部数据
             */
            getTopData() {
                //初始化列表
                this.$axios.get('shop/admin/mall/goods/topGoodsCount').then(res => {
                    console.log('获取列表不同类型顶部数据',res);
                    let list = res.data.data;
                    this.tabList[0].num = list.total_count;
                    this.tabList[1].num = list.on_count;
                    this.tabList[2].num = list.off_count
                })
                    .catch((rej) => {
                        this.searchState = false;
                        this.$message({type: 'info', message: rej.data.message});
                    });
            },
            /**
             * 查询
             */
            onSubmit() {
                console.log('submit!');
                this.searchState = true;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            open() {
                this.$confirm('确定删除此商品吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            /**
             * 编辑
             */
            editClick(data){
                console.log(data);
                if(data.goods_type==1){
                    this.$router.push({path:'/goods/update',query:{goodsId:data.id,goodsSource:data.is_my_goods}});
                }else if(data.goods_type==2){
                    this.$router.push({path:'/goods/virtualEdit',query:{goodsId:data.id,goodsSource:data.is_my_goods}});
                }
            },
            /**
             * 上下架
             */
            upDown(data){
                console.log('上下架',data);
                let text = '';
                if(data.goods_status){
                    text = '上架'
                }else {
                    text = '下架'
                }
                this.$axios.get('shop/admin/mall/goods/shopMallGoodsSpuOnlineOrOffline?goods_spu_id='+ data.id+'&goods_status='+ data.goods_status).then(res => {
                    console.log('上下架商品',res);
                        this.$message({type: 'info', message: text + '成功'});
                        this.getData();
                        this.getTopData();
                })
                    .catch((rej) => {
                        console.log('错误',rej);
                        this.$message(rej.data.message);
                    });
            },
        },
        beforeMount() {
            // 获取列表数据
            this.getData();
            // 获取列表数据-顶部数据
            this.getTopData();
        },
    }
</script>


<style scoped>
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
</style>
