<template>
    <a-form :model="queryRolesParam" layout="inline">
        <a-form-item>
            <a-input placeholder="角色" v-model:value="queryRolesParam.role" autocomplete="off" allowClear/>
        </a-form-item>
        <a-form-item>
            <a-input placeholder="权限" v-model:value="queryRolesParam.permission" autocomplete="off" allowClear/>
        </a-form-item>
        <a-form-item>
            <a-select v-model:value="queryRolesParam.state" placeholder="角色状态" style="width: 120px" allowClear>
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="initRolesData" :loading="searchLoading">搜索</a-button>
        </a-form-item>
        <a-form-item>
            <a-button @click="toAddRole">添加角色</a-button>
        </a-form-item>
    </a-form>
    <a-table :columns="columns" :data-source="roles" rowKey="roleId" @change="handleChange" :pagination="pagination" :loading="searchLoading" bordered>
        <template v-slot:state="{text, record, index}">{{text === '1' ? '启用' : '禁用'}}</template>
        <template v-slot:operation="{userId, record, index}">
            <div class="operations">
                <a-button type="primary" @click="edit(record)">编辑</a-button>
                <a-button v-if="record.state !== '1'" @click="changeState(record.roleId)">启用</a-button>
                <a-button v-else @click="changeState(record.roleId)" type="danger">禁用</a-button>
                <a-button type="dashed" @click="toPermissionConfig(record.roleId)">权限配置</a-button>
                <a-button type="danger" v-if="myPermissions.includes('button:delete:role')" @click="deleteRole(record)">删除</a-button>
            </div>

        </template>
    </a-table>

    <a-modal v-model:visible="modalVisible" title="编辑角色" @ok="save" :confirm-loading="confirmLoading">
        <a-form :model="nowRole">
            <a-form-item label="角色" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="nowRole.role" disabled></a-input>
            </a-form-item>
            <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="nowRole.roleName"></a-input>
            </a-form-item>
            <a-form-item label="角色描述" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="nowRole.roleDesc"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal v-model:visible="addModalVisible" title="添加角色" :confirm-loading="addConfirmLoading" @ok="addRole" @cancel="resetAddRole">
        <a-form :model="newRole">
            <a-form-item label="角色" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="newRole.role"></a-input>
            </a-form-item>
            <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="newRole.roleName"></a-input>
            </a-form-item>
            <a-form-item label="角色描述" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="newRole.roleDesc"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal v-model:visible="perModalVisible" title="权限配置" :confirm-loading="perConfirmLoading" @ok="saveRolePermission">
        <a-tree :treeData="allPermissions" :replaceFields="replaceFields" :checkedKeys="rolePermissions"
                @check="checkChange" @select="checkChange" checkable checkStrictly>
        </a-tree>
    </a-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { queryRoles, updateRole, enableRole, addRole, updateRolePermission, deleteRole } from "@/api/system/role";
import {message, Modal} from "ant-design-vue";
import { UserModule } from "@/store/module/user";
import { queryPermissions, queryByRoleId } from "@/api/system/permission";
import {createVNode} from "vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue/lib";

@Options({
    name: "role"
})
export default class User extends Vue{

    private pagination = {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total: any, range: any) => `显示第${range[0]}-${range[1]}条记录,共${total}条 `
    }
    private columns = [
        { title: '角色', dataIndex: 'role', width: '20%' },
        { title: '角色名', dataIndex: 'roleName', width: '20%'},
        { title: '角色描述', dataIndex: 'roleDesc', width: '20%' },
        { title: '关联账户数', dataIndex: 'accountCount', width: '10%'},
        { title: '账号状态', dataIndex: 'state', width: '10%', slots: { customRender: 'state'}},
        { title: '操作', dataIndex: 'operation', width: '20%', slots: { customRender: 'operation'}}
    ]
    private pageInfo = {
        pageNum: 1,
        pageSize: 10
    }
    private queryRolesParam = {
        role: '',
        state: '',
        permission: ''
    }
    private roles = []
    private searchLoading = false
    private nowRole = {
        roleId: '',
        roleName: '',
        roleDesc: '',
        role: ''
    }
    private newRole = {
        roleName: '',
        roleDesc: '',
        role: ''
    }
    private modalVisible = false
    private addModalVisible = false
    private perModalVisible = false
    private confirmLoading = false
    private addConfirmLoading = false
    private perConfirmLoading = false
    public labelCol = { span: 4 }
    public wrapperCol =  { span: 20 }
    public allPermissions: any[] = [];
    public rolePermissions: any[] = [];
    replaceFields = {
        key: 'permissionId',
        title: 'permissionName',
    }
    public nowRoleId = 0;

    get myPermissions() {
        return UserModule.permissions;
    }

    created() {
        this.initRolesData()
    }

    private async initRolesData() {
        this.searchLoading = true
        const params = {
            ...this.pageInfo,
            ...this.queryRolesParam
        }
        const res: any = await queryRoles(params)
        if (res.code === 200) {
            this.roles = res.data.records
            this.pagination.total = parseInt(res.data.total)
        }

        this.searchLoading = false
    }
    private handleChange(pagination: any) {
        this.pageInfo.pageNum = pagination.current;
        this.pageInfo.pageSize = pagination.pageSize;
        this.initRolesData();
    }
    private edit(record: any) {
        this.nowRole = record
        this.modalVisible = true
    }
    private async save() {
        this.confirmLoading = true
        const res: any = await updateRole(this.nowRole)
        if (res.code === 200) {
            message.success('编辑成功')
            this.modalVisible = false
        }
        this.confirmLoading = false
        this.initRolesData()
    }
    private async changeState(roleId: number) {
        const res: any = await enableRole(roleId);
        this.initRolesData()
    }
    private toAddRole() {
        this.addModalVisible = true
    }
    private async addRole() {
        this.confirmLoading = true
        const res: any = await addRole(this.newRole)
        if (res.code === 200) {
            this.addModalVisible = false
            this.resetAddRole()
            this.initRolesData()
        }
        this.confirmLoading = false
    }
    private resetAddRole() {
        this.newRole = {
            roleName: '',
            roleDesc: '',
            role: ''
        }
    }
    private async toPermissionConfig(roleId: number) {
        if (this.allPermissions.length === 0) {
            await this.initPermissionData()
        }
        const res: any = await queryByRoleId(roleId)
        if (res.code === 200) {
            this.rolePermissions = res.data
        }
        this.nowRoleId = roleId
        this.perModalVisible = true
    }
    private async initPermissionData() {
        const res: any = await queryPermissions()
        if (res.code === 200) {
            this.allPermissions = res.data
        }
    }
    private checkChange(checkKeys: any[], event: any) {
        this.rolePermissions = checkKeys
        const cancelChecked = event.node.checked
        const children: any[] = event.node.children
        const checkedArray = (this.rolePermissions as any).checked
        const childrenKeys: any[] = children.map(child => child.key)
        if (cancelChecked && children?.length > 0) {
            (this.rolePermissions as any).checked = checkedArray.filter((item: any) => (!childrenKeys.includes(item)))
        }
        if (!cancelChecked && children?.length > 0) {
            children.forEach(child => (this.rolePermissions as any).checked.push(child.key))
        }
    }
    private async saveRolePermission() {
        const params = {
            roleId: this.nowRoleId,
            permissionIds: (this.rolePermissions as any).checked ? (this.rolePermissions as any).checked.join(",") : (this.rolePermissions as any).join(",")
        }
        const res: any = await updateRolePermission(params)
        if (res.code === 200) {
            this.perModalVisible = false
            message.success('编辑成功')
        }
    }
    private async deleteRole(record: any) {
        const self = this;
        Modal.confirm({
            title: `删除角色`,
            content: `确认删除角色:${record.role}?`,
            icon: createVNode(ExclamationCircleOutlined),
            cancelText: '取消',
            okText: '确认',
            onOk() {
                deleteRole(record.roleId).then((res: any) => {
                    if (res.code === 200) {
                        message.success('删除成功')
                        self.initRolesData()
                    }
                })
            },
        })
    }

}
</script>

<style lang="scss" scoped>
    .operations {
        display: flex;
        justify-content: flex-start;

        * {
            display: block;
            margin-right: 5px;
        }
    }
</style>
