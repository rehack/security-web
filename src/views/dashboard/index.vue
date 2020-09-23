<template>
    <sidebar class="sidebar-container"></sidebar>
    <div v-if="tagView" class="main-container">
        <tag-view></tag-view>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsModule } from "@/store/module/settings";
import SideBar from "@/components/sidebar/index.vue";
import TagView from "@/components/tagview/index.vue";

@Options({
    name: 'dashboard',
    components: {
        "sidebar": SideBar,
        "tag-view": TagView
    }
})
export default class extends Vue {

    get tagView() {
        return SettingsModule.tagView;
    }
}
</script>

<style lang="scss" scoped>
.sidebar-container {
    transition: width 0.28s;
    width: 200px;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
}
.main-container {
    min-height: 100%;
    transition: margin-left .28s;
    margin-left: 200px;
    position: relative;
}
</style>
