import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getViewList, getViewListByGroup, getUserViews, getViewSchema, modifyViewSchema, createViewSchema, getViewData, QueryBody, Field, Row, GroupPermission, ProgramList } from '@/api/view'
import store from '@/store'
import i18n from '@/lang'

export interface IViewState {
  viewList: object
  programs: object
  userViews: object
  fields: object
  database: number
  source: string
  description: string
  group: string
  lastUpdatedAt: string
  lastUpdatedBy: string
  titles: string[]
  rows: object
}

@Module({ dynamic: true, store, name: 'view' })
class View extends VuexModule implements IViewState {
  public viewList: Array<ProgramList> = []
  public programs: ProgramList = <ProgramList>{}
  public userViews: Array<GroupPermission> = []
  public fields: Array<Field> = []
  public database = 0
  public source = ''
  public description = ''
  public group = ''
  public lastUpdatedAt = ''
  public lastUpdatedBy = ''
  public titles: Array<string> = []
  public rows: Array<Row> = []
  public queryBody: QueryBody = <QueryBody>{}

  @Mutation
  private SET_VIEWLIST(viewList: Array<ProgramList>) {
    this.viewList = viewList
  }

  @Mutation
  private SET_PROGRAMS(programs: ProgramList) {
    this.programs = programs
  }

  @Mutation
  private SET_USERVIEWS(userViews: Array<GroupPermission>) {
    this.userViews = userViews
  }

  @Mutation
  private SET_DATABASE(database: number) {
    this.database = database
  }

  @Mutation
  private SET_SOURCE(source: string) {
    this.source = source
  }

  @Mutation
  private SET_FIELDS(fields: Array<Field>) {
    this.fields = fields
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
  private SET_TITLES(data: string[]) {
    this.titles = data
  }

  @Mutation
  private SET_ROWS(data: Array<Row>) {
    this.rows = data
  }

  @Action({ rawError: true })
  public ResetData() {
    this.SET_TITLES([])
    this.SET_ROWS([])
  }

  @Action({ rawError: true })
  public async GetViewList() {
    this.SET_VIEWLIST([])
    const { data } = await getViewList()
    // data must be a non-empty array
    if (!data || data.length === 0) {
      throw Error(i18n.t('view.error.failedToGetViewList').toString())
    }
    this.SET_VIEWLIST(data)
  }

  @Action({ rawError: true })
  public async GetViewListByGroup(group: string) {
    this.SET_PROGRAMS(<ProgramList>{})
    const { data } = await getViewListByGroup(group)
    // data must be a non-empty array
    if (!data || data.length === 0) {
      throw Error(i18n.t('view.error.failedToGetViewListByGroup').toString())
    }
    this.SET_PROGRAMS(data[0])
  }

  @Action({ rawError: true })
  public async GetUserViews() {
    this.SET_USERVIEWS([])
    const { data } = await getUserViews()
    // data must be a non-empty array
    if (!data || data.length === 0) {
      throw Error(i18n.t('view.error.failedToGetUserViews').toString())
    }
    this.SET_USERVIEWS(data)
  }

  @Action({ rawError: true })
  public async GetViewSchema(id: string) {
    this.ResetData()
    const { data } = await getViewSchema(id)
    if (!data) {
      throw Error(i18n.t('view.error.failedToGetSchema').toString())
    }
    const { database, source, description, group, lastUpdatedAt, lastUpdatedBy, fields } = data
    if (!fields) {
      throw Error(i18n.t('view.error.failedToGetSchemaFields').toString())
    }

    this.SET_DATABASE(database)
    this.SET_SOURCE(source)
    this.SET_DESCRIPTION(description)
    this.SET_GROUP(group)
    this.SET_LASTUPDATEDAT(lastUpdatedAt)
    this.SET_LASTUPDATEDBY(lastUpdatedBy)
    this.SET_FIELDS(fields)
  }

  @Action({ rawError: true })
  public async CreateViewSchema(request: any) {
    await createViewSchema(request.id, request.schema)
  }

  @Action({ rawError: true })
  public async ModifyViewSchema(request: any) {
    await modifyViewSchema(request.id, request.schema)
  }

  @Action({ rawError: true })
  public async GetViewData(request: any) {
    this.ResetData()
    this.queryBody.database = request.database
    this.queryBody.source = request.source
    this.queryBody.fields = request.fields
    const { data } = await getViewData(request.id, request.limit, this.queryBody)
    // data must be a non-empty array
    if (!data) {
      throw Error(i18n.t('view.error.failedToGetData').toString())
    }
    const { titles, rows } = data
    // titles must be a non-empty array
    if (!rows || titles.length === 0) {
      throw Error(i18n.t('view.error.failedToGetTitles').toString())
    }
    // rows must be a non-empty array
    if (!rows || rows.length === 0) {
      throw Error(i18n.t('view.error.failedToGetRows').toString())
    }
    this.SET_TITLES(titles)
    this.SET_ROWS(rows)
  }
}

export const ViewModule = getModule(View)
