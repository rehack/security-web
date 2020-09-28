<template>
    <div class="dashboard-container">
        <div class="dashboard-text">你好{{nickname}}</div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UserModule } from "@/store/module/user";

@Options({
    name: 'home'
})
export default class HomePage extends Vue {
    get nickname() {
        return UserModule.nickname
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>

