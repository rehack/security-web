import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { RouteRecordRaw } from "vue-router";
import { constantRoutes, asyncRoutes} from "@/router";

/** 判断是否拥有权限 */
const hasPermission = (permissions: string[], route: RouteRecordRaw) => {
    if (route.meta && route.meta.permissions) {
        return permissions.some(permission => (route.meta as any).permissions.includes(permission))
    }
};

/** 过滤每个路由, 取出有权限的路由 */
export const filterAsyncRoutes = (routes: RouteRecordRaw[], permissions: string[]) => {
    const res: RouteRecordRaw[] = []
    routes.forEach(route => {
        const r = { ...route };
        // if (hasPermission(permissions, r)) {
        if (r.children) {
            r.children = filterAsyncRoutes(r.children, permissions)
        }
        res.push(r);
        //}
    });
    return res;
};

export interface IPermissionState {
    routes: RouteRecordRaw[],
    dynamicRoutes: RouteRecordRaw[]
}

@Module({ dynamic: true, name: 'permission', store})
class Permission extends VuexModule implements IPermissionState {
    public routes: RouteRecordRaw[] = [];
    public dynamicRoutes: RouteRecordRaw[] = [];

    @Mutation
    private SET_ROUTES(routes: RouteRecordRaw[]) {
        this.routes = constantRoutes.concat(routes);
        this.dynamicRoutes = routes;
    }

    @Action
    public GenerateRoutes(roles: string[], permissions: string[]) {
        let accessedRoutes;
        if (roles.includes('super')) {
            accessedRoutes = asyncRoutes;
        } else {
            accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
        }
        this.SET_ROUTES(accessedRoutes);
    }
}

export const PermissionModule = getModule(Permission);
