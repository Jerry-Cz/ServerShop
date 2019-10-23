<template>
  <el-container class="homeCont">
    <!-- 头部区域 -->
      <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            <span>TT乐购后台管理系统</span>
        </div>
         <el-button type="danger" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏部分 -->
        <el-aside :width='flag ? "66px":"200px"'>
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- unique-opened 是否只保持一个子菜单的展开,默认为false -->
          <!-- collapse 是否水平折叠 -->
          <!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
          <!-- default-active	当前激活菜单的 index	类型为string -->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
          :collapse=flag :collapse-transition="false" :router="true" :default-active="activePate">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + children.path" v-for="children in item.children" :key="children.id" @click="navState('/' + children.path)">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{children.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu> 
          </el-menu>
        </el-aside>
        <!-- 右边内容部分 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
   
</template>

<script>
export default {
  data(){
      return{
        // 左边菜单数据
        menulist:[],
        iconsObj:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
        },
        flag:false,
        // 被激活的链接地址
        activePate:''
      }
    },
  created(){ //生命周期
    this.getMenuList(),
    this.activePate =window.sessionStorage.getItem('active')
  },
  methods: {
    // 退出登录功能
    logout() {
      // 清除 sessionStorage 缓存的 token
      window.sessionStorage.clear()
      // 路由重定向跳转到登录页面
      this.$router.push('/login')
    },
    // 获取侧边栏接口数据
    async getMenuList() {
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status !==200) return this.$message.error(res.meta.$message);
      this.menulist = res.data;
      // console.log(res);
    },
    // 侧边栏折叠和展开
    toggleCollapse(){
      this.flag=!this.flag;
    },
    navState(activePate){
      // 保存当前点击的路径
      window.sessionStorage.setItem('active',activePate);
      this.activePate = activePate;
    }
  }
}
</script>

<style lang="less" scoped>
.homeCont{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  // 左右贴边对齐
  justify-content: space-between;
  padding-left: 10px;
  color: #fff;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
  border-right: 0px;
}
}
.el-main{
  background-color: #EAEDF1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
