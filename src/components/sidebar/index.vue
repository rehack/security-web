<template>
    <div v-bind:style="{'width': menuWidth, 'height': '100%'}">
        <a-menu mode="inline" :inline-collapsed="collapsed">
            <a-menu-item key="dashboard">
                <a-row class="top-content">
                    <span>ShopMall</span>
                </a-row>
            </a-menu-item>
            <sidebar-item v-for="route in routes" :key="route.path" :item="route"></sidebar-item>
        </a-menu>
        <a-button @click="toggleCollapsed">展开/收起</a-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsModule } from "@/store/module/settings";
import { PermissionModule } from "@/store/module/permissions";
import SideBarItem from "@/components/sidebar/SideBarItem.vue";

@Options({
    name: 'dashboard',
    components: {
        "sidebar-item": SideBarItem
    }
})
export default class extends Vue {

    private menuWidth = '200px';

    /** 菜单收起与打开 */
    toggleCollapsed() {
        SettingsModule.changeMenuCollapsed();
    }

    get collapsed() {
        return SettingsModule.menuCollapsed;
    }

    get routes() {
        return PermissionModule.routes;
    }
}
</script>

<style scoped>
.top-content {
    font-size: 20px;
    background-color: aliceblue;
}
</style>
