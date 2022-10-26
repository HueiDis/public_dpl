import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { IPermissionState } from './modules/permission'
import { IViewState } from './modules/view'
import { IConfigState } from './modules/config'
import { IAuthorizeState } from './modules/authorize'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  permission: IPermissionState
  view: IViewState
  config: IConfigState
  authorize: IAuthorizeState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
