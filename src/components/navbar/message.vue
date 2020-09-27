<template>
    <a-popover trigger="click" placement="bottomRight" v-model:visible="visible">
        <template v-slot:content>
            <a-tabs>
                <a-tab-pane :key="tabs[0]" :tab="tabs[0]">
                    <a-list>
                        <a-list-item>
                            <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                                <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                            </a-list-item-meta>
                        </a-list-item>
                        <a-list-item>
                            <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                                <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                            </a-list-item-meta>
                        </a-list-item>
                        <a-list-item>
                            <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                                <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                            </a-list-item-meta>
                        </a-list-item>
                    </a-list>
                </a-tab-pane>
                <a-tab-pane :key="tabs[1]" :tab="tabs[1]">
                    消息
                </a-tab-pane>
                <a-tab-pane :key="tabs[2]" :tab="tabs[2]">
                    待办
                </a-tab-pane>
            </a-tabs>
        </template>
        <a-badge :dot="badgeShow" color="cyan">
            <bell-outlined class="navbar-message" />
        </a-badge>

    </a-popover>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BellOutlined } from "@ant-design/icons-vue/lib";

@Options({
    name: 'message',
     components: {
         BellOutlined
     }
})
export default class Message extends Vue{

    private tabs = ['公告', '消息', '待办'];
    private visible = false;
    private badgeShow = true;

}
</script>

<style lang="scss" scoped>
.navbar-message {
    font-size: 20px;
    cursor: pointer;
}
</style>
