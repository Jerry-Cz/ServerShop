<template>
    <div>
        <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card >
            <!-- 搜索框区域和添加用户 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <!-- clearable 可清空的输入框, clear 在点击由 clearable 属性生成的清空按钮时触发-->
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query"  @clear="getUserList" clearable> 
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="success" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->

            <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名 -->
            <el-table :data="UserList" border> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                <!-- 作用域插槽 --> <!-- change	监听 switch 状态发生变化时的回调函数 -->
                    <template slot-scope="scope">
                        <!--  scope.row 获取当前行数据 -->
                        <!-- {{scope.row}} -->
                        <!-- 绑定v-model到一个Boolean类型的变量 -->
                        <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditVisible(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="romoveUser(scope.row.id)">

                        </el-button>
                        <!-- 分配角色按钮 -->
                        <!-- enterable	鼠标是否可进入到 tooltip 中 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="bottom-end" :enterable="false">
                            <el-button type="danger" icon="el-icon-setting" size="mini" circle @click="showRoles(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 6, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 添加用户对话框 -->
            <!-- 关闭对话框触发 close 事件 -->
            <el-dialog title="添加用户" :visible.sync="dialogVisible"  width="50%" @close="resetFieldsUser">
                <!-- 内容部分 -->
                <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addUser.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addUser.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addUser.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addUser.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUsers">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑用户对话框 -->
            <el-dialog
                title="编辑用户"
                :visible.sync="editVisible"
                width="50%" @close="editFields">
                <!-- 内容主体部分 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                    <el-form-item label="用户名" >
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 按钮部分 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色对话框 -->
            <el-dialog
                title="分配角色"
                :visible.sync="setRolesVisible"
                width="40%" @close="rolesResetFields">
                <div>
                    <p>当前用户：{{rolesData.username}}</p>
                    <p>当前角色：{{rolesData.role_name}}</p>
                    <p>分配新角色：
                        <el-select v-model="rolesId" placeholder="请选择">
                            <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRolesVisible = false">取 消</el-button>
                    <el-button type="primary" @click="savaRolesInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { async } from 'q';
export default {
    // data() 代表当前组件的私有数据
    data(){
        // 自定义验证邮箱规则
        var checkEmail = (rules,value,callback) =>{
            // 验证邮箱的正则表达式
            const resEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(resEmail.test(value)) return callback();
            callback(new Error('请输入合法的邮箱'))
        }
        // 自定义验证手机号规则
        var checkMobile =(rules,value,callback) =>{
            const checkMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/
            if(checkMobile.test(value)) return callback();
            callback(new Error('请输入正确的手机号'))
        }
        return{
            // 获取用户参数
            queryInfo:{
                query:'',
                // 当前页码
                pagenum:1,
                // 每页显示多少条数据
                pagesize:2
            },
            UserList:[],
            total:0,
            // 隐藏添加用户对话框
            dialogVisible:false,
            // 要添加的用户对象
            addUser:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户的验证规则
            addUserRules:{
                 username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                email: [
                   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                   // 调用自定义验证规则
                   { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                   {validator:checkMobile,trigger:'blur'}
                ]
            },
            // 隐藏编辑用户对话框
            editVisible:false,
            // 查询到的用户对象
            editForm:{ },
            // 添加用户的验证规则
            editFormRules:{
                email: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                // 调用自定义验证规则
                   { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator:checkMobile,trigger:'blur'}
                ]
            },
            // 控制分配角色对话框的显示和隐藏
            setRolesVisible:false,
            // 需要被分配角色的信息
            rolesData:{},
            // 所有的角色列表
            rolesList:[],
            // 要分配角色的id
            rolesId:''
        }
    },
    created(){ // 生命周期函数
        this.getUserList()
    },
    // methods 是处理函数
    methods:{
        // 获取用户列表数据
        async getUserList(){
         const {data:res} = await this.$http.get('users',{params:this.queryInfo});
         if(res.meta.status !== 200) return this.$message.error('获取用户列表失败!');
         this.total = res.data.total;
         this.UserList = res.data.users;
        //  console.log(res);
        },
        // 监听 每页显示的条数
        handleSizeChange(newSize){
            // console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        // 监听 当前选中的页码
        handleCurrentChange(newCurrent){
            // console.log(newCurrent);
            this.queryInfo.pagenum = newCurrent;
            this.getUserList();
        },
        // 监听 switch 开关状态的变化
        async userChange(userInfo){
            // console.log(userInfo);
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
            if(res.meta.status !== 200){
                userInfo.mg_state = !userInfo.mg_state;
                return this.$message.error('更新状态失败！');
            } 
            this.$message.success('更新状态成功')
        },
        // 监听对话框关闭时， resetFields() 重置表单
        resetFieldsUser(){
            this.$refs.addUserRef.resetFields();
        },
        //  添加用户功能
        //  validate() 表单预校验功能
        addUsers(){
            this.$refs.addUserRef.validate(async val =>{   
                if(!val) return;
                // 预校验通过可以添加用户请求
                const {data:res} = await this.$http.post('users',this.addUser);
                // console.log(res);
                if(res.meta.status !== 201) return this.$message.error('添加用户失败！');
                this.$message.success('添加用户成功！');
                this.dialogVisible = false; // 添加成功后隐藏会话框
                // 更新数据
                this.getUserList();
            });

        },
        // 显示编辑用户对话框
        async showEditVisible(id){
            // 点击编辑按钮显示会话框
            this.editVisible = true;
            // 通过id 获取要编辑的用户的信息
            const {data:res} = await this.$http.get('users/'+id);
            //  console.log(res);
            if(res.meta.status !== 200) return this.$message.error('查询数据失败！');
            // 把数据赋值给 editList 数组
            this.editForm =res.data;
        },
        // 监听 关闭按钮重置表单数据
        editFields(){
            this.$refs.editFormRef.resetFields();
        },
        // 修改用户数据并提交
        editUserInfo(){
            // 提交数据之前先对数据 validate()预验证
            this.$refs.editFormRef.validate(async val =>{
            // console.log(val);
            if(!val) return;
            // 预验证通过可以向后台发起编辑请求
            const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                email:this.editForm.email,
                mobile:this.editForm.mobile
            });
            if(res.meta.status !==200) return this.$message.error('修改数据失败！');
            this.$message.success('修改数据成功！');
            this.editVisible = false;
            this.getUserList();
            })
        },
        // 删除用户数据功能
         async romoveUser(id){
           const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch( error => error )
          
            // 如果点击取消删除按钮返回结果是字符串 cancel
            // 如果点击确定删除按钮返回结果是字符串 confirm
            if(result !== "confirm"){
                return this.$message.info('已成功取消删除')
            }
            const {data:res} = await this.$http.delete('users/'+id);
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('删除用户失败！')
            this.$message.success('删除用户成功！');
            this.getUserList();
        },
        // 展示角色分配对话框
        async showRoles(rolesData){
            this.rolesData=rolesData;
            // console.log(this.rolesData);
            // 在显示对话框之前获取可以分配的所有角色
            const {data:res } = await this.$http.get('roles')
            if(res.meta.status !== 200) return $message.error('获取角色列表失败')
            // 把获取的角色列表赋值给 rolesList 数组
            this.rolesList = res.data;
            this.setRolesVisible=true;
        },
        // 点击按钮 实现角色分配功能
        async savaRolesInfo(){
            // 判断是否选择了要分配的角色
            if(!this.rolesList) return this.$message.info('请选择要分配的角色')

            const {data:res} = await this.$http.put(`users/${this.rolesData.id}/role`,
            {rid:this.rolesId});
            if(res.meta.status !==200) return $message.error('角色分配失败');
            this.$message.success('分配角色成功')
            this.getUserList();
            this.setRolesVisible=false;
        },
        // 监听 对话框关闭事件重置对话框
        rolesResetFields(){
            this.rolesData='';
            this.rolesId='';
        }
    }
}
</script>

<style lang="less" scoped>
    .el-pagination{
        margin-top: 15px;
    }
</style>