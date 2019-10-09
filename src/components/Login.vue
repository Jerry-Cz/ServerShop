<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <!-- 过 rules 属性传入约定的验证规则，并将 el-form-item 的 prop 属性设置为需校验的字段名即可 -->
      <el-form
        ref="formRef"
        :model="loginForm"
        label-width="0px"
        class="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名部分 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码部分 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮部分 -->
        <el-form-item class="loginBtn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { async } from 'q';
export default {
  data() {
    return {
      // 登录表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证表单的规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      // console.log(this);
      this.$refs.formRef.resetFields()
    },
    login() {
      // validate 对整个表单进行校验的方法，参数为一个回调函数
      this.$refs.formRef.validate(async vaild => {
        // console.log(vaild);
        if (!vaild) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        //  console.log(res);
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // 1.将登录成功之后的token，保存到客户端的sessionStorage中
        // 项目中除了登录之外的其他API接口都必须登录之后才能访问
        // token 只只在当前网站打开期间生效，所以将token 保存sessionStorage中
        // console.log(res);
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.loginForm {
  position: absolute;
  bottom: 0px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.loginBtn {
  display: flex;
  justify-content: flex-end;
}
</style>