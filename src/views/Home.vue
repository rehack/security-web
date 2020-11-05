<template>
    <a-row id="topItems">
        <a-col :span="topItemSpan">
            <a-card>
                <a-upload v-model:fileList="uploadFileList" name="file" :multiple="true"
                          @change="uploadListChange" :action="uploadUrl" :before-upload="beforeUpload">
                    <a-button><upload-outlined/>单文件上传</a-button>
                </a-upload>
            </a-card>
        </a-col>
        <a-col :span="topItemSpan">
            <a-card>
                <a-upload v-model:fileList="uploadManyList" name="file" :multiple="false" :directory="true"
                          @change="uploadListChange" :action="uploadUrl">
                    <a-button><upload-outlined/>多文件上传</a-button>
                </a-upload>
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
import { UploadOutlined } from '@ant-design/icons-vue';
import {message} from "ant-design-vue";
import {SettingsModule} from "@/store/module/settings";
import { removeOne } from "@/api/file/file";

@Options({
    name: 'home',
    components: {
        UploadOutlined
    }
})
export default class HomePage extends Vue {

    private topItemSpan = 6;
    private uploadFileList = [];
    private uploadManyList = [];

    private uploadListChange(info: any) {
        if (info.file.status === 'done') {
            const res: any = info.file.response
            if (res.code === '200') {
                message.success('上传成功')
            } else {
                message.error(res.msg)
            }
        }
        else if (info.file.status === 'removed') {
            const res: any = info.file.response.data
            const fileId: string = res.fileId
            removeOne(fileId)
        }
        else if (info.file.status === 'error') {
            message.error('上传失败')
        }
    }
    private uploadManyChange(info: any) {

    }

    get uploadUrl() {
        return process.env.VUE_APP_BASE_API + "/uploader/u";
    }
    get uploadManyUrl() {
        return process.env.VUE_APP_BASE_API + "/uploader/um";
    }

    private beforeUpload(file: any) {
        if (this.uploadFileList.length > 10) {
            message.error('上传个数10个以内')
            return Promise.reject(file)
        }
        return Promise.resolve(file)
    }

}
</script>

<style lang="scss" scoped>
</style>

