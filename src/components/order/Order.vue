<template>
    <div>
        <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜素框区域 -->
            <el-row>
                <el-col :span="12">
                   <el-input placeholder="请输入内容"  v-model="queryInfo.query"  @clear="getOrderList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            
            <!-- 表单区域 -->
            <el-table :data="orderlist" border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status" width="100">
                    <template slot-scope="scope">
                         <!-- v-if="pay_status === '0' ? '未付款':'已付款'"  -->
                        <el-tag v-if="scope.pay_status === '1'">已付款</el-tag>
                        <el-tag v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-edit" @click="editBox(scope.row)" size="mini">编辑</el-button>
                        <el-button type="info" icon="el-icon-document-add" @click="showBox" size="mini">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改订单对话框 -->
        <el-dialog
            title="修改订单"
            :visible.sync="editDialogVisible"
            width="50%" @close="resetFieldsForm">
            <!-- 商品信息表单区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="editOrder1">
                    <el-cascader :options="citydata" v-model="editForm.iditOrder1" expand-trigger="hover">
                    </el-cascader>
                </el-form-item>
                  <el-form-item label="详细地址" prop="editOrder2">
                    <el-input v-model="editForm.editOrder2"></el-input>
                </el-form-item>
            </el-form>    
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 显示物流信息对话框 -->
        <el-dialog
            title="物流信息"
            :visible.sync="showDialogVisible"
            width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
// 当如级联选择菜单数据
import Citydata from './citydata.js'

export default {
    data(){
        return{
            // 请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:6
            },
            // 订单列表数据对象
            orderlist:[],
            // 总数据条数
            total:0,
            // 控制对话框显示和隐藏
            editDialogVisible:false,
            // 要编辑的表单数据
            editForm:{
                editOrder1:[],
                editOrder2:''
            },
            editFormRules:{
                 editOrder1: [
                    { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                 editOrder2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ],
            },
            // 选择框对象
            citydata:Citydata,
            // 隐藏物流信息对话框
            showDialogVisible:false,
            // 查看物流信息数据
            progressInfo:[]
        }
    },
    created(){
        this.getOrderList();
    },
    methods:{
        // 获取订单列表
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo});        
            if(res.meta.status !== 200) return this.$message.error('获取订单列表失败');
            this.orderlist = res.data.goods;
            this.total = res.data.total;
            // console.log(this.orderlist);
            // console.log(this.total);
        },
        // 监听 每页显示多少条数据
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        // 监听 选中的页码
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum;
            this.getOrderList();
        },
        // 点击按钮 修改订单
        editBox(){
            this.editDialogVisible = true;
        },
        // 监听 关闭事件重置对话框
        resetFieldsForm(){
            this.$refs.editFormRef.resetFields();
        },
        // 点击按钮 查看物流信息
        async showBox(){

            const {data:res} = await this.$http.get('/kuaidi/1106975712662');
            if(res.meta.status !==200) return this.$message.error('获取物流信息失败');
            // this.$message.success('获取物流信息成功');
            this.progressInfo = res.data;
            console.log(this.progressInfo);

            this.showDialogVisible = true;
        }
    }
}
</script>

<style lang="less" scoped>
    .el-cascader{
        width: 100%;
    }
    // 导入 timeline 组件样式
    @import '../../plugins/timeline/timeline.css';
    @import '../../plugins/timeline-item/timeline-item.css';
</style>