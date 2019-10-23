<template>
    <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card>
       <el-table :data="rightsList" border style="width: 100%">
            <el-table-column prop="authName" label="权限说明" width="180"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级" width="180">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 0">一级</el-tag>
                    <el-tag type="success" v-else-if="1">二级</el-tag>
                    <el-tag type="info" v-else-if="2">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 权限列表
            rightsList:[]
        }
    },
    created(){ // created 声明周期函数
        this.getRightsList();
    },
    methods:{
        async getRightsList(){
            // list 列表显示权限
           const {data:res} = await this.$http.get('rights/list');
           if(res.meta.status !==200) return this.$message.error('获取用户权限失败');
           this.rightsList = res.data;
        //    console.log(this.rightsList);
        }
    }
}
</script>

<style lang="less" scoped>

</style>