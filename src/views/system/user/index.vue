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
        <a-form-item>
            <a-button @click="toAdd">添加用户</a-button>
        </a-form-item>
    </a-form>

    <a-table :columns="columns" :data-source="users" rowKey="userId" @change="handleChange" :pagination="pagination" :loading="searchLoading" bordered>
        <template v-slot:avatar="{text, record, index}"><a-avatar :src="text" /></template>
        <template v-slot:state="{text, record, index}"><span>{{text === '1' ? '启用' : '禁用'}}</span></template>
        <template v-slot:operation="{userId, record, index}">
            <a-button type="primary" @click="edit(record)">编辑</a-button>
            <a-button v-if="record.state !== '1'" @click="changeState(record.userId)">启用</a-button>
            <a-button v-else @click="changeState(record.userId)" type="danger">禁用</a-button>
            <a-popover title="修改密码" trigger="click">
                <template v-slot:content>
                    <a-row>
                        <a-col span="20"><a-input v-model:value="updateParams.password" /></a-col>
                        <a-col span="4"><a-button type="primary" @click="update(record.userId)">ok</a-button></a-col>
                    </a-row>
                </template>
                <a-button v-if="myPermissions.includes('button:update:password')">修改密码</a-button>
            </a-popover>
        </template>
    </a-table>

    <a-modal title="编辑用户" v-model:visible="editorVisible" :confirm-loading="editorLoading" @ok="saveUser" >
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
            <a-form-item label="用户角色" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-radio-group v-model:value="editUser.role" button-style="solid" >
                    <a-radio-button v-for="role in roles" :key="role" :value="role">{{role}}</a-radio-button>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal title="添加用户" v-model:visible="addModalVisible" :confirm-loading="addLoading" @ok="insert">
        <a-form :model="addUser" ref="userRef" :rules="userRules">
            <a-form-item name="username" label="用户名" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="addUser.username" autocomplete="off">
                    <template v-slot:prefix><user-outlined type="user"/></template>
                </a-input>
            </a-form-item>
            <a-form-item name="nickname" label="昵称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="addUser.nickname" autocomplete="off">
                    <template v-slot:prefix><user-outlined type="user"/></template>
                </a-input>
            </a-form-item>
            <a-form-item name="password" label="密码" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="addUser.password" autocomplete="off">
                    <template v-slot:prefix><insurance-outlined/></template>
                </a-input>
            </a-form-item>
            <a-form-item name="phone" label="电话" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="addUser.phone" autocomplete="off">
                    <template v-slot:prefix><contacts-outlined/></template>
                </a-input>
            </a-form-item>
            <a-form-item name="role" label="用户角色" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-radio-group v-model:value="addUser.role" button-style="solid" >
                    <a-radio-button v-for="role in roles" :key="role" :value="role">{{role}}</a-radio-button>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { queryUsers, updateUser, enableUser, addUser, updatePassword } from "@/api/user";
import { SystemRolesModule } from "@/store/module/system-roles";
import { UserOutlined, InsuranceOutlined, ContactsOutlined } from "@ant-design/icons-vue/lib";
import { message } from 'ant-design-vue';
import { UserModule } from '@/store/module/user';

@Options({
    name: "user",
    components: {
        UserOutlined,
        InsuranceOutlined,
        ContactsOutlined
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
        { title: '账户名', dataIndex: 'username', width: '15%'},
        { title: '昵称', dataIndex: 'nickname', width: '20%' },
        { title: '联系电话', dataIndex: 'phone', width: '20%'},
        { title: '角色', dataIndex: 'roles', width: '10%' },
        { title: '账号状态', dataIndex: 'state', width: '10%', slots: { customRender: 'state'}},
        { title: '操作', dataIndex: 'operation', width: '20%', slots: { customRender: 'operation'}}
    ]
    private userRules = {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
        nickname: [ { required: true, message: '请输入昵称', trigger: 'blur' } ],
        password: [ { validator: this.checkPassword ,trigger: 'blur'}],
        phone: [ { min: 11, max: 11, message: '电话号码格式错误', trigger: 'blur'},
            { required: true, message: '请输入电话', trigger: 'blur' }],
        role: [ { required: true, message: '请选择用户角色', trigger: 'blur' } ]
    }
    private pagination = {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total: any, range: any) => `显示第${range[0]}-${range[1]}条记录,共${total}条 `
    }

    public labelCol = { span: 4 }
    public wrapperCol =  { span: 20 }
    private users = [];
    private searchLoading = false;
    private editorVisible = false;
    private editorLoading = false;
    private addLoading = false;
    private editUser = {
        userId: '',
        nickname: '',
        phone: '',
        username: '',
        role: ''
    };
    private addUser = {
        username: '',
        nickname: '',
        password: '',
        phone: '',
        sign: '',
        headPhoto: '',
        role: '',
    }
    private addModalVisible = false
    private updateParams = {
        userId: '',
        password: ''
    }

    get roles() {
        if (SystemRolesModule.systemRoles.length <= 1) {
            SystemRolesModule.initRoles().then(() => {
                return SystemRolesModule.systemRoles;
            })
        }
        return SystemRolesModule.systemRoles;
    }
    get myPermissions() {
        return UserModule.permissions;
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
        if (res.code === 200) {
            this.users = res.data.records;
            this.pagination.total = parseInt(res.data.total);
        }
        this.searchLoading = false;
    }
    private checkPassword(rule: any, value: any, promise: any) {
        if (value === '') {
            return Promise.reject('请输入密码')
        }
        if (value.length < 6 || value.length > 10) {
            return Promise.reject('密码是6-10位')
        }
        return Promise.resolve();
    }
    private handleChange(pagination: any) {
        this.pageInfo.pageNum = pagination.current;
        this.pageInfo.pageSize = pagination.pageSize;
        this.initUserData();
    }
    private edit(user: any) {
        Object.assign(this.editUser, user);
        this.editUser.role = user.roles[0].children;
        this.editorVisible = true;
    }
    private async saveUser() {
        this.editorLoading = true;
        (this.editUser as any).roles = '';
        (this.editUser as any).permissions = '';
        const res: any = await updateUser(this.editUser)
        if (res.code === 200) {
            this.editorVisible = false;
            message.success('编辑成功')
            this.initUserData()
        }
        this.editorLoading = false;
    }
    private async changeState(userId: any) {
        const res: any = await enableUser(userId)
        if (res.code === 200) {
            this.initUserData()
        }
    }
    private toAdd() {
        this.addModalVisible = true;
        const ref = (this.$refs.userRef as any)
        if (ref) {
            ref.resetFields()
        }
    }
    private async insert() {
        const ref = (this.$refs.userRef as any)
        ref.validate().then(() => {
            this.addLoading = true
            addUser(this.addUser).then((res: any) => {
                if (res.code === 200) {
                    this.addModalVisible = false
                    message.info('添加成功')
                    this.initUserData()
                }
                this.addLoading = false
            })
        })
    }
    private async update(userId: any) {
        this.updateParams.userId = userId
        const res: any = await updatePassword(this.updateParams)
        if (res.code === 200) {
            message.success('更改成功')
            this.initUserData()
        }
    }

}
</script>

<style scoped>

</style>
