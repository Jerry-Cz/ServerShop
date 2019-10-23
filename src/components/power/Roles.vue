<template>
    <div>
         <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加角色按钮部分 -->
            <el-row>
                <el-button type="warning" @click="addRoles">添加角色</el-button>
            </el-row>
            <!-- 主体内容部分， stripe 是隔行变色 -->
             <el-table :data="rolesList" border stripe>
                <!-- 展开列 expand -->
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-row :class="['bottBor',i===0 ?'topBor':'', 'itemCenter']" v-for="(itme1 ,i) in scope.row.children" :key="itme1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="8">
                                <el-tag type="success" closable @close="removeById(scope.row,itme1.id)">{{itme1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="16">
                                <el-row :class="[i2===0 ? '':'topBor', 'itemCenter']" v-for="(itme2,i2) in itme1.children" :key="itme2.id">
                                    <el-col :span="6" >
                                        <!-- 二级权限 -->
                                        <el-tag  type="warning" closable @close="removeById(scope.row,itme2.id)">{{itme2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <!-- close 当关闭 Tag 标签时触发的事件 -->
                                        <el-tag type="danger" v-for="item3 in itme2.children" :key="item3.id" closable @close="removeById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <!-- {{scope.row}} -->
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 index -->
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column  label="操作" width="300px">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" round size="mini" @click="editRolesData(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" round size="mini" @click="removeRolesData(scope.row)">删除</el-button>
                        <el-button type="primary" icon="el-icon-s-tools" round size="mini" @click="showSetPower(scope.row)" >分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="rightDialogVisible"
        width="50%" @close="rightsFields">
        <!-- 树形控件 -->
        <!-- show-checkbox 是多选框,node-key 是每个树节点用来作为唯一标识的属性, default-expand-all 是否默认展开所有节点 -->
        <!-- default-checked-keys 默认勾选的节点的 key 的数组 -->
        <el-tree :data="rightlist" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer" >
            <el-button @click="rightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allRights">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editDataVisible"
            width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDataVisible = false">取 消</el-button>
                <el-button type="primary" @click="aditDataFrom">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 添加角色对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDataVisible"
            width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDataVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDataFrom">确 定</el-button>
            </span>
        </el-dialog>
     </div>
</template>

<script>
export default {
    data(){
        return{
            // 所有角色列表数据
            rolesList:[],
            // 控制分配权限对话框的显示
            rightDialogVisible:false,
            // 所有权限列表数据
            rightlist:[],
            // 树形控件绑定的数据对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 默认选中的节点id 数组
            defKeys:[],
            // 分配权限的id
            roleId:'',
            // 控制编辑对话框显示和隐藏
            editDataVisible:false,
            // 要编辑的表单数据
            editForm:{
                id:'',
                roleName:'',
                roleDesc:''
            },
            // 验证规则
            editFormRules:{
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                  roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            addDataVisible:false,
            // 添加用户请求参数
            addForm:{
                roleId:'',
                roleName:'',
                roleDesc:' '
            },
            // 验证规则
            addFormRules:{
                 roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ]
            }
        }
    },
   
    created(){
        this.getRolesUser()
    },
    methods:{
        // 获取角色列表对象
        async getRolesUser(){
           const {data:res} = await this.$http.get('roles');
           if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
           this.rolesList=res.data;
        },

        // 根据id删除三级权限,roleId.id 是角色id、 rightId 是权限id
        async removeById(roleId,rightId){
             const resConfirm = await this.$confirm('此操作将永久删除三级权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(resConfirm !== 'confirm') return this.$message.info('已取消删除')
            const {data:res} = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`);
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('删除失败')
            // 把获取的新数据重新赋值给角色
            roleId.children = res.data;
        },

        // 点击分配权限按钮弹出对话框
        async showSetPower(role){
            // 获取要分配权限的id
             this.roleId = role.id;
            // 递归获取三级节点的 Id
            this.getRolesKeys(role,this.defKeys);
            // 显示对话框
            this.rightDialogVisible = true;
            // 获取权限数据对象
            const {data:res} = await this.$http.get('rights/tree');
            if(res.meta.status !==200) return this.$message.error('获取权限列表失败');
            this.rightlist = res.data;
            // console.log(this.rightlist);
        },

        // 通过递归的形式，获取角色下所有三级权限的 id，保存到defKeys 数组中
        getRolesKeys(node,arr){
            // 若当前node节点不包括 children 属性，则是三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getRolesKeys(item,arr)
            });
        },
        // 监听 分配权限对话框的关闭事件，重置分配权限列表数据
        rightsFields(){
            this.defKeys=[];
        },
        // 点击分配权限功能
        // getHalfCheckedKeys 若节点可被选择,则返回目前半选中的节点所组成的数组,getCheckedKeys 若节点可被选择
        async allRights(){
            const keys = [
                ...this.$refs.treeRef.getHalfCheckedKeys(),
                ...this.$refs.treeRef.getCheckedKeys() //... 表示展开状态
            ]
            // console.log(keys);
            const idStr = keys.join(',');
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
            if(res.meta.status !== 200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功');
            // 更新列表
            this.getRolesUser();
            // 隐藏对话框
            this.rightDialogVisible=false;
        },
        // 点击按钮 渲染要编辑的角色
        editRolesData(row){
            console.log(row);
            this.editForm.id = row.id;
            this.editForm.roleName = row.roleName;
            this.editForm.roleDesc = row.roleDesc;
            this.editDataVisible = true;

        },
        // 点击按钮实现修改用户功能
        async aditDataFrom(){
            // 修改角色之前对表单预验证
            this.$refs.editFormRef.validate(val => {
                if(!val) return this.$message.info('请填写要修改的内容')
            });
            // 请求后台修改角色数据接口
            console.log(this.editForm.id);
            
            const {data:res} = await this.$http.put(`roles/${this.editForm.id}`,this.editForm);
            if(res.meta.status !== 200) return this.$message.error('修改角色失败');
            this.$message.success('修改角色成功');
            this.getRolesUser();
            this.editDataVisible = false;
        },
        // 点击按钮 删除角色
        async removeRolesData(row){
            console.log(row);
            // 是否删除确认弹框
            const responeConfirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(error => error);
            if(responeConfirm !== 'confirm') return this.$message.info('已取消删除操作');
            // 请求后台删除角色接口
            const { data:res } = await this.$http.delete(`roles/${row.id}`);
            if(res.meta.status !== 200) return this.$message.error('删除角色失败');
            this.$message.success('删除角色成功');
            this.getRolesUser();
        },
        // 点击按钮弹出添加角色对话框
         addRoles(){
             this.addDataVisible = true;
        },
         // 点击按钮 添加角色
        addDataFrom(){
            // 添加角色之前对表单预验证
            this.$refs.addFormRef.validate(async  val => {
                if(!val) return this.$message.info('请填写要修改的内容');
                // 请求添加角色接口
                const {data:res} = await this.$http.post('roles',this.addForm);
                if(res.meta.status !== 200) this.$message.error('添加角色失败');
                this.$message.success('添加角色成功');
                this.getRolesUser();
                this.addDataVisible = false;
            });
        }
    }
}
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 10px;
    }
    // 一级权限的上下边框
    .topBor {
        border-top: 1px solid #ddd;
    }
    .bottBor{
        border-bottom: 1px solid #ddd;
    }
    .itemCenter{
        display: flex;
        align-items: center;
    }
</style>