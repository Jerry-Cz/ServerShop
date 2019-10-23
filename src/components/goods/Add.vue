<template>
    <div>
       <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 信息提示框 -->
            <el-alert title="消息提示的文案" type="info"  center show-icon>
            </el-alert>

            <!-- 步骤条区域 -->
            <!-- activeIndex - 0 是把接收的字符值转换为数值型 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 添加商品表单区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!-- tabs 栏区域 -->
                <!-- before-leave	切换标签之前的钩子，若返回 false 则阻止切换,Function(activeName, oldActiveName) -->
                <!-- tab-click	tab 被选中时触发 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="checkedTab">
                    <el-tab-pane label="基本信息" name="0" >
                        <el-form-item label="商品名称：" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格：" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量：" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量：" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类：">
                            <!-- 级联选择器 -->
                             <el-cascader expand-trigger="hover"
                                v-model="addForm.goods_cat"
                                :options="catelist"
                                :props="cataProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的 Item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTablist" :key='item.attr_id'>
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="attr" v-for="(attr,i)
                                in item.attr_vals" :key='i'></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTablist" :key='item.attr_id'>
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示要上传图片的后台API接口 -->
                        <!-- on-success	文件上传成功时的钩子 -->
                        <!-- on-preview	点击文件列表中已上传的文件时的钩子	function(file) -->
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture" :headers="headersObj"
                            :on-success="uploadSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                         <quill-editor v-model="addForm.goods_introduce">
                         </quill-editor>
                         <el-button type="success" class="addBtn" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <!-- 上传图片预览对话框 -->
            <el-dialog
                title="图片预览"
                :visible.sync="previewDialogVisible"
                width="50%">
                <img :src="previewFile" alt="" class="previewImg">
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
 // 导入深拷贝组件
import _ from 'lodash'

export default {
    data(){
        return{
            // 默认激活步骤条第一项
            activeIndex:'0',
            // 要添加的表单数据对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_number:0,
                goods_weight:0,
                goods_cat:[],
                // 上传的图片临时路径
                pics:[],
                // 编辑商品内容
                goods_introduce:'',
                attrs:[]
            },
            // 验证规则
            addFormRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ]
            },
            // 分类列表数据对象
            catelist:[],
            cataProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 动态列表参数对象
            manyTablist:[],
            // 静态属性数据列表参数
            onlyTablist:[],
            // 给图片上传添加请求头 token
            headersObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 要上传的图片路径地址数组
            picInfo:[],
            // 上传图片预览的路径
            previewFile:'',
            previewDialogVisible:false
        }
    },
    created(){
        this.getCatelist();
    },
    methods:{
        // 获取分类列表数据
        async getCatelist(){
           const {data:res} = await this.$http.get('categories');
            if(res.meta.status !==200) return this.$message.console.error(('获取分类列表失败'));
            this.catelist = res.data;
            // console.log(this.catelist);
        },
        // 监听 级联选择栏变化，触发这个函数
        handleChange(){
            console.log(this.addForm.goods_cat);
            // 只能选择三级菜单
            if(this.addForm.goods_cat.length !==3){
               return  this.addForm.goods_cat =[];
            }
        },
        // 监听 tab栏切换
        beforeTabLeave(activeName, oldActiveName){
             // console.log('开始的标签：'+ oldActiveName);
            // console.log('结束的标签：'+ activeName);
            
            if(oldActiveName === "0" && this.addForm.goods_cat.length !==3){
               this.$message.info('请选择分类选择栏菜单')
               return false;
            }     
        },
        // 选中的tab 菜单栏
        async checkedTab(){
            console.log(this.activeIndex);
            // this.activeIndex = 1 表示选择了商品参数

            if(this.activeIndex==='1'){
                
                // 获取参数列表
                const {data:res} = await this.$http.get(`categories/${this.cataId}/attributes`,{params:{sel:'many'}
                });
                if(res.meta.status !==200) return this.$message.error('获取参数列表失败');
                // 把字符串转化为数组
                res.data.forEach(item =>{
                    item.attr_vals = item.attr_vals.length ===0 ?[]:item.attr_vals.split(' ');
                })
                this.manyTablist = res.data;
                
                console.log(this.manyTablist);
                
            }else if(this.activeIndex==='2'){
                // 获取静态属性列表
                const {data:res} = await this.$http.get(`categories/${this.cataId}/attributes`,{params:{sel:'only'}
                });
                if(res.meta.status !==200) return this.$message.error('获取静态属性列表失败');
                
                this.onlyTablist = res.data;
                console.log(this.onlyTablist);
                
            }
        },
        // 处理图片预览效果
        handlePreview(file){
            console.log(file);
            // 图片预览路径
            this.previewFile = file.response.data.url;
            this.previewDialogVisible = true;
        },
        // 图片移除操作
        handleRemove(file){
            // 1.先获取图片存放的临时路径
            const filePath = file.response.data.tmp_path
            // 2.根据临时路径查找 findIndex 到对应的索引
            const index = this.addForm.pics.findIndex(path=>path.pic = filePath)
            // 3.调用数组的 splice 方法，把图片路径从图片数组移除
            this.addForm.pics.splice(index,1);
            console.log(this.addForm);
            
        },
        // 监听 图片上传成功后的操作
        uploadSuccess(response){
            // console.log(response); //tmp_path
            // 拼接得到一个图片信息对象
            const picInfo = {pic:response.data.tmp_path};
            this.addForm.pics.push(picInfo)
            console.log(this.addForm.pics);
        },
        // 点击按钮 添加商品
        async addGoods(){
            // 添加商品之前先对表单预验证
            this.$refs.addFormRef.validate(val => {
                if(!val) 
                return this.$message.info('请填写必要的信息项！');
            })
            // 若表单预验证通过 则添加商品逻辑
            // 需要把获取的三级菜单数组格式转变为字符串格式 "goods_cat": "1,2,3"
            // 安装 lodash 这里需要用到lodash.cloneDeep(Obg)方法 深拷贝 addForm 数据对象
            const form = _.cloneDeep(this.addForm);
            form.goods_cat  = form.goods_cat.join(',')

            // 处理动态参数
            this.manyTablist.forEach(item =>{
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                }
                this.addForm.attrs.push(newInfo);
            })
            // 处理静态属性
            this.onlyTablist.forEach(item =>{
                 const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addForm.attrs.push(newInfo);
            })
            form.attrs = this.addForm.attrs;
            console.log(form);

        // 调用后台接口添加商品
        const {data:res} = await this.$http.post('goods',form);
        if(res.meta.status !==201) return this.message.error('添加商品失败');
        // 使用编程式导航
        this.$router.push('/goods')
        }
    },
    computed:{
        // 获取选择框中的选中的三级分类id
        cataId(){
            if(this.addForm.goods_cat.length ===3){
                return this.addForm.goods_cat[2]
            }
            return null;
        }
    }
}
</script>

<style lang="less" scoped>
.checkbox{
    margin: 0 5px 0 0 !important;
}

.previewImg{
    width: 100%;
}

.addBtn{
    margin-top: 15px;
}
</style> 