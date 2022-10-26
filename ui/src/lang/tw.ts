export default {
  share: {
    create: '創建',
    insert: '新增',
    delete: '刪除',
    modify: '修改',
    update: '修改',
    save: '儲存',
    refresh: '重新整理',
    add: '新增',
    clear: '清除',
    edit: '編輯',
    query: '查詢',
    search: '搜尋',
    download: '下載',
    id: '代號',
    actions: '操作權限',
    confirm: '確認',
    cancel: '取消',
    success: '成功',
    fail: '失敗',
    actionComplete: '操作成功',
    updateSuccessfully: '更新成功',
    deleteSuccessfully: '刪除成功',
    addSuccessfully: '新增成功',
    addColumn: '新增資料欄位',
    deleteColumn: '刪除資料欄位',
    itemExist: '項目已存在',
    changeLanguageTips: '變更語言',
    errorMessage: '錯誤訊息',
    canceled: '取消操作',
    showData: '顯示資料',
    mode: '模式',
    systemType: '系統別',
    group: '分類',
    database: '資料庫',
    source: '資料來源',
    count: '資料筆數',
    role: '角色',
    description: '描述',
    lastUpdatedBy: '異動人員',
    lastUpdatedAt: '異動時間',
    published: '發行',
    invailid: '作廢',
    note: '備註'
  },
  login: {
    SignIn: '登入',
    account: '帳號 / 工號',
    password: '密碼',
    mode: {
      AD: 'Windows 帳號',
      employee: '工號'
    },
    error: {
      badAccountInfo: '使用者帳號/工號有誤',
      badPasswordLength: '密碼長度不足',
      tokenNotFound: '無法取得使用者令牌',
      failedToGetUserInfo: '無法取得使用者資訊',
      failedToGetUserRoles: '無法取得使用者角色'
    }
  },
  navbar: {
    logOut: '登出',
    home: '首頁'
  },
  language: {
    traditionalChinese: '繁體中文',
    simplifiedChinese: '簡體中文',
    english: '英文',
    indonesian: '印尼文',
    vietnamese: '越南文'
  },
  route: {
    dashboard: '儀錶板',
    view: '視圖資料下載',
    config: '程式參數設定',
    schema: '視圖參數設定',
    authorization: '權限設定',
    kendaLink: 'KENDA連結'
  },
  user: {
    id: '使用者代號',
    departments: '使用者部門',
    roles: '使用者角色',
    area: '地區'
  },
  view: {
    id: '視圖代號',
    limit: '筆數限制',
    column: '欄位名稱',
    operator: '運算子',
    value: '資料',
    value2: '資料 2',
    hintColumns: '顯示欄位',
    prompt: {
      displayQueryFields: '顯示查詢欄位',
      hideQueryFields: '隱藏查詢欄位'
    },
    message: {
      schemaNotFound: '無法取得設定檔',
      conditionNotFound: '請選擇條件',
      conditionIsIellegal: '條件不正確'
    },
    error: {
      failedToGetViewList: '無法取得所有的視圖清單',
      failedToGetViewListByGroup: '無法取得所有的視圖清單(依分類)',
      failedToGetUserViews: '無法取得使用者授權清單',
      failedToGetSchema: '無法取得設定檔資料',
      failedToGetSchemaFields: '無法取得設定檔的欄位設定資料',
      failedToGetData: '無法取得視圖查詢資料',
      failedToGetTitles: '無法取得視圖標題列資料',
      failedToGetRows: '無法取得視圖內容資料'
    }
  },
  config: {
    id: '參數代號',
    status: '設定檔狀態',
    mode: {
      create: '新增',
      query_modify: '查詢/修改'
    },
    error: {
      failedToGetConfigList: '無法取得所有的參數檔清單',
      failedToGetConfigListByGroup: '無法取得所有的參數檔清單(依分類)',
      failedToGetUserConfigs: '無法取得使用者授權清單',
      failedToGetConfig: '無法取得參數檔明細',
      failedToGetConfigData: '無法取得參數檔設定資料'
    }
  },
  schema: {
    id: '視圖代號',
    mode: {
      create: '新增',
      query_modify: '查詢/修改'
    },
    column: {
      name: '欄位名稱',
      description: '欄位描述',
      type: '型態',
      isCondition: '是否作為條件',
      isRequired: '是否為必要條件'
    }
  },
  authorization: {
    error: {
      failedToGetAuthorizeView: '無法取得角色所對應的視圖授權資料',
      failedToGetAuthorizeViewPermissions: '無法取得角色所對應的視圖授權清單',
      failedToGetAuthorizeConfig: '無法取得角色所對應的參數檔授權資料',
      failedToGetAuthorizeConfigPermissions: '無法取得角色所對應的參數檔授權清單'
    }
  }
}
