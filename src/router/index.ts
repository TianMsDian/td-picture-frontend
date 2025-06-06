import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import HomeView from '../views/HomeView.vue'
// @ts-ignore
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
// @ts-ignore
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
// @ts-ignore
import UserManagePage from '@/pages/admin/UserManagePage.vue'
// @ts-ignore
import AddPicturePage from '@/pages/AddPicturePage.vue'
// @ts-ignore
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
// @ts-ignore
import HomePage from '@/pages/HomePage.vue'
// @ts-ignore
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
// @ts-ignore
import AddPictureBatchPage from '@/pages/AddPictureBatchPage.vue'
// @ts-ignore
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
// @ts-ignore
import AddSpacePage from '@/pages/AddSpacePage.vue'
// @ts-ignore
import MySpacePage from '@/pages/MySpacePage.vue'
// @ts-ignore
import SpaceDetailPage from '@/pages/SpaceDetailPage.vue'
// @ts-ignore
import SearchPicturePage from '@/pages/SearchPicturePage.vue'
// @ts-ignore
import SpaceAnalyzePage from '@/pages/SpaceAnalyzePage.vue'
// @ts-ignore
import SpaceUserManagePage from '@/pages/admin/SpaceUserManagePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/spaceUserManage/:id',
      name: '空间成员管理',
      component: SpaceUserManagePage,
      props: true,
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/space_analyze',
      name: '空间分析',
      component: SpaceAnalyzePage,
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpacePage,
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: MySpacePage,
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true,
    },
    {
      path: '/search_picture',
      name: '图片搜索',
      component: SearchPicturePage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // @ts-ignore
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
