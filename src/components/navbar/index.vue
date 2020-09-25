<template>
    <div class="navbar-container" id="navbar-container">
        <menu-fold-outlined class="navbar-icon" v-if="!menuCollapsed" @click="foldOrUnFold"></menu-fold-outlined>
        <menu-unfold-outlined class="navbar-icon" v-else @click="foldOrUnFold"></menu-unfold-outlined>
        <bulb-outlined class="navbar-icon" v-if="light" @click="lightOrUnLight"></bulb-outlined>
        <bulb-outlined class="navbar-icon" v-else @click="lightOrUnLight"></bulb-outlined>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { MenuFoldOutlined, MenuUnfoldOutlined, BulbOutlined }from "@ant-design/icons-vue";
import { SettingsModule} from "@/store/module/settings";

@Options({
    name: 'nav-bar',
    components: {
        MenuFoldOutlined,
        MenuUnfoldOutlined,
        BulbOutlined
    }
})
export default class navBar extends Vue{

    get menuCollapsed() {
        return SettingsModule.menuCollapsed;
    }

    get light() {
        return SettingsModule.light;
    }

    private foldOrUnFold() {
        SettingsModule.changeMenuCollapsed();
    }

    private lightOrUnLight() {
        SettingsModule.changeMenuLight();
    }

}
</script>

<style lang="scss" scoped>
.navbar-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .navbar-icon {
        font-size: 25px;
        cursor: pointer;
    }

}
</style>
