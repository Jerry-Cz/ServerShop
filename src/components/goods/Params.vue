<template>
    <div>
        <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告提示框 -->
            <el-alert title="提示：只能选择第三级分类" type="warning" :closable="false">
            </el-alert>

            <!-- 级联选择框区域 -->
            <el-row class="row-marginTop">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 级联选择框 -->
                       <!-- expand-trigger="hover" 鼠标移入显示, clearable 清除-->
                     <el-cascader
                        expand-trigger="hover"
                        v-model="selectedCateKeys"
                        :options="paramslist"
                        :props="cateProps"
                        @change="paramsHandleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- Tabs 标签选择页区域 -->
              <el-tabs v-model="activeName"  @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="mini" type="success" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <!-- 获取展开行动态参数 -->
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="removeTagData(i,scope.row)">{{item}}</el-tag>
                          
                                <!-- 动态编辑标签 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>

                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditVisible(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delect" size="mini"
                                @click="deleteVisible(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态参数面板 -->
                <el-tab-pane label="静态参数" name="only">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                     <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <!-- 展开行静态属性参数 -->
                             <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="removeTagData(i,scope.row)">{{item}}</el-tag>
                            
                                <!-- 动态编辑标签输入框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditVisible(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delect" size="mini"
                                @click="deleteVisible(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 点击添加参数按钮弹出对话框 -->
        <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="50%">
            <!-- 添加参数表单部分 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParamsData">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 点击修改参数按钮弹出对话框 -->
        <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="50%">
            <!-- 添加参数表单部分 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParamsData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 分类列表数据对象
            paramslist:[],
            // 级联选择框的配置对象
            cateProps:{
                value: 'cat_id',
                label: 'cat_name',
                children:'children'
            },
            // 级联选择框绑定的 id数组
            selectedCateKeys:[],
            // 被激活的标签名称
            activeName:'many',
            // 获取的动态参数
            manyTableData:[],
            // 获取的静态参数
            onlyTableData:[],
            // 隐藏添加参数和属性对话框
            addDialogVisible:false,
            // 添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            // 参数表单验证规则
            addFormRules:{
                attr_name: [
                    { required: true, message: "请输入要添加的参数", trigger: 'blur' }
                ]
            },
            // 隐藏编辑对话框
            editDialogVisible:false,
            editForm:{
                attr_name:''
            },
            editFormRules:{
                attr_name: [
                    { required: true, message: "请输入要修改的参数", trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getParamsList();
    },methods:{
        // 获取选择框分类列表
        async getParamsList(){
           const {data:res} = await this.$http.get('categories',{params:{type:3}});
           if(res.meta.status !== 200) this.$message.error('获取分类列表失败');
            // this.$message.success('获取分类列表成功')
           this.paramslist = res.data;
           console.log(this.paramslist);
        },
        // 监听 级联选择框的改变会触发这个函数
        paramsHandleChange(){    
            this.getParamsData();
        },
        // 点击按钮选择对应的标签数据
        handleTabClick(){
            console.log(this.activeName); 
            this.getParamsData();
        },
        // 获取分类列表参数数据
        async getParamsData(){
            // 只能选中三级分类id 数组
            if(this.selectedCateKeys.length !==3){
                this.selectedCateKeys=[]; 
                // 清空动态参数
                this.manyTableData=[];
                // 清空静态属性
                this.onlyTableData=[];
                return
            }
             
            console.log(this.selectedCateKeys);

            // 选择三级分类显示对应的数据参数
            // console.log(this.cateId);
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
            {params:{sel:this.activeName}
            });
            if(res.meta.status !==200) return this.$message.error('分类参数获取失败');

            // 获取表单展开列参数对象
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[];
                  // 隐藏动态编辑框
                item.inputVisible=false
                // 文本框输入的内容
                item.inputValue=''
            })
            console.log(res.data);

            // 判断获取的数据类型
            if(this.activeName === 'many'){
                this.manyTableData =res.data;
            }else{
                this.onlyTableData =res.data;
            }
        },
        // 点击确认按钮 添加参数
        addParamsData(){
            // 添加参数之前先预验证表单
            this.$refs.addFormRef.validate(async val => {
                // console.log(val); //false
                if(!val) return
                // console.log(this.cateId);
                // console.log(this.addForm.attr_name);
                // console.log(this.activeName);
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName});
                // console.log(res);
                if(res.meta.status !== 201) return this.$message.error('添加参数失败');
                this.$message.success('添加参数成功');
                this.getParamsData();
                this.addDialogVisible=false;
            })
        },
        // 点击编辑按钮 弹出对话框
        async showEditVisible(attr_id){
            // 根据 ID 查询相应参数,赋值给编辑框
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_se:this.activeName}
            });
            if(res.meta.status !==200) return this.$message.error('查询参数失败');
            this.editForm = res.data;

            this.editDialogVisible = true;
        },
        // 点击按钮 修改参数信息
        editParamsData(){
              // 添加参数之前先预验证表单
            this.$refs.editFormRef.validate(async val => {
                // console.log(val); //false
                if(!val) return
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName});
                if(res.meta.status !== 200) return this.$message.error('编辑参数失败');
                this.$message.success('编辑参数成功');
                this.getParamsData();
                this.editDialogVisible = false;
            })
        },
        // 点击按钮 删除参数
        async deleteVisible(attr_id){
            const resConfirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err => err);

            // console.log(resConfirm);
            // 如果确定删除返回字符串 confirm
            // 取消删除返回字符串 cancel
            if(resConfirm !== 'confirm') return this.$message.info('已取消删除');
            
            // 删除参数请求
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
            if(res.meta.status !== 200) return this.$message.error('删除参数失败');
            this.$message.success('删除参数成功')
            this.getParamsData();
        },
        // 鼠标失去焦点或摁下Enter都会触发函数
        handleInputConfirm(row){
            // console.log('ok');
            if(row.inputValue.trim().length ===0){
                row.inputValue='',
                row.inputVisible = false
                return
            }
            // 如果输入的内容
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue='';
            // 调用数据流操作函数
            this.saveAttrVals(row);

            row.inputVisible = false;
        },
        // 把对 attr_vals 操作保存到数据库中
        async saveAttrVals(row){  
            // 发送编辑提交参数请求
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            });
            if(res.meta.status !==200) return this.$message.error('修改标签失败');
            this.$message.success('修改标签成功');
            this.getParamsList();
        },
        // 点击标签显示输入框
        showInput(row){
            row.inputVisible = true;
            // 让文本框自动获得焦点
            // $nextTick 方法的作用就是当页面上的元素被重新渲染后，指定回调函数代码
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除参数标签
        removeTagData(i,row){
            row.attr_vals.splice(i,1);
            this.saveAttrVals(row);
        }
    },
    // 使用计算属性 判断级联选择数组长度是否为3
    computed:{
        // 如果按钮被禁用 返回true，否则为false
        isBtnDisabled(){
            if(this.selectedCateKeys.length !== 3){
            return true
        } 
        return false
        },
        // 当前选中三级分类的id
        cateId(){
            if(this.selectedCateKeys.length === 3){
               return this.selectedCateKeys[2];
        }
        return null;        
        },
        // 添加参数对话框标题
        titleText(){
        if(this.activeName=='many'){
        return '动态参数'
        }else{
        return '静态属性'
        }
        }
    }
}
</script>

<style lang="less" scoped>
    .row-marginTop{
        margin-top: 10px;
    }
    .el-tag{
        margin: 0 10px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>