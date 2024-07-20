import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/manage/user.vue";
import connect from "../pages/manage/connection.vue";
import dest from "../pages/manage/destination.vue";
import config from "../pages/manage/config.vue";
import cluster from "../pages/manage/cluster.vue";
import source from "../pages/source.vue";
import policy from "../pages/policy.vue";
import task from "../pages/task.vue";
import taskDetail from "../pages/task_detail.vue";
import policyDetail from "../pages/policy_detail.vue";
// Routes
const routes = [
  {
    path: '/',
    component: dashboard,
    redirect: '/dashboard',
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '', component: app, children:
      [
        {path: '/dashboard', component: dashboard},
        {path: '/source', component: source},
        {path: '/policy', component: policy},
        {path: '/policy/detail', component: policyDetail},
        {path: '/task', component: task},
        {path: '/task/detail', component: taskDetail},
        {path: '/index', component: task},
        {path: '/manage/cluster', component: cluster},
        {path: '/manage/user', component: sysUser},
        {path: '/manage/dest', component: dest},
        {path: '/manage', component: connect},
        {path: '/manage/connect', component: connect},
        {path: '/manage/config', component: config},
      ]
  },
  {
    path: '*',
    meta: {
      title: "页面走丢了",
    },
    component: NotFoundView
  }
]


export default routes

