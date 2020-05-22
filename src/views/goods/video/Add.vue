<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">上传视频</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <div class="form-list">
                            <el-form label-position="left" ref="form" :model="form" label-width="120px" :rules="rules">
                                <div class="home-title">
                                    <span class="home-title-t ly-title">类型选择</span>
                                </div>
                                <el-form-item label="商品类型" prop="goods_type">
                                    <el-radio v-model="form.goods_type" label="1">实物商品</el-radio>
                                    <el-radio v-model="form.goods_type" label="0" disabled>虚拟商品</el-radio>
                                </el-form-item>
                                <div class="home-title">
                                    <span class="home-title-t ly-title">基础信息</span>
                                </div>
                                <el-form-item label="商品类目" prop="sys_category_back_ids">
                                    <el-cascader
                                            v-model="form.sys_category_back_ids"
                                            :options="classifyList"
                                            :props="{ expandTrigger: 'hover' ,value: 'id',label: 'sys_category_name',children: 'sys_category_back_resps'}"
                                            @change="handleChange"></el-cascader>
                                </el-form-item>
                                <!--<el-form-item label="商品货号" prop="goods_no">-->
                                    <!--<el-input v-model="form.goods_no" disabled></el-input>-->
                                    <!--<p class="ly_hint_text">注：商品货号自动生成，不予修改</p>-->
                                <!--</el-form-item>-->
                                <el-form-item label="视频名称" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入视频名称"></el-input>
                                    <p class="ly_hint_text">注：不超过30个字</p>
                                </el-form-item>
                                <el-form-item label="视频描述" prop="name">
                                    <el-input v-model="form.goods_url" type="textarea"
                                              :rows="3" placeholder="请输入视频描述"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item label="视频封面" prop="goods_url">
                                    <el-upload
                                            class="avatar-uploader"
                                            :action="$webConfig.qnUploadHost"
                                            :data="qnMain"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="form.goods_url" :src="form.goods_url" class="avatar" @click="getToken()">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="getToken()"></i>
                                    </el-upload>
                                    <p class="ly_hint_text">注：尺寸为800*800像素</p>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('form')" v-loading="submitState">提交并保存，下一步</el-button>
                                    <el-button type="primary" @click="$router.push('/goods/list')">取消</el-button>
                                    <!--<el-button @click="resetForm('form')">重置</el-button>-->
                                    <!--<el-button>取消</el-button>-->
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <common-footer></common-footer>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonFooter from "../../../components/CommonFooter";
    let reg = /^[+]{0,1}(\d+)$/; //包含0，正整数
    let reg2 = /^[1-9]+\d*$/; //不含0，正整数
    let reg1 = /^\d+(\.\d{1,2})?$/; //两位小数，金额

    export default {
        name: "Edit",
        components: {
            CommonFooter,
        },
        data: function () {
            var checkNull = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            var checkIdNull = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            // 判断金额
            var checkPriceNull = (rule, value, callback) => {
                if (!reg1.test(value)) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            // 判断库存
            var checkStockNull = (rule, value, callback) => {
                if (!reg.test(value)) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            // 判断轮播图数组
            var checkArrNull = (rule, value, callback) => {
                if (value.length) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
            return {
                submitState: false,
                map: {0:'一',1:'二',2:'三',3:'四',4:'五',5:'六'},
                // dialogBannerUrl: '',
                // dialogVisible: false,
                //商品主图所需七牛云token
                qnMain: {
                    token: "",
                    key: ""
                },
                form: {
                    id: '',//商品id
                    goods_type: '1',//商品类型
                    is_spell: '0',//是否拼团
                    sys_category_back_ids: ["195", "184", "123"],//商品类目
                    sys_category_back_id: "123",//商品类目-三级id
                    goods_no: '123456',//商品货号
                    goods_imgs: [],//商品轮播图
                    goods_banner: [],//商品轮播图 - 数据调试所需
                    goods_url: '',//商品主图
                    name: '商品名称',//商品名称
                    goods_title: '副标题',//商品副标题
                    goods_price: '',//售价
                    goods_marking_price: '',//划线价
                    freight_expense_id: '',//运费模板
                    freight_expense_type: 2,//运费模板类型-隐藏数据
                    is_sku: '0',//1-有默认规格，0-无默认规格
                    sku_list: [
                        {
                            attrText: '',
                            skuName: '',
                            skuId: 1,
                            attrList: [
                                // {attr_name: '黄色',attr_id:1},
                                // {attr_name: '蓝色',attr_id:2},
                                // {attr_name: '红色',attr_id:3}
                            ],
                            sku_rules: {
                                skuName: [
                                    {
                                        validator: checkNull,
                                        required: true,
                                        message: '请输入规格名称',
                                        trigger: 'blur'
                                    },
                                    {
                                        min: 1,
                                        max: 5,
                                        message: '长度在 1 到 5 个字符',
                                        trigger: 'blur'
                                    }
                                ],
                                attrText: [
                                    {
                                        // validator: checkAttrNull,
                                        required: false,
                                        // message: '请输入规格属性',
                                        trigger: 'blur'
                                    },
                                    {
                                        min: 1,
                                        max: 5,
                                        message: '长度在 1 到 5 个字符',
                                        trigger: 'blur'
                                    }
                                ]
                            }
                        }
                    ],
                    goods_status: '0',//上架时间
                    goods_sku_req: [],//组合列表
                    
                    skuInfoList: [],//价格库存
                    skuInfo: [
                        {
                            "skuName1": '',
                            "skuName2": '',
                            "skuName3": '',
                            "goods_cost_price": '',
                            "goods_price": '',
                            "goods_stock": 0,
                            "goods_sku_url": '',
                            "rebates": '',
                            "goods_spec_req": [],
                            "qn": {
                                "token": '',
                                "key": ''
                            }
                        }
                    ],//价格库存
                },
                rules: {
                    tableRules: {
                        goods_cost_price: [
                            {
                                validator: checkPriceNull,
                                required: true,
                                message: '请输入正确的成本价',
                                trigger: 'blur'
                            }
                        ],
                        rebates: [
                            {
                                validator: checkPriceNull,
                                required: true,
                                message: '请输入正确的返点',
                                trigger: 'blur'
                            }
                        ],
                        goods_price: [
                            {
                                validator: checkPriceNull,
                                required: true,
                                message: '请输入正确的价格',
                                trigger: 'blur'
                            }
                        ],
                        goods_stock: [
                            {
                                validator: checkStockNull,
                                required: true,
                                message: '请输入正整数',
                                trigger: 'blur'
                            }
                        ],
                        goods_sku_url: [
                            {
                                validator: checkIdNull,
                                required: true,
                                message: '请上传缩略图',
                                trigger: 'change'
                            }
                        ],
                    },
                    goods_status: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择上架时间',
                            trigger: 'change'
                        }
                    ],
                    goods_type: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择商品类型',
                            trigger: 'change'
                        }
                    ],
                    is_spell: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择是否拼团',
                            trigger: 'change'
                        }
                    ],
                    sys_category_back_ids: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择商品类目',
                            trigger: 'change'
                        }
                    ],
                    freight_expense_id: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择运费模板',
                            trigger: 'change'
                        }
                    ],
                    goods_price: [
                        {
                            validator: checkPriceNull,
                            required: true,
                            message: '请输入正确的售价（包含两位小数）',
                            trigger: 'blur'
                        }
                    ],
                    goods_marking_price: [
                        {
                            validator: checkPriceNull,
                            required: true,
                            message: '请输入正确的划线价（包含两位小数）',
                            trigger: 'blur'
                        }
                    ],
                    goods_no: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '商品货号无效，请刷新页面，重新发布商品',
                            trigger: 'change'
                        }
                    ],
                    goods_url: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请上传商品主图',
                            trigger: 'blur'
                        }
                    ],
                    goods_banner: [
                        {
                            validator: checkArrNull,
                            required: true,
                            message: '请上传商品轮播图',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '不超过30个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 30,
                            message: '长度在 1 到 30 个字符',
                            trigger: 'blur'
                        }
                    ],
                    goods_title: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '不超过30个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 30,
                            message: '长度在 1 到 30 个字符',
                            trigger: 'blur'
                        }
                    ],
                    sku_list: [
                        {
                            // validator: checkNull,
                            required: true,
                            message: '请完善规格目录',
                            trigger: 'blur'
                        }
                    ]
                },
                classifyList: [],//商品分类
                list: [],
                shopList: [],
                freight_template_list: [
                    {
                        id: 1,
                        value: '默认模板'
                    },
                    {
                        id: 2,
                        value: '默认模板2'
                    }
                ],

                skuOne: false,//商品id -- 添加至第三步需用id获取规格设置列表
                skuTwo: false,//商品id -- 添加至第三步需用id获取规格设置列表
                skuThree: false,//商品id -- 添加至第三步需用id获取规格设置列表
                "spanArr": [],
                "pos": "",
                "spanArr1": [],
                "pos1": "",
                skuInfoList: [],//价格库存
                skuInfo: [
                    {
                        "skuName1": '',
                        "skuName2": '',
                        "skuName3": '',
                        "goods_cost_price": '',
                        "goods_price": '',
                        "goods_stock": '',
                        "goods_sku_url": '',
                        "rebates": '',
                        "goods_spec_req": [],
                        "qn": {
                            "token": '',
                            "key": ''
                        }
                    }
                ],//价格库存
                sku1: [],
                sku2: [],
                sku3: [],
            }
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            },
            getTableName(){
                if(this.form.is_sku==1){
                    return 'skuInfo'
                }else {
                    return 'skuInfoList'
                }
            }
        },
        methods: {
            //改变是否设置规格
            updateIsSku(value){
                console.log(value);
                // if(this.form.is_sku==1){
            },
            //获取token
            getToken(id){
                console.log("aaa",id);
                this.$axios.get('shop/admin/mall/file/getUploadAuth')
                    .then(res=>{
                        console.log("获取token",res)
                        if(id!=undefined){
                            if(this.form.is_sku==1){
                                this.form.skuInfo[id].qn.token = res.data.data;
                            }else {
                                this.form.skuInfoList[id].qn.token = res.data.data;
                            }
                            console.log(this.form.skuInfo,this.form.skuInfoList)
                        }else {
                            this.qnMain.token = res.data.data;
                        }
                    })
                    .catch(rej=>{
                        console.log("失败",rej)
                    })
            },
            /**
             *  上传成功【主图】
             */
            handleAvatarSuccess(res, file) {
                // this.form.imgUrl = URL.createObjectURL(file.raw);
                let url = this.qnMain.key;
                this.form.goods_url = this.$webConfig.apiHosts + url;
            },
            /**
             *  上传前判断【主图】
             */
            beforeAvatarUpload(file) {
                this.qnMain.key = new Date().getTime()+file.name;  //上传到七牛的key
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                console.log("获取token成功",this.qn);
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            // 自定义banner上传
            bannerUpload(file){
                console.log('自定义上传');
                console.log(file);
                let __that = this;
                __that.$axios.get('shop/admin/mall/file/getUploadAuth')
                    .then(res=>{
                        console.log("获取token",res);
                        return res.data.data;
                    }).then(res=>{
                        console.log('上传至七牛云',res);
                        let keys = new Date().getTime()+file.file.name;
                        const config = {
                            headers: {"Content-Type": "multipart/form-data"}
                        };
                        let postData = new FormData();
                        postData.append('token',res);
                        postData.append('key',keys);
                        postData.append('file',file.file);

                        __that.$axios.post(file.action,postData,config)
                            .then((res)=>{
                                console.log("上传至七牛云结果",res);
                            })
                            .catch(rej=>{
                                console.log("rejjjj",rej);
                                // 拦截器处对返回结果中code非200时均由catch返回，此处是第三方服务器返回无法通过200判断
                                if(rej.data.key){
                                    let url = __that.$webConfig.apiHosts + keys;
                                    __that.form.goods_banner.push({url:url});
                                    console.log(__that.form.goods_banner)
                                }
                            })
                    })
                    .catch(rej=>{
                        console.log("失败",rej)
                    })
            },
            /**
             *  上传前判断【轮播图】
             */
            beforeBannerUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                console.log("获取token成功",this.qn);
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            /**
             * banner 当超上传限制时的提示
             */
            bannerExceed(files, fileList) {
                this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            /**
             * 商品轮播图删除
             * @param file
             * @param fileList
             */
            bannerRemove(file, fileList) {
                console.log(file, fileList);
                this.form.goods_banner.forEach(ele => {
                    console.log(ele);
                    if (ele.url === file.url) {
                        this.form.goods_banner.splice(this.form.goods_banner.indexOf(ele), 1);
                    }
                });
                console.log(this.form.goods_banner);
            },

            /**
             *  删除规格
             */
            delSku(data,index) {
                console.log(data,index,this.form.sku_list[index].attrList.length);
                const that = this, text = "删除";
                that.$confirm("此操作将删除该规格 , 是否继续 ?", "提示", {
                    "confirmButtonText": "确定",
                    "cancelButtonText": "取消",
                    "type": "warning",
                }).then(() => {
                    this.form.sku_list.splice(index,1);
                    this.form.sku_list.forEach((ele,i)=>{
                        ele.skuId = i+1
                    })
                }).catch(() => {
                    this.$message({center: true, type: "info", message: "已取消".concat(text).concat("操作")});
                });
            },
            /**
             *  添加规格
             */
            addSku() {
                let index = this.form.sku_list.length;
                if(this.form.sku_list[index-1].skuName.trim()==''||this.form.sku_list[index-1].attrList.length==0){
                    this.open("请先完善当前规格再添加");
                    return false;
                }
                if(index==3){
                    this.open("规格数量已达上限，如需添加请调整");
                    return false;
                }
                this.form.sku_list.push({
                    skuId: index+1,
                    skuName: '',
                    attrText: '',
                    attrList: [],
                    sku_rules: {
                        skuName: [
                            {
                                validator: (rule, value, callback) => {
                                    if (value.trim() === '') {
                                        callback(new Error(rule.message));
                                    } else {
                                        callback();
                                    }
                                },
                                required: true,
                                message: '请输入规格名称',
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 5,
                                message: '长度在 1 到 5 个字符',
                                trigger: 'blur'
                            }
                        ],
                        attrText: [
                            {
                                required: false,
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 5,
                                message: '长度在 1 到 5 个字符',
                                trigger: 'blur'
                            }
                        ]
                    }
                })
            },
            //选择商品分类
            handleChange(value) {
                console.log(value);
                this.form.sys_category_back_id = value[2]
            },
            /**
             * 添加相应规格属性
             */
            addAttr(data,index) {
                console.log(data,index);
                let flag = true;
                if(data.attrText.trim()==''){
                    this.$message('请输入规格属性，再添加');
                    return false;
                } else {
                    this.form.sku_list[index].attrList.forEach(ele=>{
                        if(ele.attr_name == data.attrText) {
                            flag = false;
                        }
                    })
                }
                if(!flag){
                    this.$message('已有该规格属性，请重新设置');
                    return false;
                }
                let len = this.form.sku_list[index].attrList.length;
                this.form.sku_list[index].attrList.push({attr_name: data.attrText,attr_id: len+1});
                data.attrText = '';
                this.getSkuList()
            },
            /**
             * 删除相应规格属性
             */
            delAttr(i,v) {
                console.log(i,v);
                this.form.sku_list[i].attrList.splice(v,1);
                this.form.sku_list[i].attrList.forEach((ele,i)=>{
                    ele.attr_id = i+1
                })
                this.getSkuList()
            },

            //笛卡尔累积
            descartes(array){
                if( array.length < 2 ) return array[0] || [];
                return [].reduce.call(array, function(col, set) {
                    var res = [];
                    col.forEach(function(c) {
                        set.forEach(function(s) {
                            var t = [].concat( Array.isArray(c) ? c : [c] );
                            t.push(s);
                            res.push(t);
                        })});
                    return res;
                });
            },
            /**
             *  生成sku组合列表
             */
            getSkuList(){
                console.log('生成sku组合列表');
                let len = this.form.sku_list.length;
                // if(this.form.sku_list[len-1].skuName.trim()==''||this.form.sku_list[len-1].attrList.length==0){
                //     this.open("请先完善当前规格再添加");
                //     return false;
                // }
                let attrLists = [];
                let __that = this;
                this.sku1 = []; this.sku2 = []; this.sku3 = [];
                this.skuOne = this.skuTwo = this.skuThree = false;

                this.form.sku_list.forEach((ele,i)=>{
                    ele.attrList.forEach((val,v)=>{
                        __that[`sku${i+1}`].push(val.attr_name);
                    });
                    attrLists.push(this[`sku${i+1}`])
                });
                console.log(this.sku1,this.sku2,this.sku3);
                console.log(attrLists);

                let newList = [];
                newList = this.descartes(attrLists);
                console.log(newList,typeof newList[0]);

                if(typeof newList[0] == "string"&&len==1){
                    console.log('当只有1条规格');
                    newList.forEach((ele,i)=>{
                        let e = [];
                        e.push(ele)
                        newList[i] = e;
                    });
                }
                console.log(newList);

                this.form.skuInfoList = [];
                for (let i = 0; i < newList.length; i++) {
                    console.log(newList[i],newList[i][0]);
                    this.form.skuInfoList.push({
                        "skuName1": newList[i][0]||'',
                        "skuName2": newList[i][1]||'',
                        "skuName3": newList[i][2]||'',
                        "goods_cost_price": '',
                        "goods_price": this.form.goods_price,
                        "goods_stock": 0,
                        "goods_sku_url": this.form.goods_url,
                        "rebates": '',
                        "goods_spec_req": [
                            {
                                "spec_name": '',
                                "spec_id": '1',
                                "spec_value": newList[i][0]||'',
                                "spec_value_id": '1'
                            },
                            {
                                "spec_name": '',
                                "spec_id": '2',
                                "spec_value": newList[i][1]||'',
                                "spec_value_id": '2'
                            },
                            {
                                "spec_name": '',
                                "spec_id": '3',
                                "spec_value": newList[i][2]||'',
                                "spec_value_id": '3'
                            }
                        ],
                        "qn": {"token": '',"key": ''},
                    });
                }

                console.log(this.form.skuInfoList);
                if(this.form.skuInfoList[0].skuName3){
                    this.skuOne = true;
                    this.skuTwo = true;
                    this.skuThree = true;
                    this.form.skuInfoList.forEach(ele=>{
                        ele.goods_spec_req[0].spec_name = this.form.sku_list[0].skuName;
                        ele.goods_spec_req[1].spec_name = this.form.sku_list[1].skuName;
                        ele.goods_spec_req[2].spec_name = this.form.sku_list[2].skuName
                    })
                }else if(this.form.skuInfoList[0].skuName2){
                    this.skuOne = true;
                    this.skuTwo = true;
                    this.skuThree = false;
                    this.form.skuInfoList.forEach(ele=>{
                        ele.goods_spec_req[0].spec_name = this.form.sku_list[0].skuName;
                        ele.goods_spec_req[1].spec_name = this.form.sku_list[1].skuName;
                        ele.goods_spec_req.splice(2,1)
                    })
                }else if(this.form.skuInfoList[0].skuName1){
                    this.skuOne = true;
                    this.skuTwo = false;
                    this.skuThree = false;
                    this.form.skuInfoList.forEach(ele=>{
                        ele.goods_spec_req[0].spec_name = this.form.sku_list[0].skuName;
                        ele.goods_spec_req.splice(1,2)
                    })
                }

                console.log(this.form.skuInfoList);

               /* /!**  另一种方法
                 * 思路: 以第一项为基础,循环合并之后的每一项再循环的值
                 * reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
                 * @param {*} acc 累计的值
                 * @param {*} cur 当前遍历项
                 * @param {*} index 当前遍历索引
                 *!/
                let result = attrLists.reduce((acc, cur, index) => {
                    console.log('acc',acc, cur, index)
                    // 从第二项开始合并值
                    if (index > 0) {
                        let saveArr = []
                        acc.forEach(item => {
                            console.log('item',item)
                            cur.forEach(subItem => {
                                console.log('subItem',subItem)
                                saveArr.push(`${item},${subItem}`)
                            })
                        })
                        acc = saveArr
                    }
                    return acc
                }, attrLists[0]); // 把数组的第一项传入作为初始值
                console.log(result);

                result.forEach((ele,i)=>{
                    let infoItem = {"goods_cost_price": '',"goods_price": '',"goods_stock": '',"goods_sku_url": '',"rebates": '',"goods_spec_req": []};
                    ele = ele.split(',');
                    infoItem.skuName1 = ele[0];
                    infoItem.skuName2 = ele[1];
                    infoItem.skuName3 = ele[2];
                    result[i] = infoItem
                });
                console.log(result);
                this.form.skuInfoList = result;*/

                this.getSpanArr(this.form.skuInfoList);

            },
            /**
             * skuTable -- 计算位置的方法
             */
            getSpanArr(data) {
                this.spanArr = [];
                this.pos = "";
                this.spanArr1 = [];
                this.pos1 = "";
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0;
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].skuName1 === data[i - 1].skuName1) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr1.push(1);
                        this.pos1 = 0;
                    } else {
                        //如果笛卡尔积一直递增下去的话 这是一个很蠢的方法 由于我的要求层数是已知的 这里偷懒了 不然应该用for循环
                        if (data[i].skuName2 === data[i - 1].skuName2) {
                            this.spanArr1[this.pos1] += 1;
                            this.spanArr1.push(0);
                        } else {
                            this.spanArr1.push(1);
                            this.pos1 = i;
                        }
                    }
                }

                console.log(this.spanArr);
            },
            /**
             * skuTable -- 合并行数
             */
            objectSpanMethod1({row, column, rowIndex, columnIndex}) {
                // columnIndex === 0 找到第一列，实现合并随机出现的行数
                if(this.form.is_sku==1){
                    return false
                }
                if (columnIndex === 0) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                    // columnIndex === 1 找到第二列，合并他的列数
                } else if (columnIndex === 1 && this.form.skuInfoList[0].skuName2 || columnIndex === 1 && this.form.skuInfoList[0].skuName3 ) {
                    const _row = this.spanArr1[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
            },
            /**
             * 提交
             * @param formName
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitState = true;
                        this.form.goods_imgs = [];
                        this.form.goods_banner.forEach((ele,i)=>{
                            this.form.goods_imgs[i]=ele.url;
                        });
                        this.form.goods_imgs = JSON.stringify(this.form.goods_imgs);
                        console.log('提交',this.form);
                        if(this.form.is_sku==1){
                            this.form.goods_sku_req = this.form.skuInfo
                        }else {
                            this.form.goods_sku_req = this.form.skuInfoList
                        }
                        this.$confirm('此操作将保存该商品, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$axios.post('shop/admin/mall/goods/shopMallGoodsSpuAdd', this.form).then(res => {
                                this.$message({type: 'success', message: '创建成功!'});
                                this.$router.push('/goods/list');
                                console.log("创建成功!",res);
                                this.submitState = false;
                            }).catch((rej) => {
                                this.submitState = false;
                                this.$message({
                                    type: 'info',
                                    message: '创建失败' + rej.data.message
                                });
                            });
                        }).catch(() => {
                            this.submitState = false;
                            this.$message({
                                type: 'info',
                                message: '已取消创建'
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            /**
             *  获取门店list
             */
            getShopList(){
                this.$axios.post('/mer/order/choose/store').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.shopList = res.data.data;
                        this.shopList.unshift({id: 0, value: "所有门店"})
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {

                    });
            },
            /**
             * 提示弹窗
             */
            open(message) {
                this.$alert(message, '提示', {
                    confirmButtonText: '确定',
                });
            },
            /**
             * 规格缩略图上传前
             * @param res
             * @param file
             */
            beforeUploadSmall(index){
                return (file) => {
                    console.log(index);
                    console.log(file);
                    const __that = this;
                    // __that.getToken(index);
                    if(__that.form.is_sku==1){
                        __that.form.skuInfo[index].qn.key = new Date().getTime()+file.name;  //上传到七牛的key
                    }else {
                        __that.form.skuInfoList[index].qn.key = new Date().getTime()+file.name;  //上传到七牛的key
                    }
                    console.log(__that.form.skuInfo,__that.form.skuInfoList)
                }
                // let __that = this;
                // const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                // const isLt2M = file.size / 1024 / 1024 < 2;
                // console.log("获取token成功");
                // if (!isJPG) {
                //     this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                // }
                // if (!isLt2M) {
                //     this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return isJPG && isLt2M;
                // return new Promise((resolve, reject) => {
                //     /** browser-image-compression 开始 **/
                //     // var imageFile = event.target.files[0];
                //     console.log('originalFile instanceof Blob', file instanceof Blob); // true
                //     console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
                //
                //     var options = {
                //         maxSizeMB: 1,
                //         maxWidthOrHeight: 1920,
                //         useWebWorker: true
                //     };
                //     imageCompression( file,options)
                //         .then(function (compressedFile) {
                //             console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                //             console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                //             let isJPG = false;
                //             if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
                //                 isJPG = file.type;
                //             }
                //             const isLt2M = compressedFile.size / 1024 / 1024 < 2;
                //             let width = 244;
                //             let height = 244;
                //             let _URL = window.URL || window.webkitURL;
                //             let image = new Image();
                //             image.onload = function () {
                //                 let valid = image.width <= width && image.height <= height;
                //                 let resultBlob = '';
                //                 // 调用方法获取blob格式，方法写在下边
                //                 resultBlob = __that.compressUpload(image);
                //                 valid ? resolve(resultBlob) : reject();
                //                 // resolve(resultBlob)
                //             }
                //             image.src = _URL.createObjectURL(compressedFile);
                //             if (!isJPG) {
                //                 this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
                //             }
                //             if (!isLt2M) {
                //                 this.$message.error('上传图片大小不能超过 2MB!');
                //             }
                //         })
                //         .catch(function (error) {
                //             console.log(error.message);
                //         });
                //     /** browser-image-compression 结束**/
                // }).then(
                //     () => {
                //         return file;
                //     },
                //     () => {
                //         this.$message.error('注：上传图片尺寸224*224最为合适');
                //         return Promise.reject();
                //     }
                // );
            },/**
             * 规格缩略图上传成功
             * @param res
             * @param file
             */
            smallImgWin(index){
                return (response, file, fileList, val) => {
                    console.log(index);
                    console.log(response, file, fileList, val);
                    if(response.key){
                        if(this.form.is_sku==1){
                            this.form.skuInfo[index].goods_sku_url = this.$webConfig.apiHosts + this.form.skuInfo[index].qn.key;
                        }else {
                            this.form.skuInfoList[index].goods_sku_url = this.$webConfig.apiHosts + this.form.skuInfoList[index].qn.key;
                        }
                    }
                    console.log(this.form.skuInfo,this.form.skuInfoList)
                }
            },

            /**
             * 规格缩略图上传失败
             * @param res
             * @param file
             */
            smallImgFail(err, file, fileList) {
                console.log(err, file, fileList);
                this.$message.warning(err.message);
            },
            /**
             *  获取商品分类list
             */
            getClassifyList(){
                this.$axios.get('shop/admin/mall/goods/category/back/list').then(res => {
                    console.log("获取商品分类",res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.classifyList = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {

                    });
            },
            /**
             *  获取运费模板list
             */
            getFreightTemplate(){
                this.$axios.post('shop/admin/freightExpense/listConciseAll').then(res => {
                    console.log("获取运费模板list",res);
                    this.freight_template_list = res.data.data;
                })
                    .catch((rej) => {
                        this.$message(rej.data.message);
                    });
            },
        },
        mounted: function () {
            //获取商品分类
            this.getClassifyList();
            //获取运费模板list
            this.getFreightTemplate();
        },
    }
</script>

<style scoped>
    .home-title {
        margin: 30px 0;
        font-weight: bold;
    }
    .home-title:first-child {
        margin: 0 0 30px;
        font-weight: bold;
    }
    .ly_hint_text_color {
        margin-top: 6px;
        color: red
    }
    .attr_item {
        display: inline-block;
        border: 1px solid #DCDFE6;
        margin: 6px;
        padding: 0 6px;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
    }
    .delBtn {
        color: #DCDFE6;
        margin-left: 2px;
        line-height: 30px;
        padding: 0;
    }
    .delBtn:hover {
        color: #a7abb3;
    }
    .form-list .tableCard {
        box-shadow: none;
        border: 0;
        width: 80vw;
        margin: -20px;
    }
</style>
