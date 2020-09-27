<template>
    <a-dropdown>
        <span class="user-dropdown">
            <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
            <span>{{nickname}}</span>
        </span>
        <template v-slot:overlay>
            <a-menu>
                <a-menu-item>
                    <span>个人中心</span>
                </a-menu-item>
                <a-menu-divider/>
                <a-menu-item>
                    <span>个人设置</span>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UserModule } from "@/store/module/user";

@Options({
    name: 'user'
})
export default class User extends Vue{

    get nickname() {
        return UserModule.nickname;
    }
}
</script>

<style lang="scss" scoped>
.user-dropdown {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;

    &>span {
        margin-left: 10px;
    }
}
</style>
