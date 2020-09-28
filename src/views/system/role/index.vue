<template>
    <a-form :model="queryRolesParam" layout="inline">
        <a-form-item>
            <a-input placeholder="角色" v-model:value="queryRolesParam.role" autocomplete="off" allowClear/>
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
    </a-form>
    <a-table :columns="columns" :data-source="roles" rowKey="roleId" @change="handleChange" :pagination="pagination" :loading="searchLoading" bordered>
        <template v-slot:state="{text, record, index}">{{text === 1 ? '启用' : '禁用'}}</template>
        <template v-slot:operation="{userId, record, index}"><a-button type="primary">编辑</a-button></template>
    </a-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { queryRoles} from "@/api/role";

@Options({
    name: "role"
})
export default class User extends Vue{

    private pagination = {
        pageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30'],
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
        state: ''
    }
    private roles = []
    private total = 0
    private searchLoading = false

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
        if (res.code === '200') {
            this.roles = res.data.records
            this.total = res.data.total
        }

        this.searchLoading = false
    }
    private handleChange(pagination: any) {
        this.pageInfo.pageNum = pagination.current;
        this.pageInfo.pageSize = pagination.pageSize;
        this.initRolesData();
    }

}
</script>

<style scoped>

</style>
