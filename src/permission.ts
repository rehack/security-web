import router from './router'
import {RouteLocationNormalized, RouteRecordRaw, NavigationGuardNext} from "vue-router"
import NProgress from 'nprogress'
import { UserModule } from '@/store/module/user'
import { PermissionModule } from '@/store/module/permissions'
import { message } from 'ant-design-vue'
import { SettingsModule} from "@/store/module/settings"

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/auth-redirect', '/test', ]

const getPageTitle = (key: string) => {
  /*if (key) {
      return key
  }*/
  return `${SettingsModule.title}`
}

router.beforeEach(async(to: RouteLocationNormalized,  from: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start()

    if (UserModule.access_token) {
        if (to.path === '/login') {
            next({ path : '/'})
            NProgress.done()
        } else {
            if (UserModule.roles.length === 0) {
                try {
                    await UserModule.GetUserInfo()
                    const roles: string[] = UserModule.roles;
                    const permissions: string[] = UserModule.permissions;
                    PermissionModule.GenerateRoutes({roles, permissions});
                    PermissionModule.dynamicRoutes.forEach(route => {
                        router.addRoute(route)
                    })
                    next({ ...to, replace: true})
                } catch (error) {
                    console.log(error);
                    UserModule.ResetToken()
                    message.error('Router Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1 || to.path.includes(process.env.VUE_APP_CODE_SERVER_PAGE) || to.path.includes("/login")) {
            next()
        } else {
            /*UserModule.LogOut()
            next(`/login?redirect=${to.path}`)
            NProgress.done()*/
            next('/login')
        }
    }
});

router.afterEach((to: RouteLocationNormalized) => {
    NProgress.done()
    document.title = getPageTitle(to.meta.title);
});
