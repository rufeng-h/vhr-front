import { LAYOUT } from '../constant';
import { AppRouteRecordRaw } from '../types';

const candRoutes: AppRouteRecordRaw[] = [
  {
    path: '/home',
    redirect: '/home/cand',
    name: 'Home',
    component: LAYOUT,
    meta: {
      title: '管理员',
    },
    children: [
      {
        path: 'cand',
        name: 'CandHome',
        component: () => import('/@/views/dashboard/analysis/index.vue'),
        meta: {
          title: '控制台',
        },
      },
    ],
  },
  {
    path: '/profile',
    redirect: '/profile/cand',
    name: 'Profile',
    component: LAYOUT,
    meta: {
      title: '个人中心',
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: 'cand',
        name: 'CandProfile',
        component: () => import('/@/views/vhr/cand/profile/index.vue'),
        meta: {
          title: '个人中心',
        },
      },
    ],
  },
  {
    path: '/resume',
    redirect: '/resume/cand',
    name: 'Resume',
    component: LAYOUT,
    meta: {
      title: '我的简历',
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: 'cand',
        name: 'CandResume',
        component: () => import('/@/views/vhr/cand/resume/index.vue'),
        meta: {
          title: '简历中心',
        },
      },
      {
        path: ':rsId',
        name: 'ResumeDetail',
        component: () => import('/@/views/vhr/cand/resume/Resume.vue'),
        meta: {
          title: '简历详情',
        },
      },
    ],
  },
];
export default candRoutes;
