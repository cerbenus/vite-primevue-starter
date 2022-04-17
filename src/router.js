import { createRouter, createWebHistory } from 'vue-router';
import mainLayout from 'src/layouts/MainLayout.vue';
import NotFound from 'src/pages/NotFound.vue';

const routes = [
  {
    path: '/',
    redirect:
      {
        name: 'content'
      },
    component: mainLayout,
    children:
    [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/AuthLogin.vue')
      },
      {
        path: 'content',
        name: 'content',
        component: () => import('src/pages/PageContent.vue')
      },
      {
        path: 'manage/blogs',
        name: 'blogs',
        component: () => import('src/pages/PageBlogs.vue')
      },
      {
        path: 'manage/api-keys',
        name: 'apiKeys',
        component: () => import('src/pages/PageApiKeys.vue')
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
