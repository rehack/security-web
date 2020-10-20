import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators"
import store from '@/store'

export interface ISettings {
    menuCollapsed: boolean;
    title: string;
    tagView: boolean;
    navbar: boolean;
    light: boolean;
    fileServerLink: string;
}

@Module({ dynamic: true, name: 'settings', store})
class Settings extends VuexModule implements ISettings {

    public menuCollapsed = false
    public title = "文件系统管理中心"
    public tagView = true
    public navbar = true
    public light = true
    public fileServerLink = 'http://123.58.210.7:8888/'

    @Mutation
    private CHANGE_MENU_COLLAPSED() {
        this.menuCollapsed = !this.menuCollapsed
    }

    @Mutation
    private CHANGE_MENU_LIGIT() {
        this.light = !this.light
    }

    @Action
    public changeMenuCollapsed() {
        this.CHANGE_MENU_COLLAPSED()
    }

    @Action
    public changeMenuLight() {
        this.CHANGE_MENU_LIGIT()
    }

}

export const SettingsModule = getModule(Settings)

