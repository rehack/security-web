<template>
    <router-link :to="to">
        <slot />
    </router-link>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { isExternal} from "@/utils/validate";
import {Prop} from "vue-property-decorator";

@Options({
    name: 'sidebar-item-link'
})

export default class SideBarItemLink extends Vue {

    @Prop({ required: true }) private to!: string

    private isExternal = isExternal
}
</script>

<style scoped>

</style>
