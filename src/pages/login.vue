<template lang="html">
  <div class="login">
    <vue-particles
      class="login-bg"
      color="#39AFFD"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#8DD1FE"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    />
    <div class="login-box" @keyup.enter="login('form')">
      <div class="login-box-title">EXAMPLE</div>
      <div class="login-box-from">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-key" show-password></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-checkbox v-model="ldap" >使用域账号登陆</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" :loading="loading" style="width: 100%" @click.native="login('form')">立即登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
import types from '../store/mutation-types'
import  auth from '../common/auth'
import * as sysApi from '../services/sys'
import {mapActions, mapMutations} from 'vuex'

export default {
  name: 'login',
  data() {
    return {
      pwdShow: "password",
      loading: false,
      ldap: false,
      form: {
        username: '',
        password: '',
        is_ldap: 0,
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
    }
  },
  components: {},
  methods: {
    ...mapMutations({
      setUserInfo: types.SET_USER_INFO
    }),
    ...mapActions({
      loadMenuList: 'loadMenuList'
    }),
    login(formName){
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.loading = false;
          return false;
        }

        this.loading = true;
        let redirectUrl = '/task';
        if (this.$route.query && this.$route.query != null && this.$route.query.redirect && this.$route.query.redirect != null) {
          redirectUrl = this.$route.query.redirect;
        }
        this.form.is_ldap = this.ldap ? 1 : 0;
        sysApi.login(this.form).then(res => {
          this.loginSuccess({data:res.data, redirectUrl})
        })
        this.loading = false;
      });
    },
    loginSuccess({data,redirectUrl}){
      auth.login(data.token);
      delete data.password;
      window.localStorage.setItem("user", JSON.stringify(data));
      this.setUserInfo(data);
      this.loadMenuList();
      redirectUrl && this.$router.push({path: redirectUrl});
    }
  }
}
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../static/img/login.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #cccccc;
    position: relative;
  }

  .login-box-title {
    line-height: 50px;
    font-size: 20px;
    color: #dddddd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #ffffff;
  }
  .login-bg {
    width: 100%;
    height: 100%;
  }
  .login-box {
    width: 450px;
    background: hsla(0, 0%, 100%, 0.1);
    border-radius: 10px;

    border: 0px #f7f7f7;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .login-box-from {
    width: 100%;
    height: auto;
    padding: 30px;
    box-sizing: border-box;
  }

  .el-checkbox{
    color: #cccccc;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #cccccc;
  }
  .agreement {
      font-size: 12px;
    }
</style>
