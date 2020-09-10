<template>
    <div>
        <a-form :form="loginForm" layout="horizontal">
            <a-form-item>
                <a-input placeholder="用户名">
                    <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, .25)" />
                </a-input>
                <a-input placeholder="密码">
                    <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, .25)" />
                </a-input>
            </a-form-item>
            <a-button @click="doLogin">提交</a-button>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "login",
})

export default class  extends Vue{
    public loginForm: any = {
        username: '',
        password: ''
    }

    private doLogin() {
    }
}
</script>

<style scoped>

</style>
