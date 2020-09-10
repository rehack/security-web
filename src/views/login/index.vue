<template>
    <div>
        <a-form :model="loginForm" :rules="loginFormCheckRules" layout="horizontal">
            <a-form-item label="用户名" name="username" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input placeholder="用户名" v-model:value="loginForm.username"></a-input>
            </a-form-item>
            <a-form-item label="密码" name="password" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input placeholder="密码" v-model:value="loginForm.password"></a-input>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 3, offset: 1 }">
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

@Options({
    name: "login",
})

export default class  extends Vue{

    public labelCol = { span: 1 }
    public wrapperCol =  { span: 3 }
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
        console.log(this.loginForm)
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
    .ant-form-item {
        margin-bottom: 6px;
    }
    .form-button {
        width: 100px;
    }
</style>
