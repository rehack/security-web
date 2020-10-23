<template>
    <a-form :model="queryFileParam" layout="inline">
        <a-form-item>
            <a-input placeholder="正则" v-model:value="queryFileParam.pattern" autocomplete="off" allowClear />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" :loading="searchLoading" @click="initFileData">搜索</a-button>
        </a-form-item>
    </a-form>

    <a-table :columns="fileColumns" :data-source="fileData" rowKey="fileFullPath"
             :loading="searchLoading" :scroll="{ x: 1500, y: 600 }" bordered>
        <template v-slot:fileIndex="{ text, record, index}">
            {{++index}}
        </template>
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
            </div>
        </template>
    </a-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import {downloadByPath, removeOne, scanFilesFromServer} from "@/api/file"
import {message} from "ant-design-vue";
import {SettingsModule} from "@/store/module/settings";
import { download } from "@/utils/file";
import {copy} from "iclipboard/esm";

@Options({
    name: 'file-server'
})
export default class FileServer extends Vue{
    private searchLoading = false
    private queryFileParam = {
        pattern: '/*'
    }
    private fileData = []
    private fileColumns = [
        { title: '序号', dataIndex: 'index', width: '10%', slots: { customRender: 'fileIndex'} },
        { title: '文件预览', dataIndex: 'fileFullPath', width: '10%', slots: { customRender: 'preview'} },
        { title: '文件大小', dataIndex: 'fileCalSize', width: '10%' },
        { title: '文件路径', dataIndex: 'fileFullPath', width: '30%', slots: { customRender: 'fileFullPath' } },
        {title: '操作', dataIndex: 'operations', width: '10%', slots: { customRender: 'operation' }}
    ]
    private imageFormats = ['jpg', 'png', 'gif', 'jpeg']
    private removeButtonDisbled = false

    get fileServerLink() {
        return SettingsModule.fileServerLink
    }

    private async initFileData() {
        this.searchLoading = true
        const res: any = await scanFilesFromServer(this.queryFileParam)
        if (res.code === 200) {
            message.success(`已扫描到${res.data.length}个文件`)
            this.fileData = res.data
        }
        this.searchLoading = false
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

    private download(record: any) {
        this.removeButtonDisbled = true
        downloadByPath({path: record.fileFullPath}).then((res: any) => {
            download(res, record.fileFullPath)
        }).then(() => {
            this.removeButtonDisbled = false
            this.initFileData()
        }).catch(error => {
            this.removeButtonDisbled = false
        })
    }

    private doCopy(fileFullPath: string) {
        if (copy(fileFullPath)) {
            message.success('复制成功')
        } else {
            message.error('复制失败')
        }
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
