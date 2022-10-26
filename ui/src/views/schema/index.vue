<template>
  <div id="divContainer">
    <el-form ref="form" label-width="130px" label-position="center" >
      <el-form-item :label="$t('share.mode') + '：'">
        <el-radio-group v-model="swichMode">
          <el-radio-button label="0">{{ $t('schema.mode.query_modify') }}</el-radio-button>
          <el-radio-button label="1">{{ $t('schema.mode.create') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="swichMode === '1'">
        <el-form-item :label="$t('schema.id') + '：'">
          <el-input v-model="txtViewID" placeholder="ex: SALES_FORECAST" @keyup.native="onIdKeyIn" @keydown.native="onIdKeyIn" />
        </el-form-item>
        <el-form-item :label="$t('share.group') + '：'">
          <el-input v-model="txtGroup" placeholder="ex: SAS" @keyup.native="onIdKeyIn" @keydown.native="onIdKeyIn" />
        </el-form-item>
        <el-form-item :label="$t('share.database') + '：'">
          <el-select v-model="selectAddDatabase">
            <el-option
             v-for="database in databaseList"
             :value="database.value"
             :label="database.desc"
             :key="database.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('share.source') + '：'">
          <el-input v-model="txtAddSource" placeholder="ex: erp:SALES_FORECAST" />
        </el-form-item>
        <el-form-item :label="$t('share.description') + '：'">
          <el-input v-model="txtAddDescription" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="create" :disabled="isInvalid" icon="el-icon-check">
            {{ $t('share.create') }}
          </el-button>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item :label="$t('share.group') + '：'">
          <el-select v-model="selectGroup" @change="selectViewID=''">
            <el-option
              v-for="list in userViews"
              :key="list.group"
              :label="list.group"
              :value="list.group">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('schema.id') + '：'">
          <el-select v-model="selectViewID" filterable @change="getSchema(true)">
            <el-option
              v-for="view in viewOptions"
              :key="view.id"
              :label="view.id"
              :value="view.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-show="selectViewID !== '' && bQuery === true">
          <el-form-item :label="$t('share.database') + '：'">
            <el-select v-model="selectModDatabase">
              <el-option
               v-for="database in databaseList"
               :value="database.value"
               :label="database.desc"
               :key="database.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('share.source') + '：'">
            <el-input v-model="txtModSource" />
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
          <el-button type="primary" @click="save" v-show="isSchema" :disabled="actions.indexOf('UPDATE') < 0" icon="el-icon-edit">
            {{ $t('share.save') }}
          </el-button>
          <el-button type="primary" @click="getSchema(true)" v-show="isSchema" icon="el-icon-refresh">
            {{ $t('share.refresh') }}
          </el-button>
        </el-form-item>
        <hr>
          <div v-show="selectViewID !== '' && bQuery === true">
            <el-button type="success" @click="addRow" icon="el-icon-plus">
              {{ $t('share.add') }}
            </el-button>
            <el-table class="elTable" :data="tabelColunms">
              <el-table-column prop="name" :label="$t('schema.column.name')" min-width="12%">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" />
                </template>
              </el-table-column>
              <el-table-column prop="description" :label="$t('schema.column.description')" min-width="18%">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" />
                </template>
              </el-table-column>
              <el-table-column prop="type" :label="$t('schema.column.type')" min-width="25%">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type">
                    <el-option value="string"></el-option>
                    <el-option value="integer"></el-option>
                    <el-option value="boolean"></el-option>
                    <el-option value="date"></el-option>
                    <el-option value="datetime"></el-option>
                    <el-option value="nanoseconds"></el-option>
                    <el-option value="url"></el-option>
                    <el-option value="enum"></el-option>
                  </el-select>
                  <div v-if="scope.row.type === 'url' || scope.row.type === 'enum'">
                    <div v-if="scope.row.type === 'url'">
                      <el-input v-model="scope.row.urlTemplate" class="urlInput" placeholder="template url" />
                    </div>
                    <el-input
                      v-for="(value, index) in scope.row.values"
                      v-model="scope.row.values[index]"
                      class="enumInput"
                      :key="index"
                      :placeholder="$t('schema.column.name')"/>
                    <div>
                      <el-button type="success" size="small" @click="scope.row.values.push('')" icon="el-icon-plus" round/>
                      <el-button type="danger" size="small" @click="scope.row.values.splice(scope.row.values.length - 1, 1)" icon="el-icon-minus" round/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="isCondition" :label="$t('schema.column.isCondition')" min-width="10%">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isCondition" @change="alterRowData(scope.$index)">YES</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="isRequired" :label="$t('schema.column.isRequired')" min-width="10%">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isRequired" @change="alterRowData(scope.$index)" :disabled="!scope.row.isCondition">YES</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column min-width="25%">
                <template slot-scope="scope">
                  <el-button @click="topItem(scope.$index)" :disabled="scope.$index===0" icon="el-icon-caret-top" />
                  <el-button @click="bottomItem(scope.$index)" :disabled="scope.$index===tabelColunms.length-1" icon="el-icon-caret-bottom" />
                  <el-button type="danger" @click="deleteRow(scope.$index)" icon="el-icon-delete" />
                </template>
              </el-table-column>
            </el-table>
          </div>
      </div>
    </el-form>
  </div>
</template>

<script src="./schema.ts" lang="ts"></script>
<style src="./schema.scss" lang="scss" scoped></style>
