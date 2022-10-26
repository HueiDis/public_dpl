export default {
  share: {
    create: 'Create',
    insert: 'Insert',
    delete: 'Delete',
    modify: 'Modify',
    update: 'Update',
    save: 'Save',
    refresh: 'Refresh',
    add: 'Add',
    clear: 'Clear',
    edit: 'Edit',
    query: 'Query',
    search: 'Search',
    download: 'Download',
    id: 'ID',
    actions: 'Actions',
    confirm: 'Confirm',
    cancel: 'Cancel',
    success: 'Success',
    fail: 'Fail',
    actionComplete: 'Action Complete',
    updateSuccessfully: 'Update successfully',
    deleteSuccessfully: 'Delete successfully',
    addSuccessfully: 'Add successfully',
    addColumn: 'Add a column',
    deleteColumn: 'Delete a column',
    itemExist: 'Item already exists',
    changeLanguageTips: 'Switch Language Success',
    errorMessage: 'Error Message',
    showData: 'Show Data',
    mode: 'Mode',
    systemType: 'System Type',
    group: 'Group',
    role: 'Role',
    database: 'Database',
    source: 'Source',
    count: 'Row Count',
    description: 'Description',
    lastUpdatedBy: 'Last Updated By',
    lastUpdatedAt: 'Last Updated At',
    published: 'Published',
    invailid: 'Invailid',
    note: 'Note'
  },
  login: {
    SignIn: 'Sign In',
    account: 'Account / Employee ID',
    password: 'Password',
    mode: {
      AD: 'Windows AD',
      employee: 'Employee ID'
    },
    error: {
      badAccountInfo: 'Please enter the correct user name',
      badPasswordLength: 'The password can not be less than 6 digits',
      tokenNotFound: 'Unable to get user token',
      failedToGetUserInfo: 'Unable to get user information',
      failedToGetUserRoles: 'Unable to get user roles'
    }
  },
  navbar: {
    logOut: 'Log out',
    home: 'Home'
  },
  language: {
    traditionalChinese: 'Traditional Chinese',
    simplifiedChinese: 'Simplified Chinese',
    english: 'English',
    indonesian: 'Indonesian',
    vietnamese: 'Vietnamese'
  },
  route: {
    dashboard: 'Dashboard',
    view: 'View',
    config: 'Config',
    schema: 'Schema',
    authorization: 'Authorization',
    kendaLink: 'Kenda'
  },
  user: {
    id: 'User ID',
    departments: 'Departments',
    roles: 'Roles',
    area: 'Area'
  },
  view: {
    id: 'View',
    limit: 'Limit',
    column: 'Column',
    operator: 'Operator',
    value: 'Value',
    value2: 'Value 2',
    hintColumns: 'Display Columns',
    prompt: {
      displayQueryFields: 'Display Query Fields',
      hideQueryFields: 'Hide Query Fields'
    },
    message: {
      schemaNotFound: 'Unable to get schema',
      conditionNotFound: 'Please select at least one query condition',
      conditionIsIellegal: 'The query condition is illegal'
    },
    error: {
      failedToGetViewList: 'Unable to get view list',
      failedToGetViewListByGroup: 'Unable to get view list by group',
      failedToGetUserViews: 'Unable to get user views',
      failedToGetSchema: 'Unable to get view schema',
      failedToGetSchemaFields: 'Unable to get view schema fields',
      failedToGetData: 'Unable to get view data',
      failedToGetTitles: 'Unable to get view titles',
      failedToGetRows: 'Unable to get view data rows'
    }
  },
  config: {
    id: 'ID',
    status: 'Status',
    mode: {
      create: 'CREATE',
      query_modify: 'QUERY/MODIFY'
    },
    error: {
      failedToGetConfigList: 'Unable to get config list',
      failedToGetConfigListByGroup: 'Unable to get config list by group',
      failedToGetUserConfigs: 'Unable to get user configs',
      failedToGetConfig: 'Unable to get config deta',
      failedToGetConfigData: 'Unable to get config value'
    }
  },
  schema: {
    id: 'ID',
    column: {
      name: 'Name',
      description: 'Description',
      type: 'Type',
      isCondition: 'As condition',
      isRequired: 'Required'
    },
    mode: {
      create: 'CREATE',
      query_modify: 'QUERY/MODIFY'
    }
  },
  authorization: {
    error: {
      failedToGetAuthorizeView: 'Unable to get authorized views by a role',
      failedToGetAuthorizeViewPermissions: 'Unable to get permissions of view',
      failedToGetAuthorizeConfig: 'Unable to get authorized configs by a role',
      failedToGetAuthorizeConfigPermissions: 'Unable to get permissions of config'
    }
  }
}
