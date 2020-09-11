<template>
    <div class="form">
        <a-form :model="loginForm" :rules="loginFormCheckRules" layout="horizontal">
            <a-form-item name="username" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input placeholder="用户名" v-model:value="loginForm.username">
                    <template v-slot:prefix><user-outlined type="user"></user-outlined></template>
                    <template v-slot:suffix><a-tooltip title="用户名"><info-circle-outlined style="color: rgba(0,0,0,.45)" /></a-tooltip></template>
                </a-input>
            </a-form-item>
            <a-form-item name="password" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input placeholder="密码" v-model:value="loginForm.password">
                    <template v-slot:prefix><safety-outlined></safety-outlined></template>
                    <template v-slot:suffix><a-tooltip title="密码"><info-circle-outlined style="color: rgba(0,0,0,.45)" /></a-tooltip></template>
                </a-input>
            </a-form-item>
            <a-form-item :wrapper-col="wrapperCol">
                <a-row type="flex" justify="space-between">
                    <a-button type="dashed" class="form-button">注册</a-button>
                    <a-button @click="doLogin" type="primary" class="form-button">提交</a-button>
                </a-row>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UserOutlined, SafetyOutlined,InfoCircleOutlined } from "@ant-design/icons-vue";
import { UserModule } from '@/store/module/user';
import { message, notification } from "ant-design-vue";

@Options({
    name: "login",
    components: {
        UserOutlined,
        SafetyOutlined,
        InfoCircleOutlined
    }
})

export default class extends Vue{

    public labelCol = { span: 24 }
    public wrapperCol =  { span: 24 }
    public loginFormCheckRules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名不合法', trigger: 'blur' }
        ],
        password: [
            { validator: this.checkPassword ,message: '请输入密码', trigger: 'change' }
        ]
    }

    public loginForm: any = {
        username: '',
        password: ''
    }

    private doLogin() {
        UserModule.Login(this.loginForm);
    }

    private checkPassword(rule: any, value: any, promise: any) {
        if (value === '') {
            return Promise.reject('请输入密码')
        }
        return Promise.resolve();
    }
}
</script>

<style lang="scss" scoped>
    .form-button {
        width: 140px;
    }
    .form {
        position: absolute;
        width: 300px;
        height: 300px;
        background-color: rgba(0, 0, 0, .1);
        left: 40%;
        top: 25%;
        .ant-form {
            margin-top: 75px;
        }
    }
</style>
