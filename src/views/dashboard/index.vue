<template>
    <div class="app-wrapper" :class="sideBarClass">
        <sidebar class="sidebar-container" :class="themeBack"></sidebar>
        <div class="main-container">
            <div v-if="navBar">
                <nav-bar></nav-bar>
            </div>
            <div v-if="tagView">
                <tag-view></tag-view>
            </div>
            <app-main />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { SettingsModule } from "@/store/module/settings"
import SideBar from "@/components/sidebar/index.vue"
import TagView from "@/components/tagview/index.vue"
import NavBar from "@/components/navbar/index.vue"
import AppMain from "@/components/AppMain.vue"

@Options({
    name: 'dashboard',
    components: {
        "sidebar": SideBar,
        "tag-view": TagView,
        "nav-bar": NavBar,
        "app-main": AppMain
    }
})
export default class extends Vue {

    get tagView() {
        return SettingsModule.tagView
    }

    get navBar() {
        return  SettingsModule.navbar
    }

    get sideBarClass() {
        return SettingsModule.menuCollapsed ? "hideSidebar" : ""
    }

    get themeBack() {
        return SettingsModule.light ? '' : 'un-light'
    }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
}

.sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidthOpen !important;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    background: $Light;
}

.main-container {
    min-height: 100%;
    margin-left: $sideBarWidthOpen;
    transition: margin-left 0.28s;
    position: relative;
}

.hideSidebar {
    .main-container {
        margin-left: $sideBarWidthHide;
    }

    .sidebar-container {
        width: $sideBarWidthHide !important;
    }
}

.un-light {
    background: $unLight;
}

</style>
