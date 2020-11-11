<template>
    <a-row id="topItems">
        <a-col :span="topItemSpan">
            <a-card>
                用户具有的角色: {{roles}}
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
                <a-button type="primary" @click="roleTestOr">admin或者super权限按钮</a-button>
                <a-button type="danger" @click="roleTestAnd">admin并且super权限按钮</a-button>
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
                用户具有的权限: {{permissions}}
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
                <a-button type="primary" @click="permissionTestOr">button:update:password或button:update:super</a-button>
                <a-button type="danger" @click="permissionTestForbidden">button:update:super</a-button>
            </a-card>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { UploadOutlined } from '@ant-design/icons-vue';
import { roleTestOr, roleTestAnd, permissionTestForbidden, permissionTestOr } from "@/api/test";
import {UserModule} from "@/store/module/user";
import {message} from "ant-design-vue";

@Options({
    name: 'home',
    components: {
        UploadOutlined
    }
})
export default class HomePage extends Vue {

    private topItemSpan = 6;

    get roles() {
        return UserModule.roles;
    }

    get permissions() {
        return UserModule.permissions;
    }

    private async roleTestOr() {
        const res: any = await roleTestOr();
        message.success(res.data);
    }
    private async roleTestAnd() {
        const res: any = await roleTestAnd();
    }
    private async permissionTestForbidden() {
        const res: any = await permissionTestForbidden();
    }
    private async permissionTestOr() {
        const res: any = await permissionTestOr();
        message.success(res.data);
    }

}
</script>

<style lang="scss" scoped>
</style>

