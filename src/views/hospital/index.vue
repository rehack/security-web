<template>
    <a-form :model="queryHospitalParams" ref="hospitalFilterRef" layout="inline">
        <a-form-item>
            <a-input placeholder="医院ID" v-model:value="queryHospitalParams.hsId" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-input placeholder="医院名称" v-model:value="queryHospitalParams.hsName" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" :loading="searchLoading" @click="initHospitalData">搜索</a-button>
        </a-form-item>
        <a-form-item>
            <a-button @click="toAdd">新增</a-button>
        </a-form-item>
    </a-form>

    <a-table :columns="columns" :data-source="hospitals" rowKey="hsId" @change="handleChange" :pagination="pagination" :loading="searchLoading" bordered>
        <template v-slot:hsIndex="{text, record, index}">
            <span>{{++index}}</span>
        </template>
        <template v-slot:operation="{text, record, index}">
            <a-button type="primary" :disabled="refreshDisabled" @click="refresh(record.hsId)">刷新</a-button>
            <a-button @click="toEdit(record)" >编辑</a-button>
            <a-popconfirm title="该操作会删除该医院下的所有商品，是否继续？" cancelText="取消" okText="确定" @confirm="remove(record.hsId)">
                <template v-slot:icon><question-circle-outlined style="color: red"/></template>
                <a-button type="danger">删除</a-button>
            </a-popconfirm>
            <a-button @click="toGoodsList(record.hsId)">查看商品</a-button>
        </template>
    </a-table>

    <a-modal title="新增" v-model:visible="addVisible" :confirm-loading="addLoading" @ok="addHospital">
        <a-form :model="newHospital" ref="newHsRef" :rules="newHsRules">
            <a-form-item name="hsPlatform" label="源类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select v-model:value="newHospital.hsPlatform" placeholder="源类型" allowClear>
                    <a-select-option value="新氧">新氧</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item name="openId" label="医院ID" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="newHospital.openId" autocomplete="off" />
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal title="编辑" v-model:visible="editVisible" :confirm-loading="editLoading" @ok="updateHospital" @cancel="cancelEdit">
        <a-form :model="editHospital" ref="editHsRef" :rules="newHsRules">
            <a-form-item name="hsPlatform" label="源类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select v-model:value="editHospital.hsPlatform" placeholder="源类型" allowClear>
                    <a-select-option value="新氧">新氧</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item name="openId" label="医院ID" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model:value="editHospital.openId" autocomplete="off" />
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal title="商品列表" v-model:visible="goodsListVisible" :footer="null" width="1200px">
        <a-table :columns="goodsColumns" :data-source="goods" rowKey="cpId" @change="handleGoodsListChange"
                 :pagination="goodsPagination" :loading="goodsSearchLoading" :scroll="{ x: 1000, y: 600 }" bordered>
            <template v-slot:goodsTags="{text, record, index}">
                <span v-for="(txt, index) in text.split(',')" :key="txt">【{{txt}}】</span>
            </template>
        </a-table>
    </a-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { queryHospitals, addHospital, updateHospital, deleteHospital, queryGoodsList, updateHospitalData } from "@/api/hospital"
import {message} from "ant-design-vue"
import { QuestionCircleOutlined } from "@ant-design/icons-vue/lib"

@Options({
    name: 'hospital-goods',
    components: {
        QuestionCircleOutlined
    }
})
export default class HospitalGoods extends Vue{

    private searchLoading = false
    private goodsSearchLoading = false
    private pageInfo = {
        page: 1,
        limit: 10
    }
    private goodsPageInfo = {
        page: 1,
        limit: 50
    }
    private queryHospitalParams = {
        openId: '',
        hsName: '',
    }
    private columns = [
        { title: '序号', dataIndex: 'index', width: '10%', slots: {customRender: 'hsIndex'} },
        { title: '医院名称', dataIndex: 'hsName', width: '20%' },
        { title: '源类型', dataIndex: 'hsPlatform', width: '10%' },
        { title: '医院ID', dataIndex: 'hsId', width: '15%' },
        { title: '最近更新时间', dataIndex: 'updateTime', width: '20%' },
        {title: '操作', dataIndex: 'operations', width: '25%', slots: { customRender: 'operation' }}
    ]
    private goodsColumns = [
        { title: '医院名称', dataIndex: 'hsName', width: '20%' },
        { title: '商品名称', dataIndex: 'goodsTag', width: '30%', slots: {customRender: 'goodsTags'} },
        { title: '商品ID', dataIndex: 'cpId', width: '15%' },
        { title: '来源', dataIndex: 'platform', width: '5%' },
        { title: '价格', dataIndex: 'goodsPrice', width: '5%' },
    ]
    private goodsPagination = {
        total: 0,
        pageSize: 50,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showQuickJumper: true,
        showTotal: (total: any, range: any) => `显示第${range[0]}-${range[1]}条记录,共${total}条 `
    }
    private pagination = {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total: any, range: any) => `显示第${range[0]}-${range[1]}条记录,共${total}条 `
    }
    private hospitals = []
    private goods = []
    private addVisible = false
    private editVisible = false
    private editLoading = false
    private addLoading = false
    private newHospital = {
        openId: '',
        hsPlatform: '新氧'
    }
    private editHospital = {
        hsId: '',
        openId: '',
        hsPlatform: '新氧'
    }
    public labelCol = { span: 4 }
    public wrapperCol =  { span: 20 }
    private newHsRules = {
        openId: [ { required: true, message: '请输入医院ID', trigger: 'blur' } ],
        hsPlatform: [ { required: true, message: '请输入源类型', trigger: 'blur' } ],
    }
    private goodsListVisible = false
    private hsId = ''
    private refreshDisabled = false


    created() {
        this.initHospitalData()
    }

    private async initHospitalData() {
        this.searchLoading = true
        const params = {
            ...this.queryHospitalParams,
            ...this.pageInfo
        }
        const res: any = await queryHospitals(params)
        if (res.code === '200') {
            this.hospitals = res.data.list
            this.pagination.total = parseInt(res.data.total)
        }
        this.searchLoading = false
    }
    private async initGoodsListData() {
        const params: any = {
            hsId: this.hsId,
            ...this.goodsPageInfo
        }
        this.goodsSearchLoading = true
        const res: any = await queryGoodsList(params)
        if (res.code === '200') {
            this.goods = res.data.list
            this.goodsPagination.total = parseInt(res.data.total)
        }
        this.goodsSearchLoading = false
    }

    private handleChange(pagination: any) {
        this.pageInfo.page = pagination.current;
        this.pageInfo.limit = pagination.pageSize;
        this.initHospitalData();
    }
    private handleGoodsListChange(pagination: any) {
        this.goodsPageInfo.page = pagination.current;
        this.goodsPageInfo.limit = pagination.pageSize;
        this.initGoodsListData()
    }

    private toAdd() {
        const ref: any = (this.$refs.newHsRef as any)
        if (ref) {
            ref.resetFields()
        }
        this.addVisible = true
    }
    private  addHospital() {
        (this.$refs.newHsRef as any).validate().then(() => {
            this.addLoading = true;
            addHospital(this.newHospital).then((res: any) => {
                if (res.code === '200') {
                    message.success('新增成功')
                }
                this.addVisible = false
                this.addLoading = false
            })
        }).catch(() => {
            Promise.reject('新增失败')
            this.addLoading = false
        })
    }

    private toEdit(hospital: any) {
        this.editVisible = true
        this.editHospital.hsId = hospital.hsId
        this.editHospital.openId = hospital.openId
        this.editHospital.hsPlatform = hospital.hsPlatform
    }
    private updateHospital() {
        (this.$refs.editHsRef as any).validate().then(() => {
            this.editLoading = true
            updateHospital(this.editHospital).then((res: any) => {
                if (res.code === '200') {
                    message.success('编辑成功')
                }
                this.editVisible = false
                this.editLoading = false
                this.cancelEdit()
                this.initHospitalData()
            }).catch(() => {
                Promise.reject('编辑失败')
                this.addLoading = false
            })
        })
    }
    private cancelEdit() {
        const ref: any = (this.$refs.editHsRef as any)
        if (ref) {
            ref.resetFields()
        }
    }

    private async remove(hsId: any) {
        const params: any = {
            hsId
        }
        /*const res: any = await deleteHospital(params)
        if (res.code === '200') {
            message.success('删除成功')
        }*/
    }

    private async toGoodsList(hsId: any) {
        this.goodsListVisible = true
        this.hsId = hsId
        this.initGoodsListData()
    }

    private async refresh(hsId: any) {
        this.refreshDisabled = true
        const res: any = await updateHospitalData(hsId)
        if (res.code === '200') {
            this.refreshDisabled = false
        }
    }
}
</script>

<style scoped>

</style>
