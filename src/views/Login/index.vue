<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="formData.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="formData.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="doLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const FORMDATA_KEY = 'formData'
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        remember: false
      },
      rules: {
        // 使用正则表达式验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '用户名至少4个字符，最多16个字符，且只能是字母、数字、下划线、减号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_-]{6,18}$/, message: '密码至少6个字符，最多18个字符，且只能是字母、数字、下划线、减号', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 从localStorage中获取数据
    const formData = JSON.parse(localStorage.getItem(FORMDATA_KEY))
    if (formData) {
      this.formData.username = formData.username
      this.formData.password = formData.password
    }
  },
  methods: {
    doLogin() {
      console.log(this.formData)
      const { username, password, remember } = this.formData
      this.$refs.form.validate(async(valid) => {
        if (!valid) return

        debugger
        await this.$store.dispatch('user/userLoginAction', { username, password })
        if (remember) {
          localStorage.setItem(FORMDATA_KEY, JSON.stringify({ username, password }))
        } else {
          localStorage.removeItem(FORMDATA_KEY)
        }
        // 获取redirect参数、上次访问的页面
        const redirect = this.$route.query.redirect
        if (redirect) {
          this.$router.push(redirect)
        } else {
          this.$router.push({ path: '/' })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
