import { Component, Vue, Watch } from 'vue-property-decorator'
import { ViewModule } from '@/store/modules/view'
import { Field, QueryField, GroupPermission, OperatorOfQueryString } from '@/api/view'
import LangSelect from '@/components/LangSelect/index.vue'
import XLSX from 'xlsx'
import { toNumber } from 'lodash'

@Component({
  name: 'ViewQuery',
  components: {
    LangSelect
  }
})
export default class extends Vue {
  private selectGroup = '' // selected group
  private selectViewID = '' // selected viewID
  private limit = 5000 // query limit count (default)
  private pageSize = 100 // display rows of one page
  private currentPage = 1 // current page number
  private isValid = false // query fields' format
  private loading = false // button loading
  private showQueryField = true // show query fields
  private tabelColunms: Array<Field> = [] // colunms of schema
  private columnListOfShow: Array<string> = [] // display colunms
  private queryFields: Array<QueryField> = [{ name: '', type: '', operator: 1, value: '', dateStr: '', optValue: '', optDateStr: '', isRequired: false }] // view's query condition
  private separatedStr = '＿' // query string of separating value A from value B
  private operators = [
    { desc: 'EQUAL', value: 1 },
    { desc: 'NOT_EQUAL', value: 2 },
    { desc: 'LIKE', value: 3 },
    { desc: 'NOT_LIKE', value: 4 },
    { desc: 'GREATER', value: 5 },
    { desc: 'GREATER_EQUAL', value: 6 },
    { desc: 'LESS', value: 7 },
    { desc: 'LESS_EQUAL', value: 8 },
    { desc: 'BETWEEN', value: 9 },
    { desc: 'NOT_BETWEEN', value: 10 }
  ]

  // get subtract timezone from local time
  get addHoursOfTimeZone() {
    const d = new Date()
    const n = (d.getTimezoneOffset()) * 60 * 1000 // convert milliseconds
    return n
  }

  // authorized views
  get userViews() {
    return ViewModule.userViews || null
  }

  // view's fields of schema
  get fields() {
    return ViewModule.fields || null
  }

  // view's description
  get description() {
    return ViewModule.description || null
  }

  // check query fields
  get bHasQueryFields() {
    return JSON.stringify(this.queryFields) !== '[]'
  }

  // check view's schema
  get isSchema() {
    return JSON.stringify(this.tabelColunms) !== '[]'
  }

  // options of view ID
  get viewOptions() {
    let options = this.userViews
    if (this.selectGroup === '') return []
    else {
      options = options.filter(
        (permission: GroupPermission) => permission.group === this.selectGroup
      )
    }
    return options[0].permissions || null
  }

  // search result
  get viewData() {
    const tableData: any = []
    const titles = ViewModule.titles
    const rows = ViewModule.rows
    if (!titles || !rows) { return tableData }
    for (let i = 0; i < rows.length; i++) {
      const row: any = []
      for (let s = 0; s < titles.length; s++) {
        if (this.getFieldType(titles[s]) === 'nanoseconds') {
          row[titles[s]] = this.getFormatDateString(rows[i].columns[s]) // 針對nano time做轉換(日期格式)
        } else {
          row[titles[s]] = rows[i].columns[s]
        }
      }
      tableData.push(row)
    }
    return tableData
  }

  // table columns
  get bindTableColumns() {
    return this.tabelColunms.filter((column: Field) => this.columnListOfShow.indexOf(column.name) >= 0)
  }

  // field's type
  get fieldTypeList() {
    const fObj = new Map<string, string>()
    this.fields.forEach(function(field: Field) {
      fObj.set(field.name, field.type)
    })
    return fObj
  }

  // field's enum values
  get fieldEnumList() {
    const fObj = new Map<string, string[]>()
    this.fields.forEach(function(field: Field) {
      fObj.set(field.name, field.values)
    })
    return fObj
  }

  // field's description
  get fieldDescriptionList() {
    const fObj = new Map<string, string>()
    this.fields.forEach(function(field: Field) {
      fObj.set(field.name, field.description)
    })
    return fObj
  }

  // get query url (in order to query view data quickly next time)
  get queryUrl() {
    const sSeparatedStr = this.separatedStr
    let baseUrl = '/view/index?' // base url of view page
    baseUrl += 'group=' + this.selectGroup + '&view=' + this.selectViewID + '&limit=' + this.limit
    this.queryFields.forEach(function(field) {
      baseUrl += '&field=' + field.name + sSeparatedStr + OperatorOfQueryString[field.operator] + sSeparatedStr + field.value
      if (field.optValue) { baseUrl += sSeparatedStr + field.optValue }
    })

    return baseUrl
  }

  // table height
  get tableMaxHeight() {
    return window.innerHeight - 80 + 'px'
  }

  // getNanoTime convert date to nano time
  private getNanoTime(dateStr: string) {
    let nanoTime = 1000
    try {
      nanoTime = Date.parse(dateStr) * 1000000
    } catch (e) {
      console.log(e)
    }

    return String(nanoTime)
  }

  // getFieldType get field's type
  private getFieldType(fieldName: string) {
    return this.fieldTypeList.get(fieldName) || 'string'
  }

  // getFieldEnumValues get field's enum values
  private getFieldEnumValues(fieldName: string) {
    return this.fieldEnumList.get(fieldName) || []
  }

  // getFieldDescription get field's description
  private getFieldDescription(fieldName: string) {
    return this.fieldDescriptionList.get(fieldName) || 'undefined'
  }

  // getFormatDateString convert nano time to date
  private getFormatDateString(str: string) {
    let unixTime = str
    let date = new Date()
    if (unixTime.length !== 19) {
      return '(invalid data)'
    } else {
      unixTime = String(unixTime).substring(0, 13) // get milliseconds
      date = new Date(Number(unixTime) - this.addHoursOfTimeZone) // ex: 1618391859187886400
    }
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }

  // getQueryLink test
  private getQueryLink(row: any, url: string, arr: string[]) {
    for (let i = 0; i < arr.length; i++) {
      url = url.replace('{?}', row[arr[i]])
    }
    return url
  }

  // handleAddField add default query field
  private handleAddField() {
    this.queryFields.push({ name: '', type: '', operator: 1, value: '', dateStr: '', optValue: '', optDateStr: '' })
  }

  // removefield remove query field
  private handleRemoveField(index: number) {
    this.queryFields.splice(index, 1)
  }

  // handleClear clear query field and set default settings
  private handleClear() {
    this.queryFields = []
    this.setDefaultQueryFields()
    if (this.queryFields.length === 0) { this.handleAddField() }
  }

  // excuteAfterTimes excute function after milliseconds
  private excuteAfterTimes(millisecond: number, method: any) {
    setTimeout(() => {
      method()
    }, millisecond)
  }

  // handleCurrentChange set current page
  private handleCurrentChange(cpage: number) {
    this.currentPage = cpage
  }

  // handleSizeChange set page size
  private handleSizeChange(psize: number) {
    this.pageSize = psize
  }

  // setDefaultQueryFields set default query fields
  private setDefaultQueryFields() {
    let count = 0
    // set default query fields
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].isRequired) {
        if (count === 0) { this.queryFields = [] } // clear array when fields' length > 0 (isRequired)
        this.queryFields.push({ name: this.fields[i].name, type: 'string', operator: 1, value: '', dateStr: '', optValue: '', optDateStr: '', isRequired: true })
        count += 1
      }
    }
  }

  // handleGetSchema get view schema
  private async handleGetSchema() {
    this.columnListOfShow = [] // clear list
    await ViewModule.GetViewSchema(this.selectViewID)
    await new Promise((resolve) => {
      this.handleClear()
      this.tabelColunms = ViewModule.fields // set table columns
      resolve('success')
      this.setDefaultQueryFields() // set default query fields
    })
  }

  // handleQuery query view data, and set the query url
  private async handleQuery(bSetUrl: boolean) {
    if (bSetUrl) {
      this.$router.push(this.queryUrl)
      this.handleQuery(false)
    } else {
      try {
        // remove the key outside the request parameters
        const finalQueryFields = JSON.parse(JSON.stringify(this.queryFields))
        finalQueryFields.forEach(function(item: QueryField) {
          delete item.isRequired
          delete item.dateStr
          delete item.optDateStr
        })
        this.loading = true
        setTimeout(() => { // change loading status after excuting a few minutes
          this.loading = false
        }, 12000)
        await ViewModule.GetViewData({
          id: this.selectViewID,
          limit: this.limit,
          database: ViewModule.database,
          source: ViewModule.source,
          fields: finalQueryFields
        })
        await new Promise((resolve) => {
          this.tabelColunms = ViewModule.fields
          this.loading = false
          // 當非手動選擇顯示欄位時，則以schema欄位資料帶入
          if (this.columnListOfShow.length === 0) {
            for (let i = 0; i < this.tabelColunms.length; i++) {
              this.columnListOfShow.push(this.tabelColunms[i].name)
            }
          }

          this.$notify({
            title: (this.$t('share.success')).toString(),
            message: this.$t('share.actionComplete').toString() + ', ' + (this.$t('share.count')).toString() + ': ' + ViewModule.rows.length,
            type: 'success',
            duration: 2000
          })
          resolve('success')
        })
      } catch (e) {
        this.loading = false
      }
    }
  }

  // handleDownload download view data
  private handleDownload() {
    const outputColumns = this.columnListOfShow
    const rows = ViewModule.rows
    // 取得輸出欄位所在的index
    const indexMap = ViewModule.titles.reduce((curr: any, title: string, index: number) => {
      curr[title] = index
      return curr
    }, {})

    const tableData = rows.map(rowItem => {
      // 以outputColumns的index排序作為資料輸出依據
      return outputColumns.reduce((curr: any, column: string) => {
        curr[this.getFieldDescription(column)] = rowItem.columns[indexMap[column]]
        return curr
      }, {})
    })

    const filename = this.selectViewID + '.xlsx'
    const wsname = 'Sheet1'
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(tableData)

    XLSX.utils.book_append_sheet(wb, ws, wsname)
    XLSX.writeFile(wb, filename)
  }

  // preloadQueryFields loads queryFields if url query params exists
  // url query param format: ?group=INV&view=PRODUCT_MASTER_FILE_LIST&limit=13648&field=itcls＿eq＿M1...
  private preloadQueryFields() {
    const queryParams = window.location.href.split('?')[1]
    // if queryParams is underfined, return
    if (queryParams === undefined) {
      return
    }
    const params = new URLSearchParams(queryParams)
    const fields: Array<QueryField> = []
    // if query string exists
    if (params.getAll) {
      this.selectGroup = params.getAll('group')[0]
      this.selectViewID = params.getAll('view')[0]
      this.limit = toNumber(params.getAll('limit')[0])
      // field[0]=name, field[1]=operator, field[2]=value, field[3]=optValue
      for (const f of params.getAll('field')) {
        const field = f.split(this.separatedStr)
        const sOperator: string = field[1]
        const nOperator = (<any>OperatorOfQueryString)[sOperator]

        fields.push({ name: field[0], type: this.getFieldType(field[0]), operator: nOperator, value: field[2], optValue: field[3] || '', isRequired: true })
      }
      this.queryFields = fields
    }
  }

  mounted() {
    ViewModule.GetUserViews() // get role's auth
    this.preloadQueryFields() // get viewID
    if (this.selectViewID !== '') {
      this.handleGetSchema()
      setTimeout(() => {
        this.preloadQueryFields() // get field's condition
        this.handleQuery(false)
      }, 1000)
    }
  }

  // check queryFields value
  @Watch('queryFields')
  onChanged() {
    let msg = 'illegal'
    this.queryFields.forEach(function(field: QueryField) {
      if (field.name && field.operator && field.value) {
        msg = ''
      }
    })
    if (msg !== '') {
      this.isValid = false
    } else {
      this.isValid = true
    }
  }
}
