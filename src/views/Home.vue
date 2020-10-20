<template>
    <a-row :gutter="24" id="topItems">
        <a-col :span="topItemSpan">
            <a-card>
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
            </a-card>
        </a-col>
    </a-row>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { UserModule } from "@/store/module/user";

@Options({
    name: 'home'
})
export default class HomePage extends Vue {

    private topItemSpan = 6;

}
</script>

<style lang="scss" scoped>
#topItems {
    .ant-card {
        width: 400px;
        height: 400px;
        background-color: #3A71A8;
    }
}
</style>

