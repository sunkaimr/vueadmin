import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/manage/user.vue";
import connect from "../pages/manage/connection.vue";
import dest from "../pages/manage/destination.vue";
import config from "../pages/manage/config.vue";
import source from "../pages/source.vue";
import policy from "../pages/policy.vue";
import task from "../pages/task.vue";
// Routes
const routes = [
  {
    path: '/login', component: login
  },
  {
    path: '', component: app, children:
      [
        { path: '/source', component: source },
        { path: '/policy', component: policy },
        { path: '/task', component: task },
        { path: '/index', component: task  },
        { path: '/manage/user', component: sysUser },
        { path: '/manage/dest', component: dest },
        { path: '/manage', component: connect },
        { path: '/manage/connect', component: connect },
        { path: '/manage/config', component: config },
      ]
  },
  { path: '*', component: NotFoundView }
]


export default routes

