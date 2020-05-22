<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                 <div class="third-nav-t">视频管理</div>
             </div>
            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <!-- 搜索条件 start -->
                        <!--<el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline">-->
                            <!--<el-form-item>-->
                                <!--<el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">批量删除当前页</el-button>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item>-->
                                <!-- <el-button type="text" @click="$router.push('/goods/video/add')" size="small">上传视频  GO <i class="el-icon-d-arrow-right"></i></el-button> -->
                            <!--</el-form-item>-->
                        <!--</el-form>-->
                        <!-- 搜索条件 end -->
                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column prop="id" label="视频封面">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.media_cover" alt="" style="width: 80px">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="media_name" label="视频名称">
                                </el-table-column>
                                <el-table-column prop="str_create_time" label="上传时间">
                                </el-table-column>
                                <el-table-column label="操作" width='150'>
                                    <template slot-scope="scope">
                                        <el-button size="mini" type="text" @click="editClick(scope.row)">
                                            编辑
                                        </el-button>
                                        <el-button size="mini" style="color: red" type="text" @click="delClick(scope.row)">
                                            删除
                                        </el-button>
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
    import CommonFooter from '../../../components/CommonFooter.vue'
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
                  
                },
                tableData: [
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
                let api = 'shop/media/list';
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
             * 查询
             */
            onSubmit() {
                console.log('submit!');
                this.searchState = true;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //删除
            delClick(data){
                this.$confirm('确定删除此视频吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    return this.$axios.post("shop/media/delByIds",[data.id])
                })
                .then(res=>{
                   console.log("res",res)
                    this.postData.cursor = 1
                    this.getData();
                   this.$message.success("删除成功");
                })
                .catch((rej) => {
                    this.$message({
                        type: 'info',
                        message: rej.data&&rej.data.message||'已取消删除'
                    });
                });
            },
            /**
             * 编辑
             */
            editClick(data){
                console.log(data);
                this.$router.push({path:'/goods/video/update',query:{id:data.id}});
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
</style>
