import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Dashboard'
})
export default class extends Vue {
  get factory() {
    return UserModule.factory
  }

  get id() {
    return UserModule.id
  }

  get departments() {
    return UserModule.authorizedDepartments
  }

  get roles() {
    return UserModule.authorizedRoles
  }

  get area() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}
