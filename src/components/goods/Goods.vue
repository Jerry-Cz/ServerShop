<template>
    <div>
        <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索框和添加商品区域 -->
           <el-row :gutter="20">
               <el-col :span="8">
                    <!-- 搜索框部分 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
               </el-col>
               <el-col :span="4">
                    <el-button type="success" @click="addGoods">添加商品</el-button>
               </el-col>
           </el-row>

           <!-- table 表格区域 -->
           <el-table :data="goodsList" border stripe>
               <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="商品时间" prop="add_time" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time|dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240px">
                    <template slot-scope="scope">
                        <el-button type="info" icon="el-icon-edit" size="mini" @click="editById(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
           </el-table>

           <!-- 分页区域 -->
           <!-- 使用了size-change和current-change事件来处理页码大小和当前页变动时候触发的事件 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
            </el-pagination>
        </el-card>

        <!-- 商品编辑按钮对话框 -->
        <el-dialog
            title="商品信息"
            :visible.sync="showDialogVisible"
            width="50%" @close="resetFieldsForm">
            <!-- 商品信息表单区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                 <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="editForm.goods_price"></el-input>
                </el-form-item>
                 <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="editForm.goods_weight"></el-input>
                </el-form-item>
            </el-form>    
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEditForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            // 商品列表数据对象
            goodsList:[],
            // 总数据条数
            total:0,
            // 控制商品编辑对话框隐藏
            showDialogVisible:false,
            // 要配置的参数
            editForm:{
                // 商品id
                goods_id:'',
                // 商品名称
                goods_name:'',
                // 商品价格            
                goods_price:'',
                // 商品数量            
                goods_number:'',
                // 商品重量           
                goods_weight:'',
                // 商品时间
                add_time:'',
                cat_id:''
            },
            // 验证规则
            editFormRules:{  
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
               goods_weight: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        // 获取所有商品列表数据
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
            if(res.meta.status !== 200) return this.$message.error('获取商品列表失败');
            this.goodsList = res.data.goods;
            this.total =res.data.total;

            // console.log(this.goodsList);
            // console.log(this.total);
        },
        // 获取每页多少条数据
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        // 当前显示第几条数据
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },
        // 点击按钮 编辑商品
        async editById(row){
            console.log(row);
            
            // 把原始数据渲染到编辑框里
            // console.log(row.goods_name);
            this.editForm.goods_name = row.goods_name;
            this.editForm.goods_price = row.goods_price;
            this.editForm.goods_weight = row.goods_weight;
            this.editForm.add_time = row.add_time;
            this.editForm.goods_id = row.goods_id;
            this.editForm.cat_id = row.cat_id

            this.showDialogVisible = true;
        },
        // 监听关闭事件 重置表单
        resetFieldsForm(){
            this.$refs.editFormRef.resetFields();
        },  
        // 点击按钮 完成编辑功能
         addEditForm(){
                // 添加参数之前先预验证表单
                this.$refs.editFormRef.validate(async val => {
                // console.log(val); //false
                if(!val) return

                const {data:res} = await this.$http.put('goods/'+this.editForm.goods_id,
                {
                    goods_name:this.editForm.goods_name,
                    goods_price:this.editForm.goods_price,
                    goods_number:this.editForm.goods_number,
                    goods_number:this.editForm.goods_weight,
                    goods_cat:this.editForm.cat_id
                });
                console.log(res);
                
                if(res.meta.status !== 201) return this.$message.error('编辑商品失败');
                this.$message.success('编辑商品成功');
                this.getGoodsList();
            })
        },    
        // 点击按钮 删除商品
        async removeById(id){
            // 确认删除弹框
            const resConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(error => error);
             // 如果确定删除返回字符串 confirm
            // 取消删除返回字符串 cancel
            if(resConfirm !== 'confirm') return this.$message.info('已取消删除');
            const {data:res} = await this.$http.delete('goods/'+id);
            if(res.meta.status !== 200) return this.$$message.error('删除商品失败');
            this.$message.success('删除商品成功');
            this.getGoodsList();
        },
        // 点击按钮 添加商品
        addGoods(){
            this.$router.push('/goods/add');
        }

    }
}
</script>

<style lang="less" scoped>
 
</style>