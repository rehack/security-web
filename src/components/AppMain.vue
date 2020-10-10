<template>
    <section class="app-main">
        <router-view v-slot="{ Component }">
            <keep-alive :include="cachedViews">
                <component :is="Component"></component>
            </keep-alive>
        </router-view>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { TagViewModule } from "@/store/module/tag-views"
import {Watch} from "vue-property-decorator"

@Options({
    name: 'app-main'
})
export default class AppMain extends Vue{

    get key() {
        return this.$route.path
    }

    get cachedViews() {
        return TagViewModule.cachedViews
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 68px);
    width: 100%;
    position: relative;
    overflow: hidden;
    padding-left: 2px;
}
</style>
