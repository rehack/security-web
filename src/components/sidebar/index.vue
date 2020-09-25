<template>
    <div v-bind:style="{'width': menuWidth, 'height': '100%'}">
        <a-menu mode="inline" :inline-collapsed="collapsed" :theme="theme">
            <a-menu-item key="dashboard">
                <a-row class="top-content">
                    <span>ShopMall</span>
                </a-row>
            </a-menu-item>
            <sidebar-item v-for="route in routes" :key="route.path" :item="route"></sidebar-item>
        </a-menu>
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

    get collapsed() {
        return SettingsModule.menuCollapsed;
    }

    get routes() {
        return PermissionModule.routes;
    }

    get theme() {
        return SettingsModule.light ? 'light' : 'dark';
    }
}
</script>

<style scoped>
.top-content {
    font-size: 20px;
    background-color: aliceblue;
}
</style>
