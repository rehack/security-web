<template>
    <a-directory-tree default-expand-all :treeData="permissions" :replaceFields="replaceFields" @select="onSelect">

    </a-directory-tree>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { queryPermissions, queryPermission } from "@/api/permission";
import PermissionItem from '@/views/system/permission/permissionItem.vue';

@Options({
    name: "permission",
    components: {
        'permission-item': PermissionItem
    }
})
export default class User extends Vue{

    private nowNode: any;
    private permissions = []
    replaceFields = {
        key: 'permissionId',
        title: 'permissionName',
    }

    created() {
        this.initPermissionData()
    }

    private async initPermissionData() {
        const res: any = await queryPermissions()
        if (res.code === '200') {
            this.permissions = res.data
        }
    }

    private async onSelect(permissionId: number) {
        const res: any = await queryPermission(permissionId);
        if (res.code === '200' && res.data) {
            this.nowNode = res.data
        }
        console.log(this.nowNode)
    }

}
</script>

<style scoped>

</style>
