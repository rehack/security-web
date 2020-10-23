import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { querySelectionRoles } from '@/api/role';
import { message } from 'ant-design-vue';

export interface ISystemRoles {
    systemRoles: string[];
}

@Module({ dynamic: true, name: 'systemRoles', store})
class SystemRoles extends VuexModule implements ISystemRoles {

    public systemRoles: string[] = [];

    @Mutation
    private SET_SYSTEM_ROLES(roles: string[]) {
        this.systemRoles = roles;
    }

    @Action
    public setSystemRoles(roles: string[]) {
        this.SET_SYSTEM_ROLES(roles);
    }

    @Action
    public async initRoles() {
        const res: any = await querySelectionRoles();
        if (res.code === 200) {
            this.setSystemRoles(res.data);
        } else {
            message.info('initRoles: request failed')
        }
    }
}

export const SystemRolesModule = getModule(SystemRoles);
