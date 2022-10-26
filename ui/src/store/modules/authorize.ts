import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getAuthorizeView, alterAuthorizeView, getAuthorizeConfig, alterAuthorizeConfig, Permission } from '@/api/authorize'
import store from '@/store'
import i18n from '@/lang'

export interface IAuthorizeState {
  permissions: object
  lastUpdatedAt: string
  lastUpdatedBy: string
}

@Module({ dynamic: true, store, name: 'authorize' })
class Authorize extends VuexModule implements IAuthorizeState {
  public permissions: Array<Permission> = []
  public lastUpdatedAt = ''
  public lastUpdatedBy = ''

  @Mutation
  private SET_PERMISSION(permissions: Array<Permission>) {
    this.permissions = permissions
  }

  @Mutation
  private SET_LASTUPDATEDAT(lastUpdatedAt: string) {
    this.lastUpdatedAt = lastUpdatedAt
  }

  @Mutation
  private SET_LASTUPDATEDBY(lastUpdatedBy: string) {
    this.lastUpdatedBy = lastUpdatedBy
  }

  @Action({ rawError: true })
  public async GetAuthorizeView(request: any) {
    this.SET_PERMISSION([])
    const { data } = await getAuthorizeView(request.role, request.group)
    if (!data || data.length === 0) {
      throw Error(i18n.t('authorization.error.failedToGetAuthorizeView').toString())
    }
    const { permissions, lastUpdatedAt, lastUpdatedBy } = data[0]
    if (!permissions) {
      throw Error(i18n.t('authorization.error.failedToGetAuthorizeViewPermissions').toString())
    }
    this.SET_PERMISSION(permissions)
    this.SET_LASTUPDATEDAT(lastUpdatedAt)
    this.SET_LASTUPDATEDBY(lastUpdatedBy)
  }

  @Action({ rawError: true })
  public async AlterAuthorizeView(request: any) {
    await alterAuthorizeView(request.body)
  }

  @Action({ rawError: true })
  public async GetAuthorizeConfig(request: any) {
    this.SET_PERMISSION([])
    const { data } = await getAuthorizeConfig(request.role, request.group)
    if (!data || data.length === 0) {
      throw Error(i18n.t('authorization.error.failedToGetAuthorizeConfig').toString())
    }
    const { permissions, lastUpdatedAt, lastUpdatedBy } = data[0]
    if (!permissions) {
      throw Error(i18n.t('authorization.error.failedToGetAuthorizeConfigPermissions').toString())
    }
    this.SET_PERMISSION(permissions)
    this.SET_LASTUPDATEDAT(lastUpdatedAt)
    this.SET_LASTUPDATEDBY(lastUpdatedBy)
  }

  @Action({ rawError: true })
  public async AlterAuthorizeConfig(request: any) {
    await alterAuthorizeConfig(request.body)
  }
}

export const AuthorizeModule = getModule(Authorize)
