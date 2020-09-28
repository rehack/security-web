<template>
    <a-form :model="queryUserParams" ref="userFilterRef" layout="inline">
        <a-form-item>
            <a-input placeholder="账户名称" v-model:value="queryUserParams.username" autocomplete="off" allowClear/>
        </a-form-item>
        <a-form-item>
            <a-input placeholder="昵称" v-model:value="queryUserParams.nickname" autocomplete="off" allowClear/>
        </a-form-item>
        <a-form-item>
            <a-input placeholder="电话" v-model:value="queryUserParams.phone" autocomplete="off" allowClear/>
        </a-form-item>
        <a-form-item>
            <a-select v-model:value="queryUserParams.state" placeholder="账号状态" style="width: 120px" allowClear>
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item>
            <a-select v-model:value="queryUserParams.role" placeholder="用户角色" style="width: 120px" allowClear>
                <a-select-option v-for="role in roles" :key="role" :value="role">{{role}}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="initUserData" :loading="searchLoading">搜索</a-button>
        </a-form-item>
    </a-form>

    <a-table :columns="columns" :data-source="users" rowKey="userId" @change="handleChange" :pagination="pagination" :loading="searchLoading" bordered>
        <template v-slot:avatar="{text, record, index}"><a-avatar :src="text" /></template>
        <template v-slot:state="{text, record, index}"><span>{{text === 1 ? '启用' : '禁用'}}</span></template>
        <template v-slot:operation="{userId, record, index}"><a-button type="primary" @click="edit(record)">编辑</a-button></template>
    </a-table>

    <a-modal title="编辑用户" v-model:visible="editorVisible" :confirm-loading="editorLoading" @ok="saveUser">
        <a-form :model="editUser" layout="horizontal">
            <a-form-item label="用户名" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="editUser.username" disabled>
                    <template v-slot:prefix><user-outlined type="user"/></template>
                </a-input>
            </a-form-item>
            <a-form-item label="昵称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="editUser.nickname" />
            </a-form-item>
            <a-form-item label="电话" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="editUser.phone" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import { queryUsers } from "@/api/user";
    import { RolesModule } from "@/store/module/roles";
    import { UserOutlined } from "@ant-design/icons-vue/lib";

    @Options({
        name: "user",
        components: {
            UserOutlined
        }
    })
    export default class User extends Vue{

        private pageInfo = {
            pageNum: 1,
            pageSize: 10
        }

        private queryUserParams = {
            username: '',
            nickname: '',
            state: '',
            role: '',
            phone: ''
        }
        private columns = [
            { title: '头像', dataIndex: 'headPhoto', width: '5%', slots: { customRender: 'avatar'}},
            { title: '账户名', dataIndex: 'username', width: '20%'},
            { title: '昵称', dataIndex: 'nickname', width: '20%' },
            { title: '联系电话', dataIndex: 'phone', width: '20%'},
            { title: '角色', dataIndex: 'roles', width: '10%' },
            { title: '账号状态', dataIndex: 'state', width: '10%', slots: { customRender: 'state'}},
            { title: '操作', dataIndex: 'operation', width: '15%', slots: { customRender: 'operation'}}
        ]
        private pagination = {
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30'],
        }

        public labelCol = { span: 3 }
        public wrapperCol =  { span: 21 }
        private users = [];
        private total = 0;
        private searchLoading = false;
        private editorVisible = false;
        private editorLoading = false;
        private editUser = {
            userId: '',
            nickname: '',
            phone: '',
            username: ''
        };

        get roles() {
            if (RolesModule.roles.length === 0) {
                RolesModule.initRoles()
            }
            return RolesModule.roles;
        }

        created() {
            this.initUserData();
        }
        private async initUserData() {
            this.searchLoading = true;
            const params = {
                ...this.queryUserParams,
                ...this.pageInfo
            }
            const res: any = await queryUsers(params);
            if (res.code === '200') {
                this.users = res.data.records;
                this.total = res.data.total;
            }
            this.searchLoading = false;
        }
        private handleChange(pagination: any) {
            this.pageInfo.pageNum = pagination.current;
            this.pageInfo.pageSize = pagination.pageSize;
            this.initUserData();
        }
        private edit(user: any) {
            this.editUser = user;
            this.editorVisible = true;
        }
        private saveUser() {
            this.editorLoading = true
            console.log(this.editUser)
            this.editorVisible = false;
            this.editorLoading = false;
        }

    }
</script>

<style scoped>

</style>
