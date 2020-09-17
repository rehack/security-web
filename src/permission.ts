import router from './router'
import {RouteLocationNormalized, RouteRecordRaw, NavigationGuardNext} from "vue-router";
import NProgress from 'nprogress';
import { UserModule } from '@/store/module/user';
import { PermissionModule } from '@/store/module/permissions';
import { message } from 'ant-design-vue';
import settings from "@/settings";

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/auth-redirect', '/test'];

const getPageTitle = (key: string) => {
  if (key) {
      return key;
  }
  return `${settings.title}`;
};

router.beforeEach(async(to: RouteLocationNormalized,  from: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start();

    if (UserModule.access_token) {
        if (to.path === '/login') {
            next({ path : '/'})
            NProgress.done()
        } else {
            if (UserModule.roles.length === 0) {
                try {
                    await UserModule.GetUserInfo();
                    const roles: string[] = UserModule.roles;
                    const permissions: string[] = UserModule.permissions;
                    PermissionModule.GenerateRoutes({roles, permissions});
                    PermissionModule.dynamicRoutes.forEach(route => {
                        router.addRoute(route);
                    })
                    next({ ...to, replace: true})
                } catch (error) {
                    UserModule.ResetToken();
                    message.error('Router Error');
                    next(`/login?redirect=${to.path}`);
                    NProgress.done()
                }
            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`);
            NProgress.done()
        }
    }
});

router.afterEach((to: RouteLocationNormalized) => {
    NProgress.done();
    document.title = getPageTitle(to.meta.title);
});
