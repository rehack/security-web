<template>
    <a-breadcrumb>
        <a-breadcrumb-item>
            <home-outlined class="home" @click="toHome"/>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
            <a @click.prevent="handleLink(item)">{{item.meta.title}}</a>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { HomeOutlined } from "@ant-design/icons-vue/lib"
import {RouteRecordRaw} from "vue-router"
import {Watch} from "vue-property-decorator"
import {Route} from "ant-design-vue/types/breadcrumb/breadcrumb"
import { message } from "ant-design-vue"

@Options({
    name: "bread-crumb",
    components: {
        HomeOutlined
    }
})
export default class BreakCrumb extends Vue{

    private breadcrumbs: RouteRecordRaw[] = []

    @Watch("$route")
    private onRouteChange(route: Route) {
        if (route.path?.startsWith('/redirect')) {
            return;
        }
        this.getBreadcrumb()
    }

    created() {
        this.getBreadcrumb()
    }

    private handleLink(item: RouteRecordRaw) {
        const { redirect, path } = item
        if (redirect) {
            this.$router.push(redirect).catch(error => {
                message.error('迷路啦')
            })
            return;
        }
    }

    private toHome() {
        this.$router.push("/").catch(error => {
            message.error('迷路啦')
        })
        return
    }

    private getBreadcrumb() {
        let matched: RouteRecordRaw[] = this.$route.matched.filter((item) => item.meta && item.meta.title)
        const first = matched[0]
        if (!this.isDashboard(first)) {
            matched = [{path: '/', redirect: '/dashboard', name: '首页', meta: { title: '首页', root: true }} as RouteRecordRaw].concat(matched)
        }
        this.breadcrumbs = matched.filter((item) => {
            return item.meta && item.meta.title
        })
    }

    private isDashboard(route: RouteRecordRaw) {
        const name = route.name
        if (!name) {
            return false;
        }
        return (name as any).trim() === ('首页' || '系统首页')
    }
}
</script>

<style lang="scss" scoped>
    .home {
        cursor: pointer;
    }
</style>
