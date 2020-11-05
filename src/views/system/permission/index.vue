<template>
    <a-directory-tree default-expand-all :treeData="permissions" :replaceFields="replaceFields" @rightClick="edit">

    </a-directory-tree>

    <a-modal :title="modalTitle" v-model:visible="modalVisible" @cancel="modalCancel" @ok="save"
             :confirm-loading="confirmLoading" :ok-type="modalOkType" :okButtonProps="okButtonProps">
        <a-tabs v-model:active-key="activeKey" @change="tabChange">
            <a-tab-pane v-for="option in modalOptions" :key="option.key" :tab="option.tab">
                <template v-if="activeKey === 1">
                    <a-form :model="nowNode" layout="horizontal">
                        <a-form-item label="权限ID" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="nowNode.permissionId" disabled></a-input>
                        </a-form-item>
                        <a-form-item label="父权限ID" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="nowNode.parentId"></a-input>
                        </a-form-item>
                        <a-form-item label="父权限" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="nowNode.parentPermission" disabled></a-input>
                        </a-form-item>
                        <a-form-item label="权限" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="nowNode.permission"></a-input>
                        </a-form-item>
                        <a-form-item label="权限名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="nowNode.permissionName"></a-input>
                        </a-form-item>
                        <a-form-item label="权限描述" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="nowNode.permissionDesc"></a-input>
                        </a-form-item>
                        <a-form-item label="权限类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-radio-group v-model:value="nowNode.type" button-style="solid" >
                                <a-radio-button value="1">按钮</a-radio-button>
                                <a-radio-button value="2">菜单</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    </a-form>
                </template>

                <template v-if="activeKey === 2">
                    <a-form :model="newPermission" layout="horizontal">
                        <a-form-item label="父权限ID" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="newPermission.parentId"></a-input>
                        </a-form-item>
                        <a-form-item label="父权限" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="newPermission.parentPermission"></a-input>
                        </a-form-item>
                        <a-form-item label="权限" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="newPermission.permission"></a-input>
                        </a-form-item>
                        <a-form-item label="权限名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="newPermission.permissionName"></a-input>
                        </a-form-item>
                        <a-form-item label="权限描述" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input v-model:value="newPermission.permissionDesc"></a-input>
                        </a-form-item>
                        <a-form-item label="权限类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-radio-group v-model:value="newPermission.type" button-style="solid" >
                                <a-radio-button value="1">按钮</a-radio-button>
                                <a-radio-button value="2">菜单</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    </a-form>
                </template>

                <template v-if="activeKey === 3">
                    <a-alert message="确定删除?" description="删除权限会连带删除他的所有子集权限!"
                            type="error" closable @close="alertClose"/>
                </template>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { queryPermissions, queryPermission, updatePermission, addPermission, deletePermission } from "@/api/system/permission";
import {message} from "ant-design-vue";

@Options({
    name: "permission"
})
export default class User extends Vue{

    private nowNode: any;
    private newPermission = {
        parentId: '',
        parentPermission: '',
        permission: '',
        permissionName: '',
        permissionDesc: '',
        type: "1"
    }
    private permissions = []
    replaceFields = {
        key: 'permissionId',
        title: 'permissionName',
    }
    private modalOptions = [
        { key: 1, tab: '编辑权限' },
        { key: 2, tab: '新增权限' },
        { key: 3, tab: '删除权限' }
    ]
    private modalVisible = false
    private confirmLoading = false
    private modalOkType = 'primary'
    private okButtonProps = { disabled: false }
    private modalTitle = this.modalOptions[0].tab
    private activeKey = this.modalOptions[0].key
    public labelCol = { span: 4 }
    public wrapperCol =  { span: 20 }

    created() {
        this.initPermissionData()
    }

    private async initPermissionData() {
        const res: any = await queryPermissions()
        if (res.code === 200) {
            this.permissions = res.data
        }
    }

    private edit(node: any) {
        this.nowNode = node.node.dataRef
        this.modalVisible = true
        this.modalTitle = this.nowNode.permissionName
    }
    private tabChange(key: any) {
        const tab: any = this.modalOptions.filter(item => item.key === key)[0]
        this.activeKey = tab.key
        this.modalOkType = 'default'
        this.okButtonProps.disabled = false
        if (tab.key === 2) {
            this.newPermission.parentId = this.nowNode.permissionId
            this.newPermission.parentPermission = this.nowNode.permissionName
        }
        if (tab.key === 3) {
            this.modalOkType = 'danger'
            this.okButtonProps.disabled = true
        }
    }
    private async save() {
        switch (this.activeKey) {
            case 1:
                await this.editPermission()
                break;
            case 2:
                await this.addPermission()
                break;
            case 3 :
                await this.deletePermission()
                break;
        }
        this.activeKey = this.modalOptions[0].key;
        this.initPermissionData()
        this.resetNewPermission()
    }
    private async editPermission() {
        this.confirmLoading = true
        const res: any = await updatePermission(this.nowNode)
        if (res.code === 200) {
            this.modalVisible = false
            message.success('修改成功')
        }
        this.confirmLoading = false
    }
    private async addPermission() {
        this.confirmLoading = true
        const res: any = await addPermission(this.newPermission)
        if (res.code === 200) {
            this.modalVisible = false
            message.success('新增成功')
        }
        this.confirmLoading = false
    }
    private async deletePermission() {
        const res: any = await deletePermission(this.nowNode.permissionId)
        if (res.code === 200) {
            this.modalVisible = false
            message.success('删除成功')
        }
        this.confirmLoading = false
    }
    private alertClose() {
        this.okButtonProps.disabled = false
    }
    private resetNewPermission() {
        this.newPermission = {
            parentId: '',
            parentPermission: '',
            permission: '',
            permissionName: '',
            permissionDesc: '',
            type: "1"
        }
    }
    private modalCancel() {
        this.activeKey = this.modalOptions[0].key
        this.okButtonProps.disabled = false
        this.modalOkType = 'default'
    }

}
</script>

<style scoped>

</style>
