import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '../constant';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.globEager('./modules/**/*.ts');
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.INDEX_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

export const AdminLoginRoute: AppRouteRecordRaw = {
  path: '/adminLogin',
  name: 'AdminLogin',
  component: () => import('/@/views/sys/login/AdminLogin.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

export const indexRoutes: AppRouteRecordRaw[] = [
  {
    path: '/index',
    name: 'Index',
    redirect: '/index/home',
    meta: {
      icon: 'bi:door-open',
      title: '首页',
      hideChildrenInMenu: true,
      ignoreAuth: true,
    },
    component: LAYOUT,
    children: [
      {
        path: 'home',
        name: 'IndexHome',
        meta: {
          title: '首页',
          ignoreAuth: true,
        },
        component: () => import('/@/views/vhr/index/Home.vue'),
      },
    ],
  },
  {
    path: '/company',
    name: 'Company',
    redirect: '/company/index',
    meta: {
      title: '公司简介',
      hideChildrenInMenu: true,
      ignoreAuth: true,
      icon: 'carbon:location-company',
    },
    component: LAYOUT,
    children: [
      {
        path: 'index',
        name: 'CompanyIndex',
        meta: {
          title: '公司简介',
          ignoreAuth: true,
        },
        component: () => import('/@/views/vhr/index/Company.vue'),
      },
    ],
  },
  {
    path: '/job',
    name: 'Job',
    component: LAYOUT,
    redirect: '/job/index',
    meta: {
      hideChildrenInMenu: true,
      title: '招聘信息',
      ignoreAuth: true,
      icon: 'eos-icons:cronjob',
    },
    children: [
      {
        path: 'index',
        component: () => import('/@/views/vhr/index/Job.vue'),
        name: 'JobIndex',
        meta: {
          title: '招聘信息',
          ignoreAuth: true,
        },
      },
    ],
  },
  {
    path: '/recr',
    name: 'recruiment',
    component: LAYOUT,
    redirect: '/recr/index',
    meta: {
      hideChildrenInMenu: true,
      title: '招聘动态',
      ignoreAuth: true,
      icon: 'carbon:result',
    },
    children: [
      {
        path: 'index',
        component: () => import('/@/views/vhr/index/Recr.vue'),
        name: 'RecrIndex',
        meta: {
          title: '招聘动态',
          ignoreAuth: true,
        },
      },
    ],
  },
  {
    path: '/question',
    name: 'Question',
    component: LAYOUT,
    redirect: '/question/index',
    meta: {
      icon: 'akar-icons:chat-question',
      hideChildrenInMenu: true,
      title: '常见问题',
      ignoreAuth: true,
    },
    children: [
      {
        path: 'index',
        component: () => import('/@/views/vhr/index/Question.vue'),
        name: 'QuestionIndex',
        meta: {
          title: '常见问题',
          ignoreAuth: true,
        },
      },
    ],
  },
];

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  AdminLoginRoute,
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  ...indexRoutes,
];
