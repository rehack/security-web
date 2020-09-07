<template>
    <div>
        <svg :class="svgClass" aria-hidden="true">
            <use :xlink:href="iconNames"></use>
        </svg>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({
        name: 'SvgIcon'
    })

    export default class extends Vue{

        @Prop({default: 'dashboard'}) private iconName!: string;
        @Prop({ default: 'dashboard'}) public iconClass!: string;

        get iconNames() {
            return '#icon-' + this.iconName;
        }
        get svgClass() {
            if (this.iconClass) {
                return 'svg-icon ' + this.iconClass;
            } else {
                return 'svg-icon';
            }
        }

    }
</script>

<style scoped>
    .svg-icon {
        width: 1em;
        height: 1em;
        fill: currentColor;
    }
    .colorRed {
        color: red;
     }
    .colorWhite {
        color: white;
    }
    .colorBlue {
        color: lightskyblue;
    }
    .colorBlack {
        color: black;
    }
    .font20{
        font-size: 20px;
    }
    .font25{
        font-size: 25px;
    }
    .font30{
        font-size: 30px;
    }
</style>
