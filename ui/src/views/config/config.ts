import { Component, Vue } from 'vue-property-decorator'
import { ConfigModule } from '@/store/modules/config'
import { GroupPermission, Permission } from '@/api/config'
import LangSelect from '@/components/LangSelect/index.vue'

@Component({
  name: 'Config',
  components: {
    LangSelect
  }
})

export default class extends Vue {
  private swichMode = '0' // 0=QUERY/MODIFY; 1=CREATE
  private bQuery = false
  private selectGroup = '' // selected group
  private selectConfig = '' // selected config
  private configData = {}
  private newConfigData = {}
  private txtConfigID = ''
  private txtGroup = ''
  private txtModDescription = ''
  private txtAddDescription = ''
  private status = ''

  get userConfigs() {
    return ConfigModule.userConfigs
  }

  get group() {
    return ConfigModule.group
  }

  get lastUpdatedBy() {
    return ConfigModule.lastUpdatedBy
  }

  get isData() {
    return JSON.stringify(this.configData) !== '{}'
  }

  get addHoursOfTimeZone() {
    const d = new Date()
    const n = (d.getTimezoneOffset()) * 60 * 1000 // convert milliseconds
    return n
  }

  get lastUpdatedAt() {
    let unixTime = ConfigModule.lastUpdatedAt
    let date = new Date()
    if (unixTime === '') {
      return '(none)'
    } else {
      unixTime = String(unixTime).substring(0, 13) // get milliseconds
      date = new Date(Number(unixTime) - this.addHoursOfTimeZone) // ex: 1618391859187886400
    }
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }

  get configOptions() {
    let options = this.userConfigs
    if (this.selectGroup === '') return []
    else options = options.filter((permissions: GroupPermission) => permissions.group === this.selectGroup)

    return options[0].permissions || null
  }

  get actions() {
    let options = this.configOptions
    if (this.selectConfig === '') return []
    else options = options.filter((permission: Permission) => permission.id === this.selectConfig)

    return options[0].actions
  }

  private onIdKeyIn(e: any) {
    const re = /[^A-Z0-9_]/gi
    e.target.value = e.target.value.replace(re, '').toUpperCase()
  }

  private async query(isMsg: boolean) {
    await ConfigModule.GetConfig(this.selectConfig)
    await new Promise((resolve) => {
      this.txtModDescription = ConfigModule.description
      this.configData = ConfigModule.configData
      this.status = ConfigModule.status
      this.bQuery = true

      if (isMsg) {
        this.$notify({
          title: (this.$t('share.success')).toString(),
          message: this.$t('share.actionComplete').toString(),
          type: 'success',
          duration: 2000
        })
      }
      resolve('success')
    })
  }

  private async save() {
    await ConfigModule.UpdateConfig({ id: this.selectConfig, body: { description: this.txtModDescription, value: this.configData } })
    await new Promise((resolve) => {
      this.query(false)
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
    await ConfigModule.CreateConfig({ id: this.txtConfigID.toUpperCase(), body: { description: this.txtAddDescription, group: this.txtGroup.toUpperCase(), value: this.newConfigData } })
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

  mounted() {
    ConfigModule.GetUserConfigs()
  }
}
