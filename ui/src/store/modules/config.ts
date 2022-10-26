import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getConfigList, getConfigListByGroup, getUserConfigs, getConfig, updateConfig, createConfig, GroupPermission, ProgramList } from '@/api/config'
import store from '@/store'
import i18n from '@/lang'

export interface IConfigState {
  configList: object
  programs: object
  userConfigs: object
  configData: object
  description: string
  group: string
  lastUpdatedAt: string
  lastUpdatedBy: string
  status: string
  value: object
}

@Module({ dynamic: true, store, name: 'config' })
class Config extends VuexModule implements IConfigState {
  public configList: Array<ProgramList> = []
  public programs: ProgramList = <ProgramList>{}
  public userConfigs: Array<GroupPermission> = []
  public configData = {}
  public description = ''
  public group = ''
  public lastUpdatedAt = ''
  public lastUpdatedBy = ''
  public status = ''
  public value = {}

  @Mutation
  private SET_CONFIGLIST(configList: Array<ProgramList>) {
    this.configList = configList
  }

  @Mutation
  private SET_PROGRAMS(programs: ProgramList) {
    this.programs = programs
  }

  @Mutation
  private SET_USERCONFIGS(userConfigs: Array<GroupPermission>) {
    this.userConfigs = userConfigs
  }

  @Mutation
  private SET_DESCRIPTION(description: string) {
    this.description = description
  }

  @Mutation
  private SET_GROUP(group: string) {
    this.group = group
  }

  @Mutation
  private SET_LASTUPDATEDAT(lastUpdatedAt: string) {
    this.lastUpdatedAt = lastUpdatedAt
  }

  @Mutation
  private SET_LASTUPDATEDBY(lastUpdatedBy: string) {
    this.lastUpdatedBy = lastUpdatedBy
  }

  @Mutation
  private SET_STATUS(status: string) {
    this.status = status
  }

  @Mutation
  private SET_CONFIGDATA(configData: object) {
    this.configData = configData
  }

  @Action({ rawError: true })
  public async GetConfigList() {
    this.SET_CONFIGLIST([])
    const { data } = await getConfigList()
    // data must be a non-empty array
    if (!data || data.length === 0) {
      throw Error(i18n.t('config.error.failedToGetConfigList').toString())
    }
    this.SET_CONFIGLIST(data)
  }

  @Action({ rawError: true })
  public async GetConfigListByGroup(group: string) {
    this.SET_PROGRAMS(<ProgramList>{})
    const { data } = await getConfigListByGroup(group)
    // data must be a non-empty array
    if (!data || data.length === 0) {
      throw Error(i18n.t('config.error.failedToGetConfigListByGroup').toString())
    }
    this.SET_PROGRAMS(data[0])
  }

  @Action({ rawError: true })
  public async GetUserConfigs() {
    this.SET_USERCONFIGS([])
    this.SET_CONFIGDATA({})
    const { data } = await getUserConfigs()
    // data must be a non-empty array
    if (!data || data.length <= 0) {
      throw Error(i18n.t('config.error.failedToGetUserConfigs').toString())
    }
    this.SET_USERCONFIGS(data)
  }

  @Action({ rawError: true })
  public async GetConfig(id: string) {
    this.SET_CONFIGDATA({})
    const { data } = await getConfig(id)
    if (!data) {
      throw Error(i18n.t('config.error.failedToGetConfig').toString())
    }
    const { description, group, lastUpdatedAt, lastUpdatedBy, status, value } = data
    if (!value) {
      throw Error(i18n.t('config.error.failedToGetConfigData').toString())
    }
    this.SET_DESCRIPTION(description)
    this.SET_GROUP(group)
    this.SET_LASTUPDATEDAT(lastUpdatedAt)
    this.SET_LASTUPDATEDBY(lastUpdatedBy)
    this.SET_STATUS(status)
    this.SET_CONFIGDATA(value)
  }

  @Action({ rawError: true })
  public async UpdateConfig(request: any) {
    await updateConfig(request.id, request.body)
  }

  @Action({ rawError: true })
  public async CreateConfig(request: any) {
    await createConfig(request.id, request.body)
  }
}

export const ConfigModule = getModule(Config)
