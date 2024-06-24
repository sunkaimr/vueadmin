<template>
  <header class="main-header animated" :class="{closeLogo:sidebar.collapsed,mobileLogo:device.isMobile}">
    <a href="#" class="logo">
      <span class="logo-lg"><i class="fa fa-diamond"></i>&nbsp; <b style="font-size: 14px;">EXAMPLE</b></span>
    </a>
    <nav class="navbar">
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button"
         @click.stop.prevent="toggleMenu(!sidebar.collapsed,device.isMobile)">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <div class="navbar-custom-menu">
        <el-dropdown trigger="click" @command="commandHandle" class="navbar-dropdown">
          <div class="el-dropdown-link">
            <i class="el-icon-user-solid" style="font-size: 24px;"></i>
            <i style="font-size: 14px; font-style: normal;">&nbsp;{{ userInfo.real_name }}</i>
          </div>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </nav>
    <el-dialog title="修改用户信息" :visible.sync="dialogEditFormVisible" :append-to-body="true">
      <el-form size="mini" :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="username" label-width="80px">
          <el-input v-model="form.username" disabled autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item label="姓名" prop="real_name" label-width="80px">
          <el-input v-model="form.real_name" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px">
          <el-input v-model="form.email" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <template v-if="form.password !== ''">
          <el-form-item label="确认密码" label-width="80px">
            <el-input v-model="form.passwordConfirm" placeholder="请确认密码" show-password></el-input>
          </el-form-item>
        </template>
        <el-form-item label="上次登陆" label-width="80px">
          <el-input v-model="form.last_login" disabled autocomplete="off" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelEditSubmit('form')">取 消</el-button>
        <el-button size="mini" type="primary" @click="onEditSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
      </div>
    </el-dialog>
  </header>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import types from "../../store/mutation-types"
import auth from '../../common/auth'
import * as api from "../../api";

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.passwordConfirm) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      fullscreenLoading: false,
      dialogEditFormVisible: false,
      form: {
        username: "",
        real_name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        last_login: "",
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        real_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ]
      },
    }
  },
  computed: mapGetters({
    sidebar: 'sidebar',
    userInfo: 'userInfo',
    device: 'device',
  }),
  methods: {
    onEditSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);

        if (this.form.password !== "" && this.form.password !== this.form.passwordConfirm){
          this.$notify({ title: '错误', message: "两次输入密码不一致", type: 'error' });
          this.fullscreenLoading = false;
          return
        }

        const para = {
          username : this.form.username,
          real_name: this.form.real_name,
          email: this.form.email,
          password: this.form.password,
        }
        this.$http.put(api.USER_UPDATE, JSON.stringify(para)).then(res => {
          this.fullscreenLoading = false;
          this.dialogEditFormVisible = false;
          this.$refs[formName].resetFields();
          this.$notify({ title: '成功', message: "修改成功", type: 'success' });

          this.form = res.data.data
          this.form.password = ''
          this.form.passwordConfirm = ''
          window.localStorage.setItem("user", JSON.stringify(this.form));
          this.setUserInfo(this.form);
        }).catch(()=>{
          this.fullscreenLoading = false;
        })
      });
    },
    cancelEditSubmit(formName){
      this.$refs[formName].resetFields();
      this.fullscreenLoading = false;
      this.dialogEditFormVisible = false;
    },
    toggleMenu(collapsed, isMobile) {
      if (isMobile) {
        this.toggleSidebarShow();
      } else {
        this.toggleSidebar();
      }
    },
    commandHandle(command){
      switch (command) {
        case 'logout':
          auth.logout();
          this.$router.push({path: '/login'});
          break
        case 'userInfo':
          this.dialogEditFormVisible = true;
          break
      }
    },
    ...mapMutations({
      toggleSidebar: types.TOGGLE_SIDEBAR,
      toggleSidebarShow: types.TOGGLE_SIDEBAR_SHOW,
      setUserInfo: types.SET_USER_INFO,
    }),
  },
  created() {
    this.form = JSON.parse(window.localStorage.getItem("user"));
    if (this.form) {
      this.setUserInfo(this.form);
    }
  },
}
</script>
<style scoped>
.animated {
  animation-duration: .2s;
}

.main-header a {
  text-decoration: none;
  color: #48576a;
}

.main-header {
  position: fixed;
  min-width: 100%;
  box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  z-index: 1999;
  animation-name: slideInDown;
  animation-fill-mode: both;
  color: #48576a;
}

.main-header .navbar .sidebar-toggle {
  float: left;
  background-color: transparent;
  background-image: none;
  padding: 15px 15px;
  font-family: fontAwesome;
  line-height: 20px;
}

.main-header .navbar .sidebar-toggle:before {
  content: "\f03b";
}

.main-header {
  background-color: #ffffff;
}

.main-header .logo {
  -webkit-transition: width 0.3s ease-in-out;
  -o-transition: width 0.3s ease-in-out;
  transition: width 0.3s ease-in-out;
  display: block;
  float: left;
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  text-align: center;
  width: 230px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 0 15px;
  font-weight: 300;
  overflow: hidden;
  text-decoration: none;
}

.main-header .logo .logo-lg {
  display: block;
  height: 38px;
  line-height: 38px;
  margin-top: 6px;
  text-align: left;
}

.main-header .navbar {
  -webkit-transition: margin-left 0.3s ease-in-out;
  -o-transition: margin-left 0.3s ease-in-out;
  transition: margin-left 0.3s ease-in-out;
  margin-bottom: 0;
  margin-left: 230px;
  border: none;
  min-height: 50px;
  border-radius: 0;
  background-color: #ffffff;
}

.layout-top-nav .main-header .navbar {
  margin-left: 0;
}


body.hold-transition .main-header .navbar,
body.hold-transition .main-header .logo {
  -webkit-transition: none;
  -o-transition: none;
  transition: none;
}

.main-header .navbar .sidebar-toggle {
  display: block;
}

.main-header .navbar .sidebar-toggle:hover {
  background: #f9f9f9;
}

.main-header .logo {
  border-bottom: 0 solid transparent;
}


@media (max-width: 800px) {

  .main-header .logo {
    display: none;
  }

  .main-header .navbar {
    margin: 0;
  }

  .main-header .logo, .main-header .navbar {
    width: 100%;
    float: none;
  }

}

.main-header.closeLogo .navbar {
  margin-left: 44px;
}

.main-header.closeLogo .logo {
  width: 44px;
  padding: 0 8px;
}

.main-header.closeLogo .logo .logo-lg b {
  display: none;
}

.main-header.closeLogo .sidebar-toggle {
  background: #f9f9f9;
}

.main-header.closeLogo .navbar .sidebar-toggle:before {
  content: "\f03c";
}

.main-header.mobileLogo .navbar .sidebar-toggle:before {
  content: "\f03a";
}

.navbar-custom-menu {
  float: right;
  margin-right: 40px;
}

.navbar-custom-menu .el-dropdown-link {
  cursor: pointer;

  height: 50px;
  padding: 13px 5px;
  min-width: 50px;
  text-align: center;
}

.navbar-custom-menu .el-dropdown-link img {
  background-color: #108ee9;
}

.navbar-custom-menu .el-dropdown-link:hover {
  background: #f9f9f9;
}

.message-list {
  list-style: none;
  padding: 0 10px;

}

.message-list li {
  list-style: none;
  height: 25px;
  line-height: 25px;
}

.message-list li a {
  text-decoration: none;
  color: #666666;
}

.message-list li:hover {
  background-color: #f9f9f9;
}

.el-dropdown-menu .header-pic {
  text-align: center;
  background-color: #108ee9;
  padding: 20px;
}

.el-dropdown-menu .header-pic img {
  vertical-align: middle;
  height: 90px;
  width: 90px;
  border: 3px solid;
  border-color: transparent;
  border-color: hsla(0, 0%, 100%, .2);
  background-color: #108ee9;
}

.el-dropdown-menu .header-pic p {
  font-size: 1.5rem;
  color: #ffffff;
}

.el-dropdown-menu .pull-left {
  background-color: #f9f9f9;
  padding: 10px;
  display: inline-block;
  float: left;
}

.el-dropdown-menu .pull-right {
  background-color: #f9f9f9;
  padding: 10px;
  float: right;
  display: inline-block;
}
</style>
