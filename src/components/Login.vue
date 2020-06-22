<template>
    <div class="login_container">
      <div class="login_box">
        <!--头像区--->
        <div class="login_avatar">
          <img src="../assets/logo.png" alt="">
        </div>
        <!--登录区--->
        <el-form ref="loginFormRefs" class="login_form" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-mine_fill"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-lock-fill" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // 重置表单
      console.log(this) // 组件实例
      this.$refs.loginFormRefs.resetFields()
    },
    // 表单预验证
    login () {
      this.$refs.loginFormRefs.validate(async val => {
        // 验证是否符合规则
        if (!val) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        // 验证是否登录成功
        if (res.meta.status !== 200) return this.$Message.error('登录失败')
        this.$Message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #4a5d41;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);

  .login_avatar{
    width: 130px;
    height: 130px;
    background-color: #fff;
    position: absolute;
    border:1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 5px #ddd;
    left:50%;
    transform:translate(-50%,-50%);
    img{
      width: 100%;
      height: 100%;
      border:1px solid #eee;
      border-radius: 50%;
    }
  }
  .login_form{
    position: absolute;
    width: 100%;
    bottom:0;
    padding:0 20px;
    box-sizing: border-box;
    .btns{
      display:flex;//灵活的盒子
      justify-content: center;
    }
  }
}
</style>
