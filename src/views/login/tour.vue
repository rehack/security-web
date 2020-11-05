<template>
    <a-modal title="游客登录" v-model:visible="tourLoginVisible" :footer="null" :keyboard="false" :maskClosable="false" :closable="false">
        <a-tabs v-model:active-key="activeKey">
            <a-tab-pane key="1" :disabled="loginTabDisabled">
                <template v-slot:tab>
                    <span>
                        <apple-outlined />发起登录
                    </span>
                </template>
            </a-tab-pane>
            <a-tab-pane key="2" :disabled="permissionTabDisabled">
                <template v-slot:tab>
                    <span>
                        <apple-outlined />加载权限
                    </span>
                </template>
            </a-tab-pane>
            <a-tab-pane key="3" :disabled="jumpTabDisabled">
                <template v-slot:tab>
                    <span>
                        <apple-outlined />跳转首页
                    </span>
                </template>
            </a-tab-pane>
        </a-tabs>
        <a-progress :percent="loginPercent" />
    </a-modal>
</template>

<script lang="ts">
import { UserOutlined, SafetyOutlined,InfoCircleOutlined, AppleOutlined, SmileOutlined } from "@ant-design/icons-vue";
import { UserModule } from '@/store/module/user';
import { message, notification, Form } from "ant-design-vue";
import { Options, Vue } from "vue-class-component"
import router from "@/router";
import {PermissionModule} from "@/store/module/permissions";

@Options({
    name: 'tour',
    components: {
        AppleOutlined,
        SmileOutlined
    }
})
export default class Tour extends Vue{

    private isLoginReqLoading = false
    private tourLoginVisible = true
    private loginTabDisabled = false
    private permissionTabDisabled = true
    private jumpTabDisabled = true
    private loginPercent = 0
    private loginForm = {
        username: 'tour',
        password: 'wowangle'
    }
    private activeKey = 1

    created() {
        if (UserModule.access_token) {
            this.$router.push('/')
        } else {
            this.doLogin()
        }
    }

    private async doLogin() {
        UserModule.Login(this.loginForm).then((loginState) => {
            this.loginTabDisabled = true
            this.permissionTabDisabled = false
            this.activeKey = 2
        }).then(() => {
            UserModule.GetUserInfo().then((res: any) => {
                const roles: string[] = UserModule.roles;
                const permissions: string[] = UserModule.permissions;
                PermissionModule.GenerateRoutes({roles, permissions});
                PermissionModule.dynamicRoutes.forEach(route => {
                    router.addRoute(route)
                })
                const permissionInterval = setInterval(() => {
                    if (this.loginPercent < 100) {
                        this.loginPercent = this.loginPercent + 1
                    } else {
                        clearInterval(permissionInterval)
                        notification.success({
                            message: '欢迎登录',
                            description: '即将跳转到首页...',
                            duration: 3
                        })
                        const jumpInterval = setTimeout(() => {
                            this.$router.push("/")
                        }, 3000)
                    }
                }, 40);
                this.permissionTabDisabled = true
                this.jumpTabDisabled = false
                this.activeKey = 3
            })
        })
    }

}
</script>

<style lang="scss" scoped>

</style>
