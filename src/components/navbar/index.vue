<template>
    <div class="navbar-container" id="navbar-container">
        <menu-fold-outlined class="navbar-icon" v-if="!menuCollapsed" @click="foldOrUnFold" />
        <menu-unfold-outlined class="navbar-icon" v-else @click="foldOrUnFold" />
        <rocket-two-tone v-if="light" @click="lightOrUnLight" class="navbar-icon"/>
        <rocket-outlined  v-else @click="lightOrUnLight" class="navbar-icon"/>
        <bread-crumb class="navbar-bread"></bread-crumb>
        <div class="navbar-right-items">
            <message class="navbar-right-item"/>
            <user class="navbar-right-item"/>
            <out class="navbar-right-item"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { MenuFoldOutlined, MenuUnfoldOutlined, RocketOutlined, RocketTwoTone }from "@ant-design/icons-vue";
import { SettingsModule} from "@/store/module/settings";
import Breadcrumb from "@/components/breadcrumb/index.vue";
import User from "@/components/navbar/user.vue";
import Message from "@/components/navbar/message.vue";
import Out from "@/components/navbar/out.vue";

@Options({
    name: 'nav-bar',
    components: {
        MenuFoldOutlined,
        MenuUnfoldOutlined,
        RocketOutlined,
        RocketTwoTone,
        "bread-crumb" : Breadcrumb,
        User,
        Message,
        Out
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
        margin-right: 10px;
    }

    .navbar-bread {
        margin-left: auto;
        margin-right: auto;
    }

    .navbar-right-items {
        width: 15%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        float: right;

        .navbar-right-item {
            cursor: pointer;
            font-size: 20px;
        }
    }

}
</style>
