<template>
    <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">运费模板</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <el-button @click="$router.push('/operating/freight/add')" type='primary'>添加模板</el-button>
                    </div>   
                    <!-- 表格 start -->
                    <template >
                        <el-table v-loading="loading" ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;margin-top: 20px"
                             >
                            <el-table-column prop="name" label="模板名称">
                            </el-table-column>
                            <el-table-column label="计算方式">
                                <template slot-scope="scope">
                                  {{scope.row.type==1?"按件数":"按重量"}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="update_time" label="最后编辑时间">
                            </el-table-column>
                            <el-table-column label="操作" min-width='115'>
                                <template slot-scope="scope">
                                    <el-button type="text" @click="addClick(scope.row)">
                                        复制
                                    </el-button>
                                    <el-button type="text" @click="updateClick(scope.row)">
                                        编辑
                                    </el-button>
                                    <el-button type="text" @click="delClick(scope.row)" style="color:#F56C6C">
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
     </div>   
  
</template>
<script>
export default {
    name:"freight",
    computed: {
        getWinHeight: function () {
            return this.$winHeight;
        }
    },
    data(){
        return {
            loading:false,
            //页面所需
            "pagination": {
                "total": 0,
                "pageCount": [10, 20, 50, 100],
                "currentPage": 1,
                "pageSize": 10,
                "show": '1-5'
            },
            //接口参数
            "postData": {
                "cursor": 1,//当前第几页-游标
                "size": 10,//每页条数
            },
            tableData: [],
        }
    },
    methods:{
         /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.postData.cursor = val;
                this.getData();
            },
            /**
             * 上一页
             */
            prevClick() {
                this.pagination.currentPage--;
                this.postData.cursor--;
                this.getData();
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage++;
                this.postData.cursor++;
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
            //复制
            addClick(row){
             console.log("row",row)
                this.loading = true;
                this.$axios.post('/shop/admin/freightExpense/copy',{
                    id:row.id
                })
                .then(res => {
                    console.log("re",res)
                    this.loading = false;
                    this.$message.success("复制成功");
                    this.pagination.currentPage = 1;
                    this.postData.cursor = 1;
                    this.getData()
                 
                })
                .catch((rej) => {
                    console.log("失败",rej)
                    this.loading = false;
                    this.$message(rej.data.message);
                });
            },
            //删除
            delClick(row){
                 this.$confirm('确定删除该运费模板吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.loading = true;
                        this.$axios.post('/shop/admin/freightExpense/del',{
                            id:row.id
                        })
                        .then(res => {
                            console.log("re",res)
                            this.loading = false;
                            this.$message.success("删除成功");
                            this.pagination.currentPage = 1;
                            this.postData.cursor = 1;
                            this.getData()
                        })
                        .catch((rej) => {
                            console.log("失败",rej)
                            this.loading = false;
                            this.$message(rej.data.message);
                        });
                    })
               
            },
            //编辑
            updateClick(row){
               this.$router.push("/operating/freight/add?id="+row.id)
            },
            /**
             * 获取列表数据
             */
            getData() {
                //初始化列表
                this.loading = true;
                this.$axios.post('/shop/admin/freightExpense/list', this.postData)
                .then(res => {
                    console.log("re",res)
                    this.loading = false;
                    this.tableData = res.data.data.data;
                    this.pagination.total = Number(res.data.data.count);
                    this.pagination.currentPage = res.data.data.cursor;
                })
                .catch((rej) => {
                    console.log("失败",rej)
                    this.loading = false;
                    this.$message(rej.data.message);
                });
            },
        
    },
    beforeMount() {
        // 获取列表数据
        this.getData();
    },
}
</script>
 <style >
   .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
</style>