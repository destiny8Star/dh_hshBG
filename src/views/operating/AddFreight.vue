<template>
    <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">新增运费模板</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}" v-loading="submitState">
                <div class="main-feature">
                    <div class="main-inner">
                <el-form :model="freForm" status-icon  ref="freForm" label-width="100px"  size="mini" :rules="rules">
                    <el-form-item label="模板名称" prop="name" >
                    <el-input type="text" v-model="freForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="计费方式" prop="valuation_type">
                    <el-radio-group v-model="freForm.type" :disabled="freForm.id?true:false" @change="selType">
                        <el-radio :label="1">按件数</el-radio>
                        <el-radio :label="2">按重量</el-radio>
                    </el-radio-group>
                    </el-form-item>
                    <el-form-item label="配送区域" prop="checkPass">
                    <!-- 表格 start -->
                    <template>
                        <el-table  :data="freForm.valuationg_rule_items" style="width: 100%;min-width: 780px;margin-top: -13px">
                            <el-table-column prop="regions" label="可配送区域" min-width='200'>
                                <template slot-scope="scope">
                                    <span v-for="area in scope.row.regions" :key="area.id" class="area-title"> {{area.value}} </span>
                                </template>
                            </el-table-column>
                            <el-table-column  width='100'>
                                <template slot-scope="scope">
                                    <el-button type="text" @click="updateClick(scope.row,scope.$index)">修改 </el-button>
                                    <el-button type="text" @click="delClick(scope.row,scope.$index)"> 删除</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :label="freForm.type==1?'首件（个）':'首重（Kg）'">
                                <template slot-scope="scope">
                                     <el-input type="number" size="mini" v-model="scope.row.first" auto-complete="off" @blur="inputBlurN(scope,1)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column  label="运费（元）">
                                <template slot-scope="scope">
                                      <el-input type="number" size="mini" v-model="scope.row.first_price" auto-complete="off" @blur="inputBlurM(scope,1)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="freForm.type==1?'续件（个）':'续重（Kg）'">
                                <template slot-scope="scope">
                                     <el-input type="number" size="mini" v-model="scope.row.add" auto-complete="off" @blur="inputBlurN(scope,2)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="续费（元）">
                                <template slot-scope="scope">
                                     <el-input type="number" size="mini" v-model="scope.row.add_price" auto-complete="off" @blur="inputBlurM(scope,2)"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <el-button type="primary" size="small" class="addAreaBtn" @click="addArea">指定可配送区域和运费</el-button>
                    <!-- 表格 end -->
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('freForm')" >保存</el-button>
                        <el-button @click="$router.go(-1)">返回</el-button>
                    </el-form-item>
                </el-form>
                </div>
                <!--address dialog-->
                <el-dialog :visible.sync="dialogVisible" width="650px" 
                :close-on-press-escape="false" center :before-close="closeDialog">
                    <el-transfer v-model="value" :data="finalData" :props="propsName" 
                    :titles="['选择可配送区域','配送区域']" @change="choseHandler"></el-transfer>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitArea">保 存</el-button>
                    </span>
                </el-dialog>
                <!--address dialog-->
                </div>
            </div>
    </div>        
  
</template>
<script>
   
  export default {
    data() {
      return {
            submitState:false,//loading
            changeIndex:null,//要修改的哪一行
            row:[],//修改的内容地区
            handle:1,//1是添加，2是修改
            propsName:{
                key:'id',
                label:'value'
            },//穿梭框数据别名
            value:[],//当前选中的穿梭框数据
            dialogVisible: false, //显示弹出
            originData: [//初始地址数据
            ], 
            freForm: { // 数据
                valuationg_rule_items: [
                    // {"regions":[
                    //     {"id":"13","value":"河北省"},
                    //     {"id":"1301","value":"石家庄市"}
                    // ],
                    // "first":1,
                    // "first_price":0.00,
                    // "add":0,
                    // "add_price":0.00
                    // },
                   ], 
                name: '',
                type: 1,//1按件数，2按重量
                id:"",//有就是修改，没有就是添加
            },
            finalData:[//地址----也是选择后的地址数据
                    {"id":"1","value":"河北省"},
                   ],
            rules: {//验证规则
                    name: [
                        {
                            required: true,
                            message: '请输入模板名称',
                            trigger: 'blur'
                        }
                    ],
                },        
        }
    },
    computed: {
        getWinHeight: function () {
            return this.$winHeight;
        }
    },
    methods: {
      //选择地区
      choseHandler(value, direction, movedKeys){
        // console.log(value, direction, movedKeys);
      },
      //选择按件还是按重量
      selType(e){
        console.log("eee",e)
        let minNum = 0
        if(e==1){
          minNum = 1000
        }else{
          minNum = 0.001
        }
        this.freForm.valuationg_rule_items.forEach(item=>{
            console.log("item",item,minNum)
            let first = null;
            let add = null;
            item.first*minNum<0.1?first=0.1:first=item.first*minNum
            item.first=first
            item.add*minNum<0.1?add=0.1:add=item.add*minNum
            item.add=add
        })
      },
      //输入数量失去焦点
      inputBlurN(scope,p){
        //  let first = scope.row.first
        //  console.log("first",first)
        //  first = this.checkNum(2,first)
        //  this.freForm.valuationg_rule_items[scope.$index].first = first

         let type = this.freForm.type
         let num = 0 ; 
         type == 1 ? num = 0 : num = 2
         console.log("num",num)
         if(p == 1){
            let first = Number(scope.row.first).toFixed(num)
            console.log("first",first)
            this.freForm.valuationg_rule_items[scope.$index].first = first
         }else{
            let add = Number(scope.row.add).toFixed(num)
            console.log("first",add)
            this.freForm.valuationg_rule_items[scope.$index].add = add
         }
      },
      //输入价格失去焦点
      inputBlurM(scope,p){
         console.log('eeee',scope,p)
         if(p == 1){
            let first_price = Number(scope.row.first_price).toFixed(2)
            console.log("first",first_price)
            this.freForm.valuationg_rule_items[scope.$index].first_price = first_price
         }else{
            let add_price = Number(scope.row.add_price).toFixed(2)
            console.log("first",add_price)
            this.freForm.valuationg_rule_items[scope.$index].add_price = add_price 
         }
         
      },
      //submitForm提交
      submitForm(formName){
         this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.freForm.valuationg_rule_items.length==0) return this.$message.error("请添加配送区域")

                        console.log('submit!',this.freForm);
                        this.submitState = true;
                        this.$axios.post('/shop/admin/freightExpense/save',this.freForm)
                        .then(res => {
                            console.log(res);
                            this.submitState = false;
                            this.$message.success('操作成功');
                            this.$router.go(-1);
                        }).catch((rej)=>{
                            this.submitState = false;
                            this.$message(rej.data.message);
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
      },
      //删除
      delClick(row,index){
          this.$confirm('确定删除该配送区域吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.changeIndex = index
                    let regions = row.regions
                    regions.forEach(e => {
                        this.finalData.push(e)
                    });
                    this.freForm.valuationg_rule_items.splice(index,1)
                    this.$message.success("删除成功")
                })
      },
      //修改
      updateClick(row,index){
         console.log("修改",row,index,this.value)
         this.changeIndex = index
         this.handle = 2
         let regions = row.regions
         this.row = regions
         regions.forEach(e => {
            this.value.push(e.id)
            this.finalData.push(e)
           
         });
          this.dialogVisible = true
          console.log("this.value.finalData",this.value)
      },
      //点击关闭选择地址
      closeDialog(done){
           console.log("closse",this.changeIndex==null,this.row)
           //关闭时候，就是取消选择地址，有可能是修改，就将添加进去的清除掉
           if(this.changeIndex != null){
                for(let i = 0; i < this.row.length; i++){
                    for(let j = 0; j < this.finalData.length; j++){
                        if(this.finalData[j].id == this.row[i].id){
                            console.log("iii",j)
                            this.finalData.splice(j,1)
                            break;
                        } 
                    }
                }
           }
           this.value = []
           this.row = []
           this.changeIndex = null
           done()
      },
      // 点击添加地址
      addArea() {
        this.dialogVisible = true
        this.handle = 1
        this.value = []
      },
     // 点击保存
      submitArea() {
        console.log("thisvalue",this.value)
        if(this.value.length==0){
            return this.$message.error("请添加地址")
        }
        let arrs = [] 
        for(let i = 0; i < this.value.length; i++){
             for(let j = 0; j < this.finalData.length; j++){
                if(this.finalData[j].id == this.value[i]){
                    console.log("iii",j)
                    arrs.push(this.finalData[j])
                    this.finalData.splice(j,1)
                    break;          
                } 
            }
        }

        let item =  {regions:arrs,
                    "first":1,
                    "first_price":0.00,
                    "add":0,
                    "add_price":0.00
                    }
        if(this.handle==1){
            this.freForm.valuationg_rule_items.push(item)
        }else{
            this.freForm.valuationg_rule_items[this.changeIndex].regions = arrs 
        }            
      
        console.log("arrrs",arrs, this.freForm)
        this.value = []
        this.dialogVisible = false
      },
     
      },
      created(){
        this.freForm.id = this.$route.query.id||""
        console.log("idddddddddd",this.freForm.id,this.freForm.id==0)

          //获取省市区
           this.$axios.get('/shop/admin/public/city/province?areaParentId=1')
           .then(res => {
                console.log(res);
                this.finalData = res.data.data;
                if(this.freForm.id!=''){
                    return   this.$axios.post('/shop/admin/freightExpense/get',{id:this.freForm.id})
                }
                return false
            })
            .then(res=>{
                console.log("2222",res);
                if(res){
                    let data = res.data.data
                    this.freForm.valuationg_rule_items = data.valuationg_rule_items
                    this.freForm.name = data.name
                    this.freForm.type = data.type
                    // finalData---清除已经选择了的地址
                    let arr = []
                    data.valuationg_rule_items.forEach(item=>{
                        item.regions.forEach(inItem=>{
                            arr.push(inItem)
                        })
                    })
                    for(let i = 0; i < arr.length; i++){
                        for(let j = 0; j < this.finalData.length; j++){
                            if(this.finalData[j].id == arr[i].id){
                                this.finalData.splice(j,1)
                                break;
                            } 
                        }
                    }
                }
            })
           .catch((rej)=>{
               console.log("rej",rej)
                this.$message(rej.data.message);
            })
      }

    }
    </script>
 <style  scoped>
   .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
    .addAreaBtn{
        margin: 10px
    }
    >>>.el-checkbox{
        margin-top: 0px
    }
</style>