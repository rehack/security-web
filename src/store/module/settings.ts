import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from '@/store';

export interface ISettings {
    menuCollapsed: boolean;
    title: string;
    tagView: boolean;
}

@Module({ dynamic: true, name: 'settings', store})
class Settings extends VuexModule implements ISettings {

    public menuCollapsed = false;
    public title = "ShopMall";
    public tagView = true;

    @Mutation
    private CHANGE_MENU_COLLAPSED() {
        this.menuCollapsed = !this.menuCollapsed;
    }

    @Action
    public changeMenuCollapsed() {
        this.CHANGE_MENU_COLLAPSED();
    }

}

export const SettingsModule = getModule(Settings);

