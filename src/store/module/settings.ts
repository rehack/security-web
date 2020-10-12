import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators"
import store from '@/store'

export interface ISettings {
    menuCollapsed: boolean;
    title: string;
    tagView: boolean;
    navbar: boolean;
    light: boolean;
}

@Module({ dynamic: true, name: 'settings', store})
class Settings extends VuexModule implements ISettings {

    public menuCollapsed = false
    public title = "美搜Crm系统"
    public tagView = true
    public navbar = true
    public light = true

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

