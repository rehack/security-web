<template>
    <div class="page">
        <div class="form">
            <a-form :model="loginForm" :rules="loginFormCheckRules" layout="horizontal" ref="loginRef">
                <a-form-item name="username" :label-col="labelCol" :wrapper-col="wrapperCol" has-feedback>
                    <a-input placeholder="用户名" v-model:value="loginForm.username" size="large" autocomplete="off">
                        <template v-slot:prefix><user-outlined type="user"></user-outlined></template>
                        <template v-slot:suffix><a-tooltip title="用户名"><info-circle-outlined style="color: rgba(0,0,0,.45)" /></a-tooltip></template>
                    </a-input>
                </a-form-item>
                <a-form-item name="password" :label-col="labelCol" :wrapper-col="wrapperCol" has-feedback>
                    <a-input placeholder="密码" v-model:value="loginForm.password" size="large" autocomplete="off">
                        <template v-slot:prefix><safety-outlined></safety-outlined></template>
                        <template v-slot:suffix><a-tooltip title="密码"><info-circle-outlined style="color: rgba(0,0,0,.45)" /></a-tooltip></template>
                    </a-input>
                </a-form-item>
                <a-form-item :wrapper-col="wrapperCol">
                    <a-button @click="doLogin" type="primary" class="form-button" :loading="isLoginReqLoading">登录</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script lang="ts">
import { UserOutlined, SafetyOutlined,InfoCircleOutlined } from "@ant-design/icons-vue";
import { UserModule } from '@/store/module/user';
import { message, notification, Form } from "ant-design-vue";
import { Options, Vue } from "vue-class-component"

@Options({
    name: "login",
    components: {
        UserOutlined,
        SafetyOutlined,
        InfoCircleOutlined
    }
})

export default class Login extends Vue {

    public labelCol = { span: 24 }
    public wrapperCol =  { span: 24 }
    public loginFormCheckRules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
            { validator: this.checkPassword ,message: '请输入密码', trigger: 'blur' }
        ]
    }
    private isLoginReqLoading = false

    public loginForm = {
        username: '',
        password: ''
    }

    private doLogin() {
        this.isLoginReqLoading = true;
        (this.$refs.loginRef as any).validate().then(() => {
            UserModule.Login(this.loginForm).then((loginState) => {
                if (loginState) {
                    this.$router.push("/dashboard")
                } else {
                    message.error("用户名或密码错误")
                }
                this.isLoginReqLoading = false
            })
        }).catch(() => {
            Promise.reject('登录失败')
            this.isLoginReqLoading = false
        })
    }

    private checkPassword(rule: any, value: any, promise: any) {
        if (value === '') {
            return Promise.reject('请输入密码')
        }
        return Promise.resolve()
    }

}
</script>

<style lang="scss" scoped>
    .form-button {
        width: 100%;
    }
    .form {
        position: absolute;
        width: 300px;
        height: 300px;
        left: 40%;
        top: 25%;
        .ant-form {
            margin-top: 75px;
        }
        background-color: #e8dfdf;
        border: 1px solid #d5d0d0;
        border-radius: 10px;
    }
    .page {
        width: 100%;
        height: 100vh;
        background-color: #e8dfdf;
    }
</style>
