<template>
  <div id='divContainer'>
    <el-form ref="form" label-width="130px" label-position="center" >
      <el-form-item :label="$t('share.note') + '：'">
        <el-tooltip content="建立新的參數檔架構時，須先由IT人員維護">
          <el-button>1.</el-button>
        </el-tooltip>
        <el-tooltip content="若無維護權限，請聯繫管理人員">
          <el-button>2.</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('share.mode') + '：'">
        <el-radio-group v-model="swichMode">
          <el-radio-button label="0">{{ $t('config.mode.query_modify') }}</el-radio-button>
          <el-radio-button label="1">{{ $t('config.mode.create') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="swichMode === '1'">
        <el-form-item :label="$t('config.id') + '：'">
          <el-input v-model="txtConfigID" placeholder="ex: QCT450_REPORT" @keyup.native="onIdKeyIn" @keydown.native="onIdKeyIn" />
        </el-form-item>
        <el-form-item :label="$t('share.group') + '：'">
          <el-input v-model="txtGroup" placeholder="ex: QCT" @keyup.native="onIdKeyIn" @keydown.native="onIdKeyIn" />
        </el-form-item>
        <el-form-item :label="$t('share.description') + '：'">
          <el-input type="textarea" :autosize="{minRows: 3}" v-model="txtAddDescription" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <v-jsoneditor v-model="newConfigData" :plus="false" height="600px" />
          </el-col>
        </el-row>
        <br />
        <el-form-item>
          <el-button type="primary" @click="create" :disabled="txtConfigID === '' || txtGroup === '' || txtAddDescription === ''" icon="el-icon-check">
            {{ $t('share.create') }}
          </el-button>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item :label="$t('share.group') + '：'">
          <el-select v-model="selectGroup" @change="selectConfig=''">
            <el-option
              v-for="list in userConfigs"
              :key="list.group"
              :label="list.group"
              :value="list.group">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.id') + '：'">
          <el-select v-model="selectConfig" filterable @change="query(true)">
            <el-option
              v-for="config in configOptions"
              :key="config.id"
              :label="config.id"
              :value="config.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-show="selectConfig !== '' && bQuery">
          <el-form-item :label="$t('config.status') + '：'">
            <el-radio-group v-model="status">
              <el-radio-button label="published">{{ $t('share.published') }}</el-radio-button>
              <el-radio-button label="invailid">{{ $t('share.invailid') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('share.description') + '：'">
            <el-input type="textarea" :autosize="{minRows: 3}" v-model="txtModDescription" />
          </el-form-item>
          <el-form-item :label="$t('share.lastUpdatedBy') + '：'">
            {{ lastUpdatedBy }}
          </el-form-item>
          <el-form-item :label="$t('share.lastUpdatedAt') + '：'">
            {{ lastUpdatedAt }}
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="save" v-show="isData" :disabled="actions.indexOf('UPDATE') < 0" icon="el-icon-edit">
            {{ $t('share.save') }}
          </el-button>
          <el-button type="primary" v-show="isData" @click="query(true)" icon="el-icon-refresh">
            {{ $t('share.refresh') }}
          </el-button>
        </el-form-item>
        <div v-show="selectConfig !== '' && bQuery">
          <hr>
          <el-row>
            <el-col :span="12">
              <v-jsoneditor v-model="configData" :plus="false" height="600px" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script src="./config.ts" lang="ts"></script>
<style src="./config.scss" lang="scss" scoped></style>
