<template>
    <template v-if="!hasChild">
        <a-tree-node :key="perItem.permissionId" :title="perItem.permissionName" is-leaf></a-tree-node>
    </template>
    <template v-else>
        <a-tree-node :key="perItem.permissionId" :title="perItem.permissionName">
            <permission-item />
        </a-tree-node>
    </template>
</template>

<script lang="ts">
import { Options, Vue} from "vue-class-component";
import {Prop} from 'vue-property-decorator';

@Options({
    name: 'permission-item'
})
export default class PermissionItem extends Vue{

    @Prop("perItem") private perItem!: any;

    private hasChild() {
        return this.perItem.children?.length > 0;
    }
}
</script>

<style scoped>

</style>
