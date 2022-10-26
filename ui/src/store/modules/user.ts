import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, loginMode, logout, getUserInfo } from '@/api/users'
import { getToken as getTokenFromCookies, setToken as setTokenIntoCookies, removeToken as removeTokenFromCookies } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import store from '@/store'
import i18n from '@/lang'

export interface IUserState {
  token: string
  factory: string
  id: string
  authorizedDepartments: string[]
  authorizedRoles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getTokenFromCookies() || ''
  public factory = ''
  public id = ''
  public authorizedDepartments : string[] = []
  public authorizedRoles: string[] = []

  @Mutation
  private SET_TOKEN(token: string) {
    setTokenIntoCookies(token)
    this.token = token
  }

  @Mutation
  private SET_FACTORY(factory: string) {
    this.factory = factory
  }

  @Mutation
  private SET_USERID(id: string) {
    this.id = id
  }

  @Mutation
  private SET_DEPARTMENTS(departments: string[]) {
    this.authorizedDepartments = departments
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.authorizedRoles = roles
  }

  @Action({ rawError: true })
  public async Login(userInfo: { mode: loginMode, factory: string, id: string, password: string}) {
    userInfo.id = userInfo.id.trim()
    const { data } = await login(userInfo)
    this.SET_TOKEN(data.token)
  }

  @Action
  public ResetToken() {
    removeTokenFromCookies()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action({ rawError: true })
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error(i18n.t('login.error.tokenNotFound').toString())
    }
    const { data } = await getUserInfo()
    if (!data) {
      throw Error(i18n.t('login.error.failedToGetUserInfo').toString())
    }
    const { factory, id, authorizedDepartments, authorizedRoles } = data
    // roles must be a non-empty array
    if (!authorizedRoles || authorizedRoles.length <= 0) {
      throw Error(i18n.t('login.error.failedToGetUserRoles').toString())
    }
    this.SET_FACTORY(factory)
    this.SET_USERID(id)
    this.SET_DEPARTMENTS(authorizedDepartments)
    this.SET_ROLES(authorizedRoles)
  }

  @Action({ rawError: true })
  public async ChangeRoles(roles: Array<string>) {
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
  }

  @Action({ rawError: true })
  public async LogOut() {
    if (this.token === '') {
      throw Error(i18n.t('login.error.tokenNotFound').toString())
    }
    await logout()
    resetRouter()
    this.ResetToken()
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
