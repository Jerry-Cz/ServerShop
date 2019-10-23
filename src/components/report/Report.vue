<template>
    <div>
        <!-- 面包屑区域 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
             <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style="width: 770px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'
// 导入 lodash 用于两个对象的合并
import _ from 'lodash'

export default {
    data(){
        return{
           options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },
    created(){

    },
    // 页面加载完毕执行函数里代码
    async mounted(){
         // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const {data:res} = await this.$http.get('reports/type/1');
        if(res.meta.status !==200) return this.$message.error('获取折现图数据失败');

        // 4.指定图表的配置项和数据
        // 获取接口数据需要 用lodash中 merge方法 合并对象options
           const result =  _.merge(res.data,this.options)

        // 5.使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>

</style>