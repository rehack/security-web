import { createStore } from 'vuex'
import {IUserState} from "@/store/module/user"
import {IPermissionState} from "@/store/module/permissions"

export interface IRootState {
  user: IUserState,
  permission: IPermissionState
}

export default createStore<IRootState>({
  modules: {

  }
})
