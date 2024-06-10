import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/user.vue";
import userAdd from "../pages/sys/userAdd.vue";
import resetPwd from "../pages/resetPwd.vue";
import source from "../pages/source.vue";
import policy from "../pages/policy.vue";
import task from "../pages/task.vue";
// Routes
const routes = [
  {
    path: '/login', component: login
  },
  {
    path: '/test', component: app, children:
      [
        { path: '*', component: NotFoundView  }
      ]
  },
  {
    path: '', component: app, children:
      [
        { path: '/source', component: source },
        { path: '/policy', component: policy },
        { path: '/task', component: task },
        { path: '/resetPwd', component: resetPwd  },
        { path: '/index', component: dashboard  },
        { path: '/manage/user', component: sysUser },
        { path: '/manage/userAdd', component: userAdd },
        { path: '/manage/dest', component: sysUser },
        { path: '/manage', component: sysUser },
        { path: '/manage/connect', component: sysUser }
      ]
  },
  { path: '*', component: NotFoundView }
]


export default routes

