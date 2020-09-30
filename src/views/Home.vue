<template>
    <div class="calculate-item">
        <a-select v-model:value="queryUserLogParams.month" placeholder="月份" style="width: 120px" @change="monthChange" allowClear>
            <a-select-option v-for="option in selectOptions" :key="option.value" :value="option.value">{{option.text}}</a-select-option>
        </a-select>
    </div>
    <div class="dashboard-container calculate-item">
        <div id="calculate-box"></div>
    </div>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UserModule } from "@/store/module/user";
import { DualAxes } from "@antv/g2plot";
import { calculateUserLogInfo } from "@/api/home";

@Options({
    name: 'home'
})
export default class HomePage extends Vue {

    private queryUserLogParams = {
        month: ''
    }
    private userLogData: any[] = []
    private selectOptions = [
        { value: 1, text: '1月' }, { value: 2, text: '2月' }, { value: 3, text: '3月' }, { value: 4, text: '4月' },
        { value: 5, text: '5月' }, { value: 6, text: '6月' }, { value: 7, text: '7月' }, { value: 8, text: '8月' },
        { value: 9, text: '9月' }, { value: 10, text: '10月' }, { value: 11, text: '11月' }, { value: 12, text: '12月' }
    ]
    private dualAxesRender: any;

    mounted() {
        this.initUserLogCalculateData()
    }

    private monthChange() {
        this.initUserLogCalculateData()
    }

    private async initUserLogCalculateData() {
        const res: any = await calculateUserLogInfo(this.queryUserLogParams)
        if (res.code === 200) {
            this.userLogData = res.data
            if (this.userLogData.length > 0) {
                if (this.dualAxesRender) {
                    this.dualAxesRender.destroy()
                }
                this.userLogData = this.userLogData.map((log: any) => {
                    log.loginCount = parseInt(log.loginCount)
                    log.loginTime = parseInt(log.loginTime)
                    return log
                })
                this.dualAxesRender = new DualAxes('calculate-box', {
                    data: [ this.userLogData, this.userLogData ],
                    xField: 'time',
                    yField: ['loginTime', 'loginCount'],
                    yAxis: [ { min: 0, label: { formatter: (val) => `${val}小时` } }, { min: 0, label: { formatter: (val) => `${val}次` } } ],
                    meta: {
                        loginTime: {
                            alias: '登录时长',
                            formatter: (v: any) => {
                                return Number((v / 60)).toFixed(1)
                            }
                        },
                        loginCount: {
                            alias: '登陆次数',
                        },
                    },
                    geometryOptions: [
                        { geometry: 'column', label: { position: 'middle' }, columnWidthRatio: 0.4, columnStyle: { opacity: 0.4 }, color: '#5ac6e5' },
                        { geometry: 'line', lineStyle: { lineWidth: 2}, color: '#dc31c4' }
                    ],
                    interactions: [ { type: 'active-region'}, { type: 'element-highlight' } ],
                    autoFit: true,
                    legend: {
                        itemName: {
                            formatter: (text, item) => {
                                return text === 'loginCount' ? '登陆次数/(次)' : '登录时长/(分)' ;
                            }
                        }
                    },
                    tooltip: { title: `${res.msg}用户登录信息`, showTitle: true },

                });
                this.dualAxesRender.render()
            }
        }
    }

    get nickname() {
        return UserModule.nickname
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        width: 1500px;
        height: 600px;
        margin-left: 10px;
        margin-top: 10px;
        #calculate-box {
            width: 1200px;
            height: 100%;
            margin-left: auto;
            margin-right: auto;
        }
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
.calculate-item {
    display: block;
    float: left;
}
</style>

