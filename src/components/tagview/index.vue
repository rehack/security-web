<template>
    <div id="tags-view-container" class="tags-view-container">
            <a-tag :color="getTheme(tag)" :closable="!isAffix(tag)" v-for="tag in visitedViews" :key="tag.path"
                   @close="closeSelectedTag(tag)" @click="routeToPath(tag)" class="tag-item">
                {{tag.meta.title}}
            </a-tag>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import {ITagView, TagViewModule} from "@/store/module/tag-views"
import {Watch} from "vue-property-decorator"
import {RouteRecordRaw} from "vue-router"
import path from "path"
import {PermissionModule} from "@/store/module/permissions"

@Options({
    name: "tag-view"
})
export default class TagView extends Vue {

    private tagThemes = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime']
    private activeTheme = '#2db7f5'
    private affixTags: ITagView[] = []

    get visitedViews() {
        return TagViewModule.visitedViews
    }

    get routes() {
        return PermissionModule.routes
    }

    mounted() {
        this.initTagsView()
    }

    private getTheme(tag: ITagView): string {
        const number = Math.floor((Math.random() * 100)) % 13
        return this.isActive(tag) ? this.activeTheme : this.tagThemes[number]
    }

    private isActive(route: ITagView) {
        return route.path === this.$route.path
    }

    private isAffix(tag: ITagView) {
        return tag.meta && tag.meta.affix
    }

    private closeSelectedTag(view: ITagView) {
        TagViewModule.delView(view)
        if (this.isActive(view)) {
            this.toLastView(TagViewModule.visitedViews, view)
        }
    }

    private routeToPath(tag: ITagView) {
        this.$router.push(tag.path)
    }

    private toLastView(visitedViews: ITagView[], view: ITagView) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView !== undefined && latestView.fullPath !== undefined) {
            this.$router.push(latestView.fullPath)
        } else {
            if (view.name === 'Dashboard') {
                this.$router.replace({ path: '/redirect' + view.fullPath })
            } else {
                this.$router.push('/')
            }
        }
    }

    private moveToCurrentTag() {
        const tags = this.$refs.tag as any[]
        this.$nextTick(() => {
            for (const tag of tags) {
                if((tag.to as ITagView).path === this.$route.path) {
                }
            }
        })
    }

    private initTagsView() {
        this.affixTags = this.filterAffixTags(this.routes)
        for (const tag of this.affixTags) {
            if (tag.name) {
                TagViewModule.addVisitedView(tag)
            }
        }
    }

    private filterAffixTags(routes: RouteRecordRaw[], basePath = '/') {
        let tags: ITagView[] = []
        routes.forEach(route => {
            if (route.meta && route.meta.affix) {
                const tagPath = path.resolve(basePath, route.path)
                tags.push({
                    fullPath: tagPath,
                    path: tagPath,
                    name: route.name,
                    meta: {...route.meta}
                })
            }
            if (route.children) {
                const childTags = this.filterAffixTags(route.children, route.path)
                if (childTags.length >= 1) {
                    tags = [...tags, ...childTags]
                }
            }
        })
        return tags
    }

    private addTags() {
        const { name } = this.$route
        if (name) {
            TagViewModule.addView(this.$route)
        }
        console.log(TagViewModule.cachedViews)
        return false
    }

    @Watch('$route')
    private onRouteChange() {
        this.addTags()
    }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .tag-item {
        cursor: pointer;
    }

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }
        }
    }
}
</style>
