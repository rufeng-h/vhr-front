import { LAYOUT } from '../constant';
import { AppRouteRecordRaw } from '../types';

const candRoutes: AppRouteRecordRaw[] = [
  {
    path: '/cand',
    redirect: '/cand/home',
    name: 'Cand',
    component: LAYOUT,
    meta: {
      title: '管理员',
    },
    children: [
      {
        path: 'home',
        name: 'CandHome',
        component: () => import('/@/views/dashboard/analysis/index.vue'),
        meta: {
          title: '控制台',
        },
      },
    ],
  },
];
export default candRoutes;
