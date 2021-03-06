import { Authority } from '@/shared/security/authority';

const Register = () => import('@/account/register/register.vue');
const Activate = () => import('@/account/activate/activate.vue');
const ResetPasswordInit = () => import('@/account/reset-password/init/reset-password-init.vue');
const ResetPasswordFinish = () => import('@/account/reset-password/finish/reset-password-finish.vue');
const ChangePassword = () => import('@/account/change-password/change-password.vue');
const Settings = () => import('@/account/settings/settings.vue');
const First = () => import('@/core/first/first.vue'); //主页
const TaskDetail = () => import('@/core/task/task.vue'); //作业详情页
const TaskList = () => import('@/core/task/TaskList.vue');

export default [
  /*   {
    path: '/register',
    name: 'Register',
    component: Register,
  }, */
  {
    path: '/account/activate',
    name: 'Activate',
    component: Activate,
  },
  {
    path: '/account/reset/request',
    name: 'ResetPasswordInit',
    component: ResetPasswordInit,
  },
  {
    path: '/account/reset/finish',
    name: 'ResetPasswordFinish',
    component: ResetPasswordFinish,
  },
  {
    path: '/account/password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/account/settings',
    name: 'Settings',
    component: Settings,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/info/first',
    name: 'First',
    component: First,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/info/task/detail/:taskId',
    name: 'TaskDetail',
    component: TaskDetail,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/info/task',
    name: 'TaskList',
    component: TaskList,
    meta: { authorities: [Authority.USER] },
  },
];
