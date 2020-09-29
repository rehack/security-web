import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { querySelectionRoles } from '@/api/role';
import { message } from "ant-design-vue";

export interface IRoles {
    roles: string[];
}

@Module({ dynamic: true, name: "roles", store})
class Roles extends VuexModule implements IRoles {

    public roles: string[] = [];

    @Mutation
    private SET_ROLES(roles: string[]) {
        this.roles = roles;
    }

    @Action
    public setRoles(roles: string[]) {
        this.SET_ROLES(roles);
    }

    @Action
    public async initRoles() {
        const res: any = await querySelectionRoles();
        if (res.code === 200) {
            this.setRoles(res.data);
        } else {
            message.info('initRoles: request failed')
        }
    }
}

export const RolesModule = getModule(Roles);
