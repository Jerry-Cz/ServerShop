<template>
    <div>
        <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加商品分类按钮部分 -->
            <el-row>
                <el-col> 
                    <el-button type="success" @click="showCateVisible">添加分类</el-button>
                </el-col> 
            </el-row>

             <!-- 主体表格部分 -->
            <!-- columns 表格各列的配置，selection-type 控制复选框，expand-type 控制是否展开 -->
            <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
                <!-- 是否有效部分 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-circle-check" v-if="scope.row.cat_deleted === false" style="color:green"></i>
                    <i class="el-icon-circle-close" v-else style="color:red"></i>
                </template>
                <!-- 排序部分 -->
                <template slot="order" slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.cat_level===0">标签一</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">标签二</el-tag>
                    <el-tag type="danger" v-else>标签三</el-tag>
                </template>
                <!-- 操作部分 -->
                <template slot="caozuo" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="scope.row" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-selete" @click="scope.row" size="mini">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pagenum"
            :page-size="queryInfo.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCareDialogVisible"
        width="50%" @close="removeCateForm">
        <!-- 添加分类表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
              <el-form-item label="分类名称：">
                  <!-- options 用来指定数据源 props 指定配置对象 -->
                <el-cascader
                expand-trigger="hover"
                v-model="selectedKeys"
                :options="parendCatelist"
                :props="cascderProps"
                @change="parendCateChange" clearable change-on-select> 
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCareDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { async } from 'q';

export default {
    data(){
        return{
            // 查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品列表数据
            catelist:[],
            // 总数据条数
            total:0,
            // 为table指定列的定义
            columns:[{
                label:'分类名称',
                prop:'cat_name' 
            },{
                label:'是否有效',
                type:'template',
                template:'isok',
                align:'center'
            },{
                label:'排序',
                type:'template',
                template:'order',
            },{
                label:'操作',
                type:'template',
                template:'caozuo',
            }],
            // 控制添加分类对话框的显示和隐藏
            addCareDialogVisible:false,
            // 添加分类的请求参数
            addCateForm:{
                // 要添加的分类父级 ID
                cat_pid:0,
                // 要添加的分类名称
                cat_name:'',
                // 要添加的分类层级
                cat_level:0
            },
            // 添加分类名称验证对象
            addCateFormRules:{
                 cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级分类列表数据对象
            parendCatelist:[],
            // 指定级联选择器要配置对象
            cascderProps:{
                value: 'cat_id',
                label: 'cat_name',
                children:'children'
            },
            // 选中的父级 id
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        // 获取分类列表数据
        async getCateList(){
           const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
           if(res.meta.status !==200) return this.$message.error('获取商品列表失败')
           this.catelist =res.data.result;
           this.total = res.data.total;
        //    console.log(res.data);
        },
        // 监听 每页显示多少条数据
        handleSizeChange(pageSize){
            this.queryInfo.pagesize = pageSize;
            this.getCateList();
        },
        // 监听 current 的变化
        handleCurrentChange(pageNum){
            this.queryInfo.pagenum =pageNum;
            this.getCateList();
        },
        // 点击添加分类按钮显示对话框
        showCateVisible(){
            // 先获取父级对话框中的列表在展示对话框
            this.getParentCateList();
            this.addCareDialogVisible = true;
        },
        // 获取父级分类列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2} });
            if(res.meta.status !== 200) return this.$message.error('获取父级分类列表失败');
            this.parendCatelist = res.data;
            //  console.log(this.parendCatelist);
        },
        // 监听父级选择项变化
        parendCateChange(){
            console.log(this.selectedKeys);
            // 如果 selectedKeys 数组中的 length 大于0，证明选中了父级分类
            // 相反说明没有选中任何父级分类
            if(this.selectedKeys.length > 0){
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1],
                // 当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                // 父级分类的id
                this.addCateForm.cat_pid=0;
                // 当前分类的等级赋值
                this.addCateForm.cat_level=0;
            }
        },
        // 点击按钮添加新分类
        addCate(){
            console.log(this.addCateForm);
            // 添加分类之前先预验证
            this.$refs.addCateFormRef.validate(async val =>{
                if(!val) return
                // 发送请求
                const {data:res} = await this.$http.post('categories',this.addCateForm);
                if(res.meta.status !== 201) return this.$message.error('添加分类失败');
                this.$message.success('添加分类成功')
                this.getCateList();
                this.addCareDialogVisible=false;
            })
        },
        // 监听分类对话框的关闭事件、重置表单
        removeCateForm(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys=[];
            this.cat_pid=0;
            this.cat_level=0;
        }
    }
    
}
</script>

<style lang="less" scoped>
    .el-button--success{
        margin-bottom: 10px;
    }
    .el-cascader {
       width: 100%;
    }
</style>