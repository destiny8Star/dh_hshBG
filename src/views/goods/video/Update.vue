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
                                    <span class="home-title-t ly-title">基础信息</span>
                                </div>
                                <el-form-item label="视频名称" prop="media_name">
                                    <el-input v-model="form.media_name" placeholder="请输入视频名称" maxlength="30"></el-input>
                                    <p class="ly_hint_text">注：不超过30个字</p>
                                </el-form-item>
                                <el-form-item label="视频描述" prop="media_description">
                                    <el-input v-model="form.media_description" type="textarea"
                                              :rows="3" placeholder="请输入视频描述" maxlength="100"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('form')" v-loading="submitState">保存</el-button>
                                    <el-button type="primary" @click="$router.go(-1)">取消</el-button>
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
            return {
                submitState: false,
                form: {
                    id: '',//商品id
                    media_name: '',//商品名称
                    media_description: '',//商品副标题
                },
                rules: {
                    media_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入内容',
                            trigger: 'blur'
                        }
                    ],
                    media_description: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入内容',
                            trigger: 'blur'
                        }
                    ],
                  
                },
            }
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            },
        },
        methods: {
           
            /**
             * 提交
             * @param formName
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       console.log("qqq",this.form)
                       this.submitState = true
                       this.$axios.post("shop/media/update",this.form)
                        .then(res => {
                            this.submitState = false
                            console.log('修改成功',res);
                            this.$message.success("修改成功")
                            this.$router.go(-1)
                        })
                        .catch(rej => {
                            console.log('失败',rej);
                            this.submitState = false
                            this.$message.info(rej.data.message)
                        });
                    } else {
                        return false;
                    }
                });
            },

        },
        mounted: function () {
           this.form.id = this.$route.query.id
           console.log("id",this.form.id) 
            this.$axios.get("shop/media/getById?id="+this.form.id)
            .then(res => {
                console.log('获取数据',res);
                this.form.media_name = res.data.data.media_name
                this.form.media_description = res.data.data.media_description
            })
            .catch(rej => {
                console.log('获取数据失败',rej);
                this.$message.info(rej.data.message)
            });
           
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
