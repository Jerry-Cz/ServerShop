<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // 清除 sessionStorage 缓存的 token
      window.sessionStorage.clear()
      // 路由重定向跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="stylus" scoped></style>