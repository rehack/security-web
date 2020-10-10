<template>
    <h2>您好: {{nickname}}</h2>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
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

</style>

