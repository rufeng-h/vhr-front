import { LAYOUT } from '../constant';
import { AppRouteModule } from '../types';

const adminRoutes: AppRouteModule[] = [
  {
    path: '/admin',
    redirect: '/admin/home',
    name: 'Admin',
    component: LAYOUT,
    meta: {
      title: '管理员',
    },
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: () => import('/@/views/dashboard/analysis/index.vue'),
        meta: {
          title: '控制台',
        },
      },
    ],
  },
  {
    path: '/_job',
    name: '_Job',
    component: LAYOUT,
    meta: {
      title: '公告管理',
    },
    children: [
      {
        path: 'list',
        name: '_JobList',
        meta: {
          title: '公告列表',
        },
        component: () => import('/@/views/vhr/admin/Job.vue'),
      },
    ],
  },
];

export default adminRoutes;
