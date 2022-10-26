import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AuthorizeModule } from '@/store/modules/authorize'
import { ViewModule } from '@/store/modules/view'
import { ConfigModule } from '@/store/modules/config'
import { Permission } from '@/api/view'
import LangSelect from '@/components/LangSelect/index.vue'

@Component({
  name: 'Auth',
  components: {
    LangSelect
  }
})

export default class extends Vue {
  private selectType = 'VIEW' // selected type
  private selectRole = '' // selected role
  private selectGroup = '' // selected group
  private selectProgramID = ''
  private showUpdateInfo = false
  private permissions: Array<Permission> = []

  // role options
  get roles() {
    if (UserModule.authorizedRoles.length > 0 && UserModule.authorizedRoles.indexOf('XXX') > -1) {
      // TODO: return ALL ROLES
      return UserModule.authorizedRoles
    } else {
      return UserModule.authorizedRoles
    }
  }

  // group options
  get groupList() {
    switch (this.selectType) {
      case 'VIEW': {
        return ViewModule.viewList
      }
      case 'CONFIG': {
        return ConfigModule.configList
      }
      default: {
        return null
      }
    }
  }

  get lastUpdatedBy() {
    return AuthorizeModule.lastUpdatedBy
  }

  get lastUpdatedAt() {
    let unixTime = AuthorizeModule.lastUpdatedAt
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

  get isPermission() {
    return JSON.stringify(this.permissions) !== '[]'
  }

  // view/config list of a group
  get programs() {
    switch (this.selectType) {
      case 'VIEW': {
        return ViewModule.programs
      }
      case 'CONFIG': {
        return ConfigModule.programs
      }
      default: {
        return null
      }
    }
  }

  // the options which user must select
  get bQuery() {
    return this.selectType !== '' && this.selectGroup !== '' && this.selectRole !== ''
  }

  private async query(isMsg: boolean) {
    this.permissions = []
    this.selectProgramID = ''
    this.showUpdateInfo = false
    if (this.bQuery) {
      if (this.selectType === 'VIEW') {
        await ViewModule.GetViewListByGroup(this.selectGroup)
        await AuthorizeModule.GetAuthorizeView({ role: this.selectRole, group: this.selectGroup })
      } else {
        await ConfigModule.GetConfigListByGroup(this.selectGroup)
        await AuthorizeModule.GetAuthorizeConfig({ role: this.selectRole, group: this.selectGroup })
      }
      await new Promise((resolve) => {
        this.showUpdateInfo = true
        this.permissions = AuthorizeModule.permissions
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
  }

  private async save() {
    if (this.selectType === 'VIEW') {
      await AuthorizeModule.AlterAuthorizeView({ body: { role: this.selectRole, group: this.selectGroup, permissions: this.permissions } })
    } else {
      await AuthorizeModule.AlterAuthorizeConfig({ body: { role: this.selectRole, group: this.selectGroup, permissions: this.permissions } })
    }
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

  // set group options
  private setGroupOptions() {
    this.showUpdateInfo = false
    this.selectGroup = ''
    this.permissions = []
    if (this.selectType === 'VIEW') {
      ViewModule.GetViewList()
    } else {
      ConfigModule.GetConfigList()
    }
  }

  private addProgram(id: string) {
    let isExist = false
    this.permissions.forEach(function(permission: Permission) {
      if (permission.id === id) {
        isExist = true
      }
    })

    if (isExist) {
      this.$notify({
        title: (this.$t('share.fail')).toString(),
        message: this.$t('share.itemExist').toString(),
        type: 'warning',
        duration: 2000
      })
      return
    }
    this.permissions.push({ id: this.selectProgramID, actions: [] })
  }

  private removefield(index: number) {
    this.permissions.splice(index, 1)
    this.save()
  }

  mounted() {
    this.setGroupOptions()
  }
}
