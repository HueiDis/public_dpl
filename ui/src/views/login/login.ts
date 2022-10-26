import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { isValidUsername } from '@/utils/validate'
import { UserModule } from '@/store/modules/user'
import { loginMode } from '@/api/users'
import LangSelect from '@/components/LangSelect/index.vue'

@Component({
  name: 'Login',
  components: {
    LangSelect
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(this.loginForm.mode, value)) {
      callback(new Error(this.$t('login.error.badAccountInfo').toString()))
    } else {
      callback()
    }
  }

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error(this.$t('login.error.badPasswordLength').toString()))
    } else {
      callback()
    }
  }

  private loginMode = loginMode
  private loginForm = {
    mode: loginMode.AD,
    factory: 'A',
    id: '',
    password: ''
  }

  private factoryList = [
    { desc: 'KD員林廠', value: 'A' },
    { desc: 'KD雲林廠', value: 'B' },
    { desc: 'KS', value: 'C' },
    { desc: 'KC', value: 'D' },
    { desc: 'KV', value: 'E' },
    { desc: 'KI', value: 'I' },
    { desc: 'KT制一廠', value: 'J' },
    { desc: 'KT制二廠', value: 'L' },
    { desc: '大發廠', value: 'P' },
    { desc: '斗六研發中心', value: 'R' },
    { desc: '斗六廠', value: 'S' },
    { desc: '台北OFFICE', value: 'T' },
    { desc: '越二廠', value: 'V' }
  ]

  private loginRules = {
    id: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }

  private passwordType = 'password'
  private loading = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.id === '') {
      (this.$refs.id as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 1 * 5000)
        await UserModule.Login(this.loginForm)
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        })
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
