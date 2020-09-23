<template>
    <div id="tags-view-container" class="tags-view-container">
        <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path" :class="isActive(tag) ? 'active': ''"
                     :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}" tag="span" class="tags-view-item"
                     @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''">
            <a-tag :color="getTheme()" :closable="!isAffix(tag)" @close="closeSelectedTag(tag)">
                {{tag.meta.title}}
            </a-tag>
        </router-link>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import {ITagView, TagViewModule} from "@/store/module/tag-views";
import {Watch} from "vue-property-decorator";

@Options({
    name: "tag-view"
})
export default class TagView extends Vue {

    private tagThemes = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime']

    private getTheme(): string {
        const number = Math.floor((Math.random() * 100)) % 13;
        console.log(number)
        return this.tagThemes[number];
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
        const tags = this.$refs.tag as any[];
        this.$nextTick(() => {
            for (const tag of tags) {
                if((tag.to as ITagView).path === this.$route.path) {
                }
            }
        })
    }

    private addTags() {
        const { name } = this.$route;
        if (name) {
            TagViewModule.addView(this.$route);
        }
        console.log(TagViewModule.visitedViews)
        return false;
    }

    get visitedViews() {
        console.log(TagViewModule.visitedViews)
        return TagViewModule.visitedViews;
    }

    @Watch('$route')
    private onRouteChange() {
        this.addTags();
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

            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;

                &::before {
                    content: '';
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
        }
    }
}
</style>
