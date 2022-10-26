import { Component, Vue } from 'vue-property-decorator'
import { ViewModule } from '@/store/modules/view'
import { Field, GroupPermission, Permission } from '@/api/view'
import LangSelect from '@/components/LangSelect/index.vue'

@Component({
  name: 'Schema',
  components: {
    LangSelect
  }
})

export default class extends Vue {
  private swichMode = '0' // 0=QUERY/MODIFY; 1=CREATE
  private bQuery = false // query enabled
  private selectGroup = '' // selected group
  private selectViewID = '' // selected viewID
  private selectModDatabase = 1 // selected database
  private selectAddDatabase = 1 // selected database
  private tabelColunms : Array<Field> = []
  private txtViewID = ''
  private txtGroup = ''
  private txtModSource = ''
  private txtAddSource = ''
  private txtModDescription = ''
  private txtAddDescription = ''
  // database參照 https://gitlab.kenda.com.tw/kenda/commons/-/blob/add-dui-api/src/proto/dm/dui/query.proto#L30
  private databaseList = [
    { desc: 'ERP', value: 1 },
    { desc: 'WERP', value: 2 },
    { desc: 'MES', value: 3 },
    { desc: 'WEB', value: 4 }
  ]

  get userViews() {
    return ViewModule.userViews
  }

  get group() {
    return ViewModule.group
  }

  get lastUpdatedBy() {
    return ViewModule.lastUpdatedBy
  }

  get lastUpdatedAt() {
    let unixTime = ViewModule.lastUpdatedAt
    let date = new Date()
    if (unixTime === '') {
      return '(none)'
    } else {
      unixTime = String(unixTime).substring(0, 13) // get milliseconds
      date = new Date(Number(unixTime) - this.addHoursOfTimeZone) // ex: 1618391859187886400
    }
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }

  get addHoursOfTimeZone() {
    const d = new Date()
    const n = (d.getTimezoneOffset()) * 60 * 1000 // convert milliseconds
    return n
  }

  get isSchema() {
    return JSON.stringify(this.tabelColunms) !== '[]'
  }

  get isInvalid() {
    return this.txtViewID === '' || this.txtGroup === '' || this.txtAddDescription === '' || this.selectAddDatabase === 0 || this.txtAddSource === ''
  }

  get viewOptions() {
    let options = this.userViews
    if (this.selectGroup === '') return []
    else options = options.filter((permission: GroupPermission) => permission.group === this.selectGroup)

    return options[0].permissions || null
  }

  get actions() {
    let options = this.viewOptions
    if (this.selectViewID === '') return []
    else options = options.filter((permission: Permission) => permission.id === this.selectViewID)

    return options[0].actions
  }

  private onIdKeyIn(e: any) {
    const re = /[^A-Z0-9_]/gi
    e.target.value = e.target.value.replace(re, '').toUpperCase()
  }

  private async getSchema(isMsg: boolean) {
    this.tabelColunms = [] // clear list
    await ViewModule.GetViewSchema(this.selectViewID)
    await new Promise((resolve) => {
      this.selectModDatabase = ViewModule.database
      this.txtModSource = ViewModule.source
      this.txtModDescription = ViewModule.description
      this.tabelColunms = ViewModule.fields
      this.bQuery = true

      if (isMsg) {
        this.$notify({
          title: (this.$t('share.success')).toString(),
          message: this.$t('share.actionComplete').toString() + ', ' + (this.$t('share.count')).toString() + ': ' + this.tabelColunms.length,
          type: 'success',
          duration: 2000
        })
      }
      resolve('success')
    })
  }

  private async save() {
    await ViewModule.ModifyViewSchema({ id: this.selectViewID, schema: { group: this.group, database: this.selectModDatabase, source: this.txtModSource, description: this.txtModDescription, fields: this.tabelColunms } })
    await new Promise((resolve) => {
      this.getSchema(false)
      this.$notify({
        title: (this.$t('share.success')).toString(),
        message: this.$t('share.updateSuccessfully').toString(),
        type: 'success',
        duration: 2000
      })
      resolve('success')
    })
  }

  private async create() {
    const tempFields : Array<Field> = []
    await ViewModule.CreateViewSchema({ id: this.txtViewID.toUpperCase(), schema: { group: this.txtGroup.toUpperCase(), database: this.selectAddDatabase, source: this.txtAddSource, description: this.txtAddDescription, fields: tempFields } })
    await new Promise((resolve) => {
      this.$notify({
        title: (this.$t('share.success')).toString(),
        message: this.$t('share.addSuccessfully').toString(),
        type: 'success',
        duration: 2000
      })
      resolve('success')
    })
  }

  private alterRowData(index: number) {
    if (this.tabelColunms[index].isRequired && !this.tabelColunms[index].isCondition) {
      this.tabelColunms[index].isRequired = false
    }
  }

  private addRow() {
    this.tabelColunms.push({ description: '', name: '', type: 'string', values: [], urlTemplate: '', isCondition: false, isRequired: false })
  }

  private deleteRow(index: number) {
    this.tabelColunms.splice(index, 1)
  }

  private topItem(index: any) {
    [this.tabelColunms[index], this.tabelColunms[index - 1]] = [this.tabelColunms[index - 1], this.tabelColunms[index]]
    this.tabelColunms.sort()
  }

  private bottomItem(index: any) {
    [this.tabelColunms[index], this.tabelColunms[index + 1]] = [this.tabelColunms[index + 1], this.tabelColunms[index]]
    this.tabelColunms.sort()
  }

  mounted() {
    this.tabelColunms = []
    ViewModule.GetUserViews()
  }
}
