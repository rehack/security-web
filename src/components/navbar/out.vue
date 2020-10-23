<template>
    <poweroff-outlined @click="logout" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PoweroffOutlined } from "@ant-design/icons-vue/lib";
import { UserModule } from "@/store/module/user";
import { message } from "ant-design-vue";

@Options({
    name: "logout",
    components: {
        PoweroffOutlined
    }
})
export default class Out extends Vue{

    private isLoading = false;

    private logout() {
        UserModule.LogOut().then((logoutSate) => {
            if (logoutSate) {
                this.$router.push("/login")
                return;
            }
            this.isLoading = false;
            message.error('登出失败')
        })
    }
}
</script>

<style scoped>
</style>
