template>
<a-table :columns="columns" :data-source="users" rowKey="userId" showPagination="auto" bordered>
    <template v-slot:avatar="{text, record, index}">
        <a-avatar :src="text" />
    </template>
</a-table>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component";
    import { queryUsers } from "@/api/user";

    @Options({
        name: "user"
    })
    export default class User extends Vue{

        private pageInfo = {
            pageNum: 1,
            pageSize: 10
        }

        private queryUserParams = {
            username: '',
            nickname: '',
            state: -1,
            role: '',
            phone: ''
        }
        private columns = [
            { title: '头像', dataIndex: 'headPhoto', width: '5%', slots: { customRender: 'avatar'}},
            { title: '账户名', dataIndex: 'username', width: '20%'},
            { title: '昵称', dataIndex: 'nickname', width: '20%' },
            { title: '联系电话', dataIndex: 'phone', width: '20%' },
            { title: '角色', dataIndex: 'roles', width: '10%' },
        ]


        private users: any[] = [];
        private total = 0;

        created() {
            this.initUserData();
        }
        private async initUserData() {
            const params = {
                ...this.queryUserParams,
                ...this.pageInfo
            }
            const res: any = await queryUsers(params);
            if (res.code === 200) {
                this.users = res.data.records;
                this.total = res.data.total;
            }
        }

    }
</script>

<style scoped>

</style>
