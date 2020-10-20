<template>
    <a-dropdown>
        <span class="user-dropdown">
            <a-avatar size="small" src="http://123.58.210.7:8888/group1/M00/00/00/ezrSB1-Oa5SAKiipAAAv40OjcfE747.png" />
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
import { Options, Vue } from "vue-class-component"
import { UserModule } from "@/store/module/user"

@Options({
    name: 'user'
})
export default class User extends Vue{

    get nickname() {
        return UserModule.nickname
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
