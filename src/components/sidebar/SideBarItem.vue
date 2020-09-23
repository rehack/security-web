<template>
    <template v-if="!hasChild()">
        <a-menu-item @click="toPath(item.path)">{{item.meta.title}}</a-menu-item>
    </template>
    <template v-else>
        <a-sub-menu>
            <template v-slot:title>
                <span>{{item.meta.title}}</span>
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :item="child"></sidebar-item>
        </a-sub-menu>
    </template>
</template>

<script lang="ts">
import { Options, Vue} from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import {RouteRecordRaw} from "vue-router";
import SideBarItemLink from "@/components/sidebar/SideBarItemLink.vue";

@Options({
    name: "sidebar-item",
    components: {
        "sidebar-item-link": SideBarItemLink
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

    private toPath(path: string) {
        this.$router.push(path)
    }

}
</script>

<style scoped>

</style>
