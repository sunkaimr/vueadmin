import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/manage/user.vue";
import userAdd from "../pages/manage/userAdd.vue";
import connect from "../pages/manage/connection.vue";
import dest from "../pages/manage/destination.vue";
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
        { path: '/manage/dest', component: dest },
        { path: '/manage', component: connect },
        { path: '/manage/connect', component: connect }
      ]
  },
  { path: '*', component: NotFoundView }
]


export default routes

