<template>
    <a-form :model="queryFileParam" layout="inline">
        <a-form-item>
            <a-input placeholder="上传者IP" v-model:value="queryFileParam.uploaderIp" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-input placeholder="文件名称" v-model:value="queryFileParam.fileName" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-input placeholder="文件大小起" style="width: 120px" v-model:value="queryFileParam.fileSizeStart" @blur="resetFileSize" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-input placeholder="文件大小止" style="width: 120px"  v-model:value="queryFileParam.fileSizeEnd" @blur="resetFileSize" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-select v-model:value="checkedFileSizeFormat" style="width: 120px" placeholder="文件单位" @change="resetFileSize" allowClear>
                <a-select-option v-for="fileSizeFormater in fileSizeFormat"
                                 :key="fileSizeFormater" :value="fileSizeFormater">{{ fileSizeFormater }}
                </a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item>
            <a-range-picker v-model:value="date" @change="dateChange" :placeholder="['开始日期', '结束日期']" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" allowClear />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" :loading="searchLoading" @click="initFileData">搜索</a-button>
            <a-button :loading="downloading" @click="downloadZip">批量下载</a-button>
        </a-form-item>
    </a-form>

    <a-table :columns="fileColumns" :data-source="fileData" rowKey="fileId" @change="paginationChange"
            :pagination="pagination" :loading="searchLoading" :row-selection="rowSelection" bordered>
        <template v-slot:preview="{ text, record, index }">
            <div class="file-image">
                <img :src="fileServerLink + text" v-if="isImage(text)" />
                <img src="http://123.58.210.7:8888/group1/M00/00/00/ezrSB1-Oa5SAKiipAAAv40OjcfE747.png" v-else />
            </div>
        </template>
        <template v-slot:fileFullPath="{ text, record, index }">
            <span class="fullPath" @click="doCopy(text)">{{text}}</span>
        </template>
        <template v-slot:operation="{ text, record, index }">
            <div class="operations">
                <a-button @click="download(record)" :disabled="removeButtonDisbled">下载</a-button>
                <a-button type="danger" @click="remove(record.fileId)" :disabled="removeButtonDisbled">删除</a-button>
            </div>
        </template>
    </a-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { searchFromDb, removeOne, downloadById, downloadByIds } from '@/api/file'
import { SettingsModule} from "@/store/module/settings"
import { copy } from "iclipboard/esm";
import { message } from "ant-design-vue";
import { download } from "@/utils/file";

@Options({
    name: 'file-DB'
})
export default class FileDB extends Vue{

    private queryFileParam = {
        uploaderIp: '',
        fileName: '',
        fileSizeStart: '',
        fileSizeEnd: '',
        dateStart: '',
        dateEnd: ''
    }
    private fileSizeFormat = ['Kb', 'KB', 'MB']
    private checkedFileSizeFormat = ''
    private fileData = []
    private date = []
    private searchLoading = false
    private imageFormats = ['jpg', 'png', 'gif', 'jpeg']
    private removeButtonDisbled = false
    private downloading = false
    private fileColumns = [
        { title: '文件预览', dataIndex: 'fileFullPath', width: '10%', slots: { customRender: 'preview'} },
        { title: '文件ID', dataIndex: 'fileId', width: '15%' },
        { title: '上传者IP', dataIndex: 'uploaderIp', width: '10%' },
        { title: '文件名称', dataIndex: 'fileName', width: '15%' },
        { title: '文件大小', dataIndex: 'fileCalSize', width: '10%' },
        { title: '文件路径', dataIndex: 'fileFullPath', width: '30%', slots: { customRender: 'fileFullPath' } },
        {title: '操作', dataIndex: 'operations', width: '10%', slots: { customRender: 'operation' }}
    ]
    private pagination = {
        total: 0,
        current: 1,
        pageSize: 6,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['6', '10', '20', '50'],
        showTotal: (total: any, range: any) => `显示第${range[0]}-${range[1]}条记录,共${total}条 `
    }
    private selectedIds: any[] = []
    private rowSelection = {
        onChange: (selectedRowKeys: any[]) => {
            this.selectedIds = selectedRowKeys
        }
    }

    get fileServerLink() {
        return SettingsModule.fileServerLink
    }

    created() {
        this.initFileData()
    }

    private doCopy(fileFullPath: string) {
        if (copy(this.fileServerLink + fileFullPath)) {
            message.success('复制成功')
        } else {
            message.error('复制失败')
        }
    }

    private initFilterParams(): Object {
        const newFilterParams = {
            uploaderIp: '',
            fileName: '',
            fileSizeStart: '',
            fileSizeEnd: '',
            dateStart: '',
            dateEnd: ''
        }
        Object.assign(newFilterParams, this.queryFileParam)
        if (this.queryFileParam.fileSizeStart && this.queryFileParam.fileSizeEnd) {
            if (this.checkedFileSizeFormat === this.fileSizeFormat[1]) {
                newFilterParams.fileSizeStart = (parseFloat(this.queryFileParam.fileSizeStart) * 1024).toString()
                newFilterParams.fileSizeEnd = (parseFloat(this.queryFileParam.fileSizeEnd) * 1024).toString()
            } else if (this.checkedFileSizeFormat === this.fileSizeFormat[2]) {
                newFilterParams.fileSizeStart = (parseFloat(this.queryFileParam.fileSizeStart) * 1024 * 1024).toString()
                newFilterParams.fileSizeEnd = (parseFloat(this.queryFileParam.fileSizeEnd) * 1024 * 1024).toString()
            }
        }
        return newFilterParams
    }

    private async initFileData() {
        this.searchLoading = true
        const queryParam = {
            ...this.initFilterParams(),
            pageNum: this.pagination.current,
            pageSize: this.pagination.pageSize
        }
        const res: any = await searchFromDb(queryParam)
        if (res.code === 200) {
            this.fileData = res.data.records
            this.pagination.total = parseInt(res.data.total)
        }
        this.searchLoading = false
    }

    private resetFileSize() {
        if (parseFloat(this.queryFileParam.fileSizeEnd) < parseFloat(this.queryFileParam.fileSizeStart)) {
            const temp = this.queryFileParam.fileSizeEnd
            this.queryFileParam.fileSizeEnd = this.queryFileParam.fileSizeStart
            this.queryFileParam.fileSizeStart = temp
        }
    }

    private dateChange() {
        this.queryFileParam.dateStart = this.date[0]
        this.queryFileParam.dateEnd = this.date[1]
    }

    private paginationChange(pagination: any) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.initFileData()
    }

    private isImage(fileFullPath: string): boolean {
        let isImage = false
        this.imageFormats.forEach(format => {
            if (fileFullPath.includes(format)) {
                isImage = true
            }
        })
        return isImage
    }

    private async remove(fileId: string) {
        this.removeButtonDisbled = true
        const res: any = await removeOne(fileId)
        if (res.code === 200) {
            message.success('已删除')
            this.initFileData();
        }
        this.removeButtonDisbled = false
    }

    private download(record: any) {
        this.removeButtonDisbled = true
        downloadById(record.fileId).then((res: any) => {
            download(res, record.fileName)
        }).then(() => {
            this.removeButtonDisbled = false
            this.initFileData()
        }).catch(error => {
            this.removeButtonDisbled = false
        })
    }

    private downloadZip() {
        this.downloading = true
        if (this.selectedIds.length <= 0) {
            message.warn('请选择文件')
            this.downloading = false
            return;
        }
        const ids = this.selectedIds.join(",")
        const params: any = {
            ids
        }
        downloadByIds(params).then((res: any) => {
            download(res, 'YouHappyJustOk.zip')
        }).then(() => {
            this.downloading = false
        }).catch(error => {
            this.downloading = false
        })
    }
}
</script>

<style lang="scss" scoped>
    .file-image {
        img {
            width: 50px;
            height: 50px;
        }

    }
    .operations {
        display: flex;
        justify-content: flex-start;

        * {
            display: block;
            margin-right: 5px;
        }
    }
    .fullPath {
        cursor: pointer;
    }
</style>
