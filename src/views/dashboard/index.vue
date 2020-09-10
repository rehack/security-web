<template>
    <div v-bind:style="{'width': menuWidth}">
        <a-menu :default-selected-keys="['dashboard']" :default-open-keys="['sub-1']"
                mode="inline" :inline-collapsed="collapsed">
            <a-menu-item key="dashboard">
                <a-row class="top-content">
                    <span>ShopMall</span>
                </a-row>
            </a-menu-item>
            <template v-for="item in menuItems" >
                <a-sub-menu v-if="item.children" :key="item.key">
                    <span slot="title"><a-icon type="setting" /><span>{{item.name}}</span></span>
                    <a-menu-item v-for="childItem in item.children" :key="childItem.key">
                        {{childItem.name}}
                    </a-menu-item>
                </a-sub-menu>
            </template>
            <template v-for="item in menuItems">
                <a-menu-item  v-if="!item.children" :key="item.key">
                    {{item.name}}
                </a-menu-item>
            </template>
        </a-menu>
    </div>
</template>

<script lang="ts">
import {AES_CBC_Decrypt, AES_CBC_Encrypt} from "@/utils/crypt";
import { Options, Vue } from "vue-class-component";

@Options({
    name: 'dashboard'
})
export default class extends Vue {

    private menuWidth = '200px';
    private collapsed = false;
    private menuItems = [
        {key: 1, name: '订单管理', children: [
                {key: 'sub-1', name: '订单信息'},
                {key: 'sub-2', name: '订单核销'}
            ]},
        {key: 2, name: '商品管理', children: [
                {key: 'sub-3', name: '品类库'}
            ]},
        {key: 3, name: '购物车管理'}
    ];

    /** 菜单收起与打开 */
    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

    created(): void {
    }
}
</script>

<style lang="scss" scoped>
    .top-content {
        font-size: 20px;
    }
</style>
