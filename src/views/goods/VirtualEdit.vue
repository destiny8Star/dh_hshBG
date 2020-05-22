<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">编辑基本信息</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <div class="form-list">
                            <el-form label-position="left" ref="form" :model="form" label-width="130px" :rules="rules">
                                <div class="home-title">
                                    <span class="home-title-t ly-title">类型</span>
                                </div>
                                <el-form-item label="商品类型" prop="goods_type">
                                    <!--<el-radio v-model="form.goods_type" label="1">实物商品</el-radio>-->
                                    <el-radio v-model="form.goods_type" label="0">虚拟商品</el-radio>
                                </el-form-item>
                                <!--<el-form-item label="拼团商品" prop="is_spell">-->
                                    <!--<el-radio v-model="form.is_spell" label="0">否</el-radio>-->
                                    <!--<el-radio v-model="form.is_spell" label="1" disabled>是</el-radio>-->
                                <!--</el-form-item>-->

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
                                <el-form-item label="课程名称" prop="course_name">
                                    <el-input v-model="form.course_name" placeholder="请输入课程名称"></el-input>
                                    <p class="ly_hint_text">注：不超过20个字</p>
                                </el-form-item>
                                <el-form-item label="课程导读" prop="goods_title">
                                    <el-input v-model="form.goods_title" type="textarea"
                                              :rows="3" placeholder="请输入课程导读"></el-input>
                                    <p class="ly_hint_text">注：不超过150个字</p>
                                </el-form-item>
                                <el-form-item label="课程亮点" prop="course_highlights">
                                    <p class="ly_hint_text ly_hint_text_color"><el-button type="primary" size="mini" @click="addLight()" :disabled="form.course_highlights.length==8">添加</el-button>（ 最多添加8个亮点 ）</p>
                                </el-form-item>
                                <el-card style="margin-bottom: 32px;" v-if="form.course_highlights.length>0">
                                    <el-card class="box-card" style="margin-bottom: 32px;box-shadow: none;" v-for="(ele,i) in form.course_highlights" :key="i">
                                        <div slot="header" class="clearfix ly-flex-center-between">
                                            <el-form-item :label="`亮点${map[i]}标题`" style="margin-bottom: 0" :prop="`course_highlights.${i}.course_highlight_title`" :rules="rules.lightspotRule.course_highlight_title">
                                                <el-input v-model="ele.course_highlight_title" maxlength="12" placeholder="请输入亮点标题"></el-input>
                                            </el-form-item>
                                            <el-button size="mini" type="danger" @click="delLight(ele,i)">删除</el-button>
                                        </div>
                                        <div class="attr_box">
                                            <el-form-item style="margin-bottom: 0" label="亮点文字说明" :prop="`course_highlights.${i}.course_highlight_description`" :rules="rules.lightspotRule.course_highlight_title">
                                                <el-input v-model="ele.course_highlight_description" type="textarea"
                                                          :rows="3" placeholder="请输入亮点文字说明"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-card>
                                    <p style="margin-top: -12px">
                                        <el-button type="primary" size="mini" @click="addLight()" :disabled="form.course_highlights.length==8">添加</el-button>
                                    </p>
                                </el-card>

                                <el-form-item label="授课讲师" prop="teacher_name">
                                    <el-input v-model="form.teacher_name" placeholder="请输入授课讲师"></el-input>
                                    <p class="ly_hint_text">注：不超过5个字</p>
                                </el-form-item>
                                <el-form-item label="讲师头像" prop="teacher_icon">
                                    <el-upload
                                            class="avatar-uploader"
                                            :action="$webConfig.qnUploadHost"
                                            :data="qnHead"
                                            :show-file-list="false"
                                            :on-success="teacherHeadSuccess"
                                            :before-upload="beforeTeacherHead">
                                        <img v-if="form.teacher_icon" :src="form.teacher_icon" class="avatar" @click="getToken(1)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="getToken(1)"></i>
                                    </el-upload>
                                    <p class="ly_hint_text">注：尺寸为400*400像素，不超过200KB</p>
                                </el-form-item>
                                <el-form-item label="讲师信息" prop="teacher_details">
                                    <el-input v-model="form.teacher_details" type="textarea"
                                              :rows="3" placeholder="请输入讲师信息"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item label="个人成绩" prop="teacher_achievement">
                                    <el-input v-model="form.teacher_achievement" type="textarea"
                                              :rows="3" placeholder="请输入个人成绩"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item label="执教理念" prop="teacher_achievement">
                                    <el-input v-model="form.teaching_idea" type="textarea"
                                              :rows="3" placeholder="请输入执教理念"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item label="目标学员" prop="teacher_achievement">
                                    <el-input v-model="form.target_trainees" type="textarea"
                                              :rows="3" placeholder="请输入目标学员"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item label="授课形式" prop="teacher_details">
                                    <el-input v-model="form.teaching_form" type="textarea"
                                              :rows="3" placeholder="请输入授课形式"></el-input>
                                    <p class="ly_hint_text">注：不超过100个字</p>
                                </el-form-item>
                                <el-form-item label="客服微信号" prop="service_wx">
                                    <el-input v-model="form.service_wx" placeholder="请输入客服微信号"></el-input>
                                </el-form-item>
                                <el-form-item label="客服微信二维码" prop="service_wxqrcode">
                                    <el-upload
                                            class="avatar-uploader"
                                            :action="$webConfig.qnUploadHost"
                                            :data="qnQrcode"
                                            :show-file-list="false"
                                            :on-success="qrcodeSuccess"
                                            :before-upload="beforeQrcode">
                                        <img v-if="form.service_wxqrcode" :src="form.service_wxqrcode" class="avatar" @click="getToken(3)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="getToken(3)"></i>
                                    </el-upload>
                                    <p class="ly_hint_text">注：尺寸为400*400像素，不超过200KB</p>
                                </el-form-item>
                                <el-form-item label="客服电话" prop="service_tel">
                                    <el-input v-model="form.service_tel" placeholder="请输入客服电话"></el-input>
                                </el-form-item>
                                <div class="home-title">
                                    <span class="home-title-t ly-title">详情描述</span>
                                </div>
                                <el-form-item label="商品主图" prop="goods_url">
                                    <el-upload
                                            class="avatar-uploader"
                                            :action="$webConfig.qnUploadHost"
                                            :data="qnMain"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="form.goods_url" :src="form.goods_url" class="avatar" @click="getToken(2)">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="getToken(2)"></i>
                                    </el-upload>
                                    <p class="ly_hint_text">注：尺寸为800*800像素，不超过200KB</p>
                                </el-form-item>
                                <el-form-item label="商品轮播图" prop="goods_banner">
                                    <el-upload
                                            :action="$webConfig.qnUploadHost"
                                            list-type="picture-card"
                                            :limit="limit"
                                            :http-request="bannerUpload"
                                            :file-list="form.goods_banner"
                                            :on-exceed="bannerExceed"
                                            :before-upload="beforeBannerUpload"
                                            :on-remove="bannerRemove">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <!--<el-dialog :visible.sync="dialogVisible">-->
                                        <!--<img width="100%" :src="dialogBannerUrl" alt="">-->
                                    <!--</el-dialog>-->
                                    <p class="ly_hint_text">注：最多4张，尺寸为800*800像素</p>
                                </el-form-item>
                                <el-form-item label="课程内容" prop="virtual_goods_catalog_req_list">
                                    <!--<p class="ly_hint_text ly_hint_text_color">（ 最多添加三个规格，且每个规格至少添加一个属性 ）</p>-->
                                </el-form-item>
                                <el-card style="margin-bottom: 32px;">
                                    <el-form-item label="课程大纲" prop="virtual_goods_catalog_req_list">
                                    </el-form-item>
                                    <el-card class="box-card" style="margin-bottom: 32px;box-shadow: none;" v-for="(ele,i) in form.virtual_goods_catalog_req_list" :key="i">
                                        <div slot="header" class="clearfix ly-flex-center-between">
                                            <el-form-item :label="`章节${map[i]}`" style="margin-bottom: 0" :prop="`virtual_goods_catalog_req_list.${i}.name`" :rules="rules.contentRules.name">
                                                <el-input v-model="ele.name" maxlength="20" placeholder="请输入章节名称"></el-input>
                                            </el-form-item>
                                            <el-checkbox v-model="ele.is_free" :true-label='free' :false-label='noFree' @change="sectionChange(ele,i)">免费</el-checkbox>
                                            <el-button :disabled="i==0" size="mini" type="danger" @click="delSection(ele,i)">删除</el-button>
                                        </div>
                                        <div class="attr_box">
                                            <el-card class="box-card" style="margin-bottom: 32px;box-shadow: none;" v-for="(val,v) in ele.virtual_goods_catalog_list" :key="v">
                                                <div slot="header" class="clearfix ly-flex-center-between">
                                                    <div class="ly-flex-center">
                                                        <el-form-item :label="`课时${v+1}`" style="margin-bottom: 0" :prop="`virtual_goods_catalog_req_list.${i}.virtual_goods_catalog_list.${v}.name`" :rules="rules.contentRules.name">
                                                            <el-input v-model="val.name" maxlength="20" placeholder="请输入课时名称"></el-input>
                                                        </el-form-item>
                                                        <el-select v-model="val.type" placeholder="请选择" class="miniSel" @change="choType">
                                                            <el-option
                                                                    v-for="item in classType"
                                                                    :key="item.value"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                        <el-checkbox v-model="val.is_free" :true-label='free' :false-label='noFree' @change='hourChange(ele,i,val,v)' class="miniSelCheck">免费</el-checkbox>
                                                    </div>
                                                    <el-button :disabled="v==0" size="mini" type="danger" @click="delHour(ele,val,v,i)">删除</el-button>
                                                </div>
                                                <div class="attr_box">
                                                    <div v-if="val.type==1">
                                                        <el-upload
                                                                class="upload-demo"
                                                                :action="$webConfig.qnUploadHost"
                                                                :before-upload="videoBeforeUpload(val)"
                                                                :on-preview="videoPreview"
                                                                :http-request="videoUpload(val)"
                                                                multiple

                                                                :on-exceed="videoExceed"
                                                                :file-list="val.videoList">
                                                            <el-button size="small" type="primary">点击上传</el-button>
                                                            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                                                        </el-upload>

                                                        <el-table
                                                                style="margin-top: 20px"
                                                                :header-cell-style="{background:'#fafafa'}"
                                                                border
                                                                :data="val.shop_medias">
                                                            <el-table-column
                                                                    :key="1"
                                                                    prop="name"
                                                                    align="center"
                                                                    label="视频名称">
                                                                <template slot-scope="scope">
                                                                    <el-form-item :prop="`virtual_goods_catalog_req_list.${i}.virtual_goods_catalog_list.${v}.shop_medias`+'.'+scope.$index+'.media_name'" :rules="rules.tableRules.media_name">
                                                                        <el-input v-model="scope.row.media_name" placeholder="视频名称"></el-input>
                                                                    </el-form-item>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column :key="2" prop="sort" align="center" label="排序" width="120">
                                                                <template slot-scope="scope">
                                                                    <el-form-item :prop="`virtual_goods_catalog_req_list.${i}.virtual_goods_catalog_list.${v}.shop_medias`+'.'+scope.$index+'.sort'" :rules="rules.tableRules.sort">
                                                                        <el-input v-model="scope.row.sort" placeholder="视频排序"></el-input>
                                                                    </el-form-item>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column
                                                                    :key="3"
                                                                    prop="rebates"
                                                                    align="center"
                                                                    width="100"
                                                                    label="操作">
                                                                <template slot-scope="scope">
                                                                    <!--<el-button size="mini" type="text" @click="choClick(scope.row,v,i)">-->
                                                                        <!--选择-->
                                                                    <!--</el-button>-->
                                                                    <el-button size="mini" style="color: red" type="text" @click="delClick(scope.row,val,v,i)">
                                                                        删除
                                                                    </el-button>
                                                                    <!--<el-button size="mini" type="text" @click="addClick(scope.row,v,i)">-->
                                                                        <!--向下添加-->
                                                                    <!--</el-button>-->
                                                                </template>
                                                            </el-table-column>
                                                        </el-table>
                                                    </div>

                                                    <el-form-item v-if="val.type==2" label="直播时间" style="margin-bottom: 0" :prop="`virtual_goods_catalog_req_list.${i}.virtual_goods_catalog_list.${v}.start_time`" :rules="rules.contentRules.start_time">
                                                        <!--format="yyyy-MM-dd HH:mm:ss"-->
                                                        <el-date-picker
                                                                :picker-options="expireTimeOption"
                                                                :default-value="classDate"
                                                                default-time="09:00:00"
                                                                v-model="val.start_time"
                                                                type="datetime"

                                                                placeholder="选择日期时间">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                            </el-card>
                                            <p style="margin-top: -12px"><el-button type="primary" size="mini" @click="addHour(ele,i)">添加课时</el-button></p>
                                        </div>
                                    </el-card>
                                    <p style="margin-top: -12px"><el-button type="primary" size="mini" @click="addSection()">添加章节</el-button></p>
                                </el-card>

                                <div class="home-title">
                                    <span class="home-title-t ly-title">价格/库存</span>
                                </div>
                                <el-form-item label="售价" prop="goods_price">
                                    <el-input v-model="form.goods_price" placeholder="请输入售价"></el-input>
                                </el-form-item>
                                <el-form-item label="数量" prop="spu_stock">
                                    <el-input v-model="form.spu_stock" placeholder="请输入数量"></el-input>
                                </el-form-item>
                                <el-form-item label="划线价" prop="goods_marking_price">
                                    <el-input v-model="form.goods_marking_price" placeholder="请输入划线价"></el-input>
                                </el-form-item>

                                <div class="home-title">
                                    <span class="home-title-t ly-title">其他信息</span>
                                </div>
                                <el-form-item label="上架时间" prop="goods_status">
                                    <el-radio v-model="form.goods_status" label="1">立刻上架</el-radio>
                                    <el-radio v-model="form.goods_status" label="0">放入仓库</el-radio>
                                </el-form-item>
                                <!--<p style="color: red">提示：请合理设置奖项，以达到活动效果最大化，切勿设置所有奖项中奖概率为0。</p>-->
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('form')" v-loading="submitState">提交并保存</el-button>
                                    <el-button type="primary" @click="$router.push('/goods/Index')">取消</el-button>
                                    <!--<el-button @click="resetForm('form')">重置</el-button>-->
                                    <!--<el-button>取消</el-button>-->
                                </el-form-item>
                            </el-form>
                        </div>
                        <!-- 选择视频 => 视频list对话框 start -->
                        <el-dialog title="选择视频" :visible.sync="dialogTableVisible" :before-close="closeDialog">
                            <!-- 搜索条件 start -->
                            <el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline">
                                <el-form-item label="视频名称" prop="media_name">
                                    <el-input v-model="postData.media_name" placeholder="请输入视频名称" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">查询</el-button>
                                </el-form-item>
                            </el-form>
                            <!-- 搜索条件 end -->
                            <template>
                                <el-table ref="videoTable" :data="tableData" border height="360">
                                    <el-table-column prop="id" label="封面" width="100" :key="1">
                                        <template slot-scope="scope">
                                            <img :src="scope.row.media_cover" alt="" style="width: 80px">
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="media_name" label="视频名称" :key="2">
                                        <template slot-scope="scope">
                                            <p>{{scope.row.media_name}}</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            :key="3"
                                            align="center"
                                            label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="text" @click="choVideoClick(scope.row)">
                                                选择
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
                        </el-dialog>
                        <!-- 选择视频 => 视频list对话框 end -->
                    </div>
                </div>
                <common-footer></common-footer>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonFooter from "../../components/CommonFooter";
    let reg = /^[+]{0,1}(\d+)$/; //包含0，正整数
    let reg2 = /^[1-9]+\d*$/; //不含0，正整数
    let reg1 = /^\d+(\.\d{1,2})?$/; //两位小数，金额

    export default {
        name: "Edit",
        components: {
            CommonFooter,
        },
        data: function () {
            var checkVideoNull = (rule, value, callback) => {
                console.log(value);
                value.forEach((ele,e)=>{
                    ele.virtual_goods_catalog_list.forEach((val,v)=>{
                        if (val.shop_medias.length == 0) {
                            callback(new Error(rule.message));
                            this.$message.warning(`当前第${e}章第${v}课时视频为空，请上传`);
                        } else {
                            callback();
                        }
                    })
                })
            };
            var checkTimeNull = (rule, value, callback) => {
                console.log(value);
                if (value == 0 || !value) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            var checkNull = (rule, value, callback) => {
                value = String(value);
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
                expireTimeOption: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;   //禁用以前的日期，今天不禁用
                        // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
                    }
                },
                showUploadList: false,//不显示上传列表
                submitState: false,
                map: {0:'一',1:'二',2:'三',3:'四',4:'五',5:'六',6:'七',7:'八',8:'九',9:'十',10:'十一',11:'十二',12:'十三',13:'十四',14:'十五',15:'十六',16:'十七',17:'十八',18:'十九',19:'二十'},
                // dialogBannerUrl: '',
                // dialogVisible: false,
                //商品主图所需七牛云token
                qnHead: {
                    token: "",
                    key: ""
                },
                qnQrcode: {
                    token: "",
                    key: ""
                },
                qnMain: {
                    token: "",
                    key: ""
                },
                limit: 4,
                free: 1,
                noFree: 0,
                classDate: new Date(),
                form: {
                    id: '',//商品id
                    goods_type: '0',//商品类型
                    is_spell: '0',//是否拼团
                    sys_category_back_ids: ["195", "184", "123"],//商品类目
                    sys_category_back_id: "123",//商品类目-三级id
                    course_name: '课程名称',//课程名称
                    goods_title: '课程导读',//课程导读
                    course_highlights: [
                        // {course_highlight_title:'',course_highlight_description:''}
                        ],//亮点
                    teacher_name: '杜鲁阳',//授课讲师
                    teacher_icon: '',//讲师头像
                    teacher_details: '',//讲师信息
                    teacher_achievement: '',//个人成绩
                    teaching_idea: '',//执教理念
                    target_trainees: '',//目标学员
                    teaching_form: '',//授课形式
                    service_wxqrcode: '',//客服微信二维码
                    service_wx: '',//客服微信号
                    service_tel: '',//客服电话
                    goods_imgs: [],//商品轮播图
                    goods_banner: [],//商品轮播图 - 数据调试所需
                    goods_url: '',//商品主图
                    virtual_goods_catalog_req_list: [
                        {
                            "id": 1,
                            "sort": 1,
                            "is_free": 0,//是否免费：默认：0 否；1：是
                            "name": "",//章节名称
                            "virtual_goods_catalog_list": [
                                {
                                    "id": 1,
                                    "is_free": 0,
                                    "name": "",
                                    "sort": 0,
                                    "start_time": 0,
                                    "type": 1,
                                    "shop_medias": [
                                        // {
                                        //     "id": 1,
                                        //     "sort": 1,
                                        //     "media_name": ''
                                        // }
                                    ],
                                    "videoList": [],
                                    "videoLists": [],
                                }
                            ]//课时list
                        }
                    ],
                    goods_price: '',//售价
                    spu_stock: '',//数量
                    goods_marking_price: '',//划线价
                    goods_status: '0',//上架时间


                    goods_no: '123456',//商品货号

                },
                rules: {
                    tableRules: {
                        media_name: [
                            {
                                validator: checkNull,
                                required: true,
                                message: '不超过20个字',
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 20,
                                message: '长度在 1 到 20 个字符',
                                trigger: 'blur'
                            }
                        ],
                        sort: [
                            {
                                validator: checkNull,
                                required: true,
                                message: '请设置视频排序',
                                trigger: 'blur'
                            }
                        ],
                    },
                    lightspotRule: {
                        course_highlight_title: [
                            {
                                validator: checkNull,
                                required: true,
                                message: '不超过15个字',
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 15,
                                message: '长度在 1 到 15 个字符',
                                trigger: 'blur'
                            }
                        ],
                        course_highlight_description: [
                            {
                                validator: checkNull,
                                required: true,
                                message: '不超过100个字',
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 100,
                                message: '长度在 1 到 100 个字符',
                                trigger: 'blur'
                            }
                        ]
                    },
                    contentRules: {
                        name: [
                            {
                                validator: checkNull,
                                required: true,
                                message: '不超过20个字',
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 20,
                                message: '长度在 1 到 20 个字符',
                                trigger: 'blur'
                            }
                        ],
                        course_highlight_description: [
                            {
                                validator: checkNull,
                                required: true,
                                message: '不超过100个字',
                                trigger: 'blur'
                            },
                            {
                                min: 1,
                                max: 100,
                                message: '长度在 1 到 100 个字符',
                                trigger: 'blur'
                            }
                        ],
                        start_time: [
                            {
                                validator: checkTimeNull,
                                required: true,
                                message: '请选择直播时间',
                                trigger: 'change'
                            }
                        ]
                    },
                    virtual_goods_catalog_req_list: [
                        {
                            validator: checkVideoNull,
                            required: true,
                            message: '某课时视频为空，请上传',
                            trigger: 'change'
                        }
                    ],
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
                    goods_price: [
                        {
                            validator: checkPriceNull,
                            required: true,
                            message: '请输入正确的售价（包含两位小数）',
                            trigger: 'blur'
                        }
                    ],
                    spu_stock: [
                        {
                            validator: checkStockNull,
                            required: true,
                            message: '请输入正整数',
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
                    service_wx: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入客服微信号',
                            trigger: 'blur'
                        }
                    ],
                    service_tel: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入正确的客服电话',
                            trigger: 'blur'
                        }
                    ],
                    service_wxqrcode: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请上传客服微信二维码',
                            trigger: 'blur'
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
                    teacher_icon: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请上传讲师头像',
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
                    course_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '不超过20个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '长度在 1 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    goods_title: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '不超过150个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 150,
                            message: '长度在 1 到 150 个字符',
                            trigger: 'blur'
                        }
                    ],
                    teacher_details: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '不超过100个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 100,
                            message: '长度在 1 到 100 个字符',
                            trigger: 'blur'
                        }
                    ],
                    teacher_achievement: [
                        {
                            // validator: checkNull,
                            required: false,
                            message: '不超过100个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 100,
                            message: '长度在 1 到 100 个字符',
                            trigger: 'blur'
                        }
                    ],
                    teacher_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '不超过5个字',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 5,
                            message: '长度在 1 到 5 个字符',
                            trigger: 'blur'
                        }
                    ],
                    virtual_goods_catalog_req_list: [
                        {
                            required: true,
                            message: '设置课程内容',
                            trigger: 'blur'
                        }
                    ]
                },
                classifyList: [],//商品分类
                list: [],
                classType: [
                    {
                        value: 1,
                        label: '视频'
                    },
                    {
                        value: 2,
                        label: '直播'
                    }
                ],
                dialogTableVisible: false,
                searchState: false,
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
                    "media_name": ''//搜索-视频名称
                },
                "tableData": [],//视频资源list
                "sIndex": 0,//章节索引
                "hIndex": 0,//课时索引
                "vIndex": 0,//视频索引
            }
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        methods: {
            videoBeforeUpload(val){
                return (file) => {
                    console.log(val);
                    console.log(file);
                    // const isJPG = file.type === 'video/mp4';
                    // const isJPG = file.type === 'video/mp4' || file.type === 'image/jpg' || file.type === 'image/png';
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    console.log("获取token成功");
                    if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
                        this.$message.error('请上传正确的视频格式: mp4/ogg/flv/avi/wmv/rmvb');
                        return false;
                    }
                    // if (!isLt2M) {
                    //     this.$message.error('上传头像图片大小不能超过 2MB!');
                    // }
                    file.id = val.videoLists.length +1;
                    val.videoList.push(file);
                    val.videoLists.push(file);
                    console.log(val);
                    // return isJPG;
                }
            },
            /**
             * 自定义视频上传
             */
            videoUpload(val){
                return (files) => {
                    console.log(val);
                    console.log(files);
                    let __that = this;
                    val.videoList.forEach((file,f)=>{
                        console.log(file);
                        __that.$axios.get('shop/admin/mall/file/getUploadAuth')
                            .then(res=>{
                                console.log("获取token",res);
                                return res.data.data;
                            }).then(res=>{
                            console.log('上传至七牛云',res);
                            let keys = new Date().getTime()+file.name;
                            const config = {
                                headers: {"Content-Type": "multipart/form-data"}
                            };
                            let postData = new FormData();
                            postData.append('token',res);
                            postData.append('key',keys);
                            postData.append('file',file.file);

                            __that.$axios.post(__that.$webConfig.qnUploadHost,postData,config)
                                .then((res)=>{
                                    console.log("上传至七牛云结果",res);
                                })
                                .catch(rej=>{
                                    console.log("rejjjj",rej);
                                    // 拦截器处对返回结果中code非200时均由catch返回，此处是第三方服务器返回无法通过200判断
                                    if(rej.data.key){
                                        let url = __that.$webConfig.apiHosts + keys;
                                        __that.$set(val.shop_medias, f, {"url":url,"id": file.id, "sort": file.id, "media_name": file.name});
                                        console.log(val.shop_medias.sort(__that.sortNumber));
                                    }
                                })
                        })
                            .catch(rej=>{
                                console.log("失败",rej)
                            })
                    });
                    console.log(this.form.virtual_goods_catalog_req_list);

                }
            },
            sortNumber(a,b) {
                console.log(a.media_name.localeCompare(b.media_name));
                return a.media_name.localeCompare(b.media_name) ? 1 : -1
                // return a.media_name < b.media_name
            },
            videoRemove(file, fileList) {
                console.log(file, fileList);
            },
            videoPreview(file) {
                console.log(file);
            },
            videoExceed(files, fileList) {
                console.log(files, fileList);
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            //获取token
            getToken(id){
                console.log("aaa",id);
                // id【1: 讲师头像，2：课程主图，3：客服二维码】
                this.$axios.get('shop/admin/mall/file/getUploadAuth')
                    .then(res=>{
                        console.log("获取token",res);
                        let t = res.data.data;
                        if(id==1){
                            this.qnHead.token = t
                        }else if(id==2){
                            this.qnMain.token = t
                        }else if(id==3){
                            this.qnQrcode.token = t
                        }
                    })
                    .catch(rej=>{
                        console.log("失败",rej)
                    })
            },
            /**
             *  上传成功【讲师头像】
             */
            teacherHeadSuccess(res, file) {
                // this.form.imgUrl = URL.createObjectURL(file.raw);
                let url = this.qnHead.key;
                this.form.teacher_icon = this.$webConfig.apiHosts + url;
            },
            /**
             *  上传前判断【讲师头像】
             */
            beforeTeacherHead(file) {
                this.qnHead.key = new Date().getTime()+file.name;  //上传到七牛的key
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                console.log("获取token成功",this.qnHead);
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            /**
             *  上传成功【微信客服二维码】
             */
            qrcodeSuccess(res, file) {
                // this.form.imgUrl = URL.createObjectURL(file.raw);
                let url = this.qnQrcode.key;
                this.form.service_wxqrcode = this.$webConfig.apiHosts + url;
            },
            /**
             *  上传前判断【微信客服二维码】
             */
            beforeQrcode(file) {
                this.qnQrcode.key = new Date().getTime()+file.name;  //上传到七牛的key
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                console.log("获取token成功",this.qnQrcode);
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
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
                console.log("获取token成功",this.qnMain);
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
                console.log("获取token成功");
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
                this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
             *  删除亮点
             */
            delLight(data,index) {
                console.log(data,index,this.form.course_highlights[index]);
                const that = this, text = "删除";
                that.$confirm("此操作将删除该亮点 , 是否继续 ?", "提示", {
                    "confirmButtonText": "确定",
                    "cancelButtonText": "取消",
                    "type": "warning",
                }).then(() => {
                    this.form.course_highlights.splice(index,1);
                }).catch(() => {
                    this.$message({center: true, type: "info", message: "已取消".concat(text).concat("操作")});
                });
            },
            /**
             *  添加亮点
             */
            addLight() {
                let index = this.form.course_highlights.length;
                let val = this.form.course_highlights[index-1];
                if(!val){
                    this.form.course_highlights.push({
                        course_highlight_description: '',
                        course_highlight_title: '',
                    });
                    return false
                }
                if(val.course_highlight_title.trim()==''||val.course_highlight_description.trim()==''){
                    this.open("请先完善当前亮点再添加");
                    return false;
                }
                if(index==8){
                    this.open("亮点数量已达上限，如需添加请调整");
                    return false;
                }
                this.form.course_highlights.push({
                    course_highlight_description: '',
                    course_highlight_title: '',
                })
            },
            choType(value){
                console.log('选择课时类型',value)
            },
            /**
             * 添加章节
             * @param data - 当前章节；i - 章节索引；sIndex - 章节索引
             */
            addSection(){
                console.log('添加课时',this.form.virtual_goods_catalog_req_list);
                let obj = {
                    "id": 1,
                    "sort": 1,
                    "is_free": 0,//是否免费：默认：0 否；1：是
                    "name": "",//章节名称
                    "virtual_goods_catalog_list": [
                        {
                            "id": 1,
                            "is_free": 0,
                            "name": "",
                            "sort": 0,
                            "start_time": 0,
                            "type": '1',
                            "shop_medias": [
                                // {
                                //     "id": 1,
                                //     "sort": 1,
                                //     "media_name": ''
                                // }
                            ],
                            "videoList": [],
                            "videoLists": []
                        }
                    ]//课时list
                };
                this.form.virtual_goods_catalog_req_list.push(obj)
            },
            /**
             * 删除章节
             * @param fData - 当前章节；data - 每一课时；hIndex - 课时索引；sIndex - 章节索引
             */
            delSection(data,sIndex){
                console.log('删除课时',data,sIndex);
                this.form.virtual_goods_catalog_req_list.splice(sIndex,1);
                console.log('删除课时后===',this.form.virtual_goods_catalog_req_list);
            },
            /**
             * 添加课时
             * @param data - 添加于章节；i - 章节索引；sIndex - 章节索引
             */
            addHour(data,i){
                console.log('添加课时',data,i,this.form.virtual_goods_catalog_req_list);
                let len = data.virtual_goods_catalog_list.length;
                let obj ={
                    "id": len,
                    "is_free": 0,
                    "name": "",
                    "sort": len,
                    "start_time": 0,
                    "type": 1,
                    "shop_medias": [
                        // {
                        //     "id": 1,
                        //     "sort": 1,
                        //     "media_name": ''
                        // }
                    ],
                    "videoList": [],
                    "videoLists": []
                };
                let hourList = data.virtual_goods_catalog_list;
                let flag = 0;
                hourList.forEach((ele,e)=>{
                    if(ele.name == ''){
                        // this.$message({type: 'info', message: '请先完善当前课时'});
                        flag ++;
                        return false
                    }
                    if(ele.type==1){
                        if(ele.shop_medias[ele.shop_medias.length-1].media_name == ''){
                            flag ++;
                            // this.$message({type: 'info', message: '请先完善当前课时'});
                            return false
                        }
                    }else if(ele.type==2){
                        if(ele.start_time == ''){
                            flag ++;
                            return false
                        }
                    }
                });
                if(flag==0){
                    hourList.push(obj);
                    this.sectionChange(data,i);
                    console.log('添加课时后===',this.form.virtual_goods_catalog_req_list);
                }else {
                    this.$message({type: 'info', message: '请先完善当前课时'});
                }
            },
            /**
             * 删除课时
             * @param fData - 每一章节；data - 每一课时；hIndex - 课时索引；sIndex - 章节索引
             */
            delHour(fData,data,hIndex,sIndex){
                console.log('删除课时',fData,data,hIndex,sIndex);
                fData.virtual_goods_catalog_list.splice(hIndex,1);
                console.log('删除课时后===',this.form.virtual_goods_catalog_req_list);
            },
            /**
             *  选择视频  -  表格中按钮
             */
            choVideoClick(data){
                console.log(data);
                this.dialogTableVisible = false;
                this.form.virtual_goods_catalog_req_list[this.sIndex].virtual_goods_catalog_list[this.hIndex].shop_medias[this.vIndex].media_name = data.media_name;
                this.form.virtual_goods_catalog_req_list[this.sIndex].virtual_goods_catalog_list[this.hIndex].shop_medias[this.vIndex].id = data.id;
            },
            /**
             *  选择视频
             *  @param data - 每一行；hIndex - 课时索引；sIndex - 章节索引
             */
            choClick(data,hIndex,sIndex){
                console.log(data,hIndex,sIndex);
                this.dialogTableVisible = true;
                this.sIndex = sIndex;
                this.hIndex = hIndex;
                this.vIndex = data.sort - 1;
                console.log(this.sIndex,this.hIndex,this.vIndex);
            },
            /**
             *  排序课程内容
             */
            sortList(){
                console.log('排序课程内容');
                this.form.virtual_goods_catalog_req_list.forEach((ele,e)=>{
                    ele.sort = e + 1;
                    ele.id = e + 1;
                    ele.virtual_goods_catalog_list.forEach((val,v)=>{
                        val.sort = v + 1;
                        val.id = v + 1;
                        val.shop_medias.forEach((self,s)=>{
                            self.sort = s + 1;
                            self.id = s + 1;
                        });
                    });
                });
                console.log(this.form.virtual_goods_catalog_req_list);
            },
            /**
             *  删除视频
             *  @param data - 每一行；hData - 当前课时；hIndex - 课时索引；sIndex - 章节索引
             */
            delClick(data,hData,hIndex,sIndex){
                console.log(data,hData,hIndex,sIndex);
                // this.form.virtual_goods_catalog_req_list[sIndex].virtual_goods_catalog_list[hIndex].shop_medias.splice(data.sort - 1,1);
                hData.shop_medias.forEach((ele,e)=>{
                    if(ele.id == data.id){
                        hData.shop_medias.splice(e ,1);
                        hData.videoList.splice(e ,1);
                    }
                })
                // this.sortList();
            },
            /**
             *  插入视频
             *  @param data - 每一行；hIndex - 课时索引；sIndex - 章节索引
             */
            addClick(data,hIndex,sIndex){
                console.log(data,hIndex,sIndex);
                let obj = {
                    "id": data.sort + 1,
                    "sort": data.sort + 1,
                    "media_name": ''
                };
                this.form.virtual_goods_catalog_req_list[sIndex].virtual_goods_catalog_list[hIndex].shop_medias.splice(data.sort,0,obj);
                // this.sortList();
            },
            /**
             *  选择免费 - 章节
             *  @param data - 当前章节；sIndex - 章节索引
             */
            sectionChange(data,sIndex){
                console.log('选择课时免费',data,sIndex);
                data.virtual_goods_catalog_list.forEach((ele,e)=>{
                    if(data.is_free){
                        ele.is_free = 1
                    }else {
                        ele.is_free = 0
                    }
                })
            },
            /**
             *  选择免费 - 课时
             *  @param data - 当前章节；sIndex - 章节索引；hour - 课时索引；hIndex - 课时索引
             */
            hourChange(data,sIndex,hour,hIndex){
                console.log('选择课时免费',data,sIndex,hour,hIndex);
                let len = data.virtual_goods_catalog_list.length;
                let flag = 0;
                data.virtual_goods_catalog_list.forEach((ele,e)=>{
                    if(ele.is_free){
                        flag ++;
                    }
                });
                if(flag==len){
                    data.is_free = 1
                }else {
                    data.is_free = 0
                }
            },
            //选择商品分类
            handleChange(value) {
                console.log(value);
                this.form.sys_category_back_id = value[2]
            },

            /**
             * 提交
             * @param formName
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    let flag = 0;
                    this.form.virtual_goods_catalog_req_list.forEach((ele,e)=>{
                        ele.sort = e + 1;
                        ele.virtual_goods_catalog_list.forEach((val,v)=>{
                            val.sort = v + 1;
                            if(val.type==2){
                                let date = new Date(val.start_time);
                                val.start_time = date.valueOf();
                            }else {
                                if(val.shop_medias.length==0){
                                    flag ++ ;
                                }
                            }
                        });
                    });
                    console.log(this.form.virtual_goods_catalog_req_list);
                    if(flag>0){
                        this.$message({
                            type: 'info',
                            message: '请完善课程内容'
                        });
                        return false;
                    }
                    if (valid) {
                        this.submitState = true;
                        this.form.goods_imgs = [];
                        this.form.goods_banner.forEach((ele,i)=>{
                            this.form.goods_imgs[i]=ele.url;
                        });
                        this.form.goods_imgs = JSON.stringify(this.form.goods_imgs);
                        console.log('提交',this.form);
                        this.$confirm('此操作将保存该商品, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$axios.post('shop/admin/mall/virtual/goods/saveOrUpdate', this.form).then(res => {
                                this.$message({type: 'success', message: '创建成功!'});
                                this.$router.push('/goods/list');
                                console.log("创建成功!",res);
                                this.submitState = false;
                            }).catch((rej) => {
                                console.log(rej);
                                this.submitState = false;
                                this.$message({
                                    type: 'info',
                                    message: '创建失败' + rej.data.message
                                });
                                this.form.virtual_goods_catalog_req_list.forEach((ele,e)=>{
                                    ele.virtual_goods_catalog_list.forEach((val,v)=>{
                                        if(val.type==2){
                                            val.start_time = new Date(Number(val.start_time)).format('yyyy-MM-dd hh:mm:ss');
                                        }
                                    });
                                });
                                console.log(this.form.virtual_goods_catalog_req_list);
                            });
                        }).catch(() => {
                            this.submitState = false;
                            this.$message({
                                type: 'info',
                                message: '已取消创建'
                            });
                            this.form.virtual_goods_catalog_req_list.forEach((ele,e)=>{
                                ele.virtual_goods_catalog_list.forEach((val,v)=>{
                                    if(val.type==2){
                                        val.start_time = new Date(Number(val.start_time)).format('yyyy-MM-dd hh:mm:ss');
                                    }
                                });
                            });
                            console.log(this.form.virtual_goods_catalog_req_list);
                        });
                    } else {
                        return false;
                    }
                });
            },
            /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.pagination.currentPage = this.postData.cursor = val;
                // this.postData.cursor = val;
                this.getVideoList();
            },
            /**
             * 上一页
             */
            prevClick() {
                this.pagination.currentPage --;
                this.postData.cursor --;
                this.getVideoList();
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage ++;
                this.postData.cursor ++;
                this.getVideoList();
            },
            /**
             * 每页条数
             * @param val
             */
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagination.size = this.postData.size = val;
                this.getVideoList();
            },
            /**
             * 查询视频
             */
            onSubmit() {
                console.log('submit!');
                this.searchState = true;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getVideoList();
            },
            /**
             * 关闭选择视频会话框
             */
            closeDialog(done) {
                console.log('关闭选择视频会话框',done);
                console.log('重置搜索表单');
                this.dialogTableVisible = false;
                this.$refs['postData'].resetFields();
                this.getVideoList();
                console.log(this.postData);
            },
            /**
             *  获取视频资源list
             */
            getVideoList(){
                this.$axios.post('shop/admin/mall/virtual/goods/media/list',this.postData).then(res => {
                    console.log(res);
                    this.searchState = false;
                    this.tableData = res.data.data.data;
                    this.pagination.total = Number(res.data.data.count);
                    this.pagination.currentPage = res.data.data.cursor;
                })
                    .catch((rej) => {
                        this.searchState = false;
                        this.$message(rej.data.message);
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
             * 获取商品详情
             */
            getDetail(){
                console.log('获取商品详情');
                let __that = this;
                this.$axios.get('shop/admin/mall/virtual/goods/getVirtualGoodsById?id='+this.form.id).then(res => {
                    console.log("获取商品详情",res);
                    let info = res.data.data;
                    this.form = info;
                    this.form.goods_type = '0';
                    this.form.goods_status = String(info.goods_status);
                    this.form.goods_imgs = info.goods_imgs;
                    this.form.goods_banner = JSON.parse(info.goods_imgs);
                    JSON.parse(info.goods_imgs).forEach((ele,i)=>{
                        let imgObj = {};
                        imgObj.url = ele;
                        this.form.goods_banner[i] = imgObj
                    });
                    this.form.virtual_goods_catalog_req_list.forEach((ele,e)=>{
                        ele.virtual_goods_catalog_list.forEach((val,v)=>{
                            if(val.type==2){
                                val.start_time = Number(val.start_time);
                                val.start_time = new Date(val.start_time).format('yyyy-MM-dd hh:mm:ss');
                            }
                        });
                    });
                    console.log("1371001000000",this.form.virtual_goods_catalog_req_list);
                    console.log(this.form);
                    })
                    .catch((rej) => {
                        this.$message(rej.data.message);
                    });
            }
        },
        mounted: function () {
            //1589871673000
            console.log(new Date("1589871673000").format('yyyy-MM-dd hh:mm:ss'));
            //获取商品分类
            this.getClassifyList();
            //获取视频资源list
            this.getVideoList();
            if(this.$route.query.goodsId){
                this.form.id = this.$route.query.goodsId;
                //获取商品详情
                this.$nextTick(()=>{
                    this.getDetail();
                })
            }
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
