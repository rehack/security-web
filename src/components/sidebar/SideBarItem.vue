<template>
    <template v-if="!hasChild()">
        <a-menu-item>
            <sidebar-item-link :to="item.path">
                <span>{{item.meta.title}}</span>
            </sidebar-item-link>
        </a-menu-item>
    </template>
    <a-sub-menu v-else>
        <template v-slot:title>
            <span><appstore-two-tone /><span>{{item.meta.title}}</span></span>
        </template>
        <template v-if="item.children">
            <sidebar-item v-for="child in item.children" :key="child.path" :item="child"></sidebar-item>
        </template>
    </a-sub-menu>
</template>

<script lang="ts">
import { Options, Vue} from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {RouteRecordRaw} from "vue-router";
import SideBarItemLink from "@/components/sidebar/SideBarItemLink.vue";
import { UserOutlined, SafetyOutlined,InfoCircleOutlined, AppstoreTwoTone } from "@ant-design/icons-vue";
import {ITagView} from "@/store/module/tag-views";
import path from "path";
import { isExternal } from '@/utils/validate'

@Options({
    name: "sidebar-item",
    components: {
        "sidebar-item-link": SideBarItemLink,
        UserOutlined,
        AppstoreTwoTone
    }
})

export default class SideBarItem extends Vue{

    @Prop({value : "item"}) public item!: RouteRecordRaw;

    private hasChild(): boolean {
        if (this.item.meta?.hidden) {
            return false;
        }
        if (this.item.children) {
            return this.item.children.length > 0;
        }
        return false;
    }

    private getMenuIcon(icon: string) {
        const iconHtml = '<' + icon + '/>';
        console.log(iconHtml)
        return iconHtml;
    }

}
</script>

<style scoped>

</style>
