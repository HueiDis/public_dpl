<template>
  <div id="divContainer">
    <el-form ref="form" label-width="100px" label-position="center">
      <el-row>
        <el-form-item :label="$t('share.group') + '：'">
          <el-select v-model="selectGroup" @change="selectViewID = ''">
            <el-option
              v-for="list in userViews"
              :key="list.group"
              :label="list.group"
              :value="list.group">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('view.id') + '：'">
            <el-select v-model="selectViewID" filterable @change="handleGetSchema">
              <el-option
                v-for="view in viewOptions"
                :key="view.id"
                :label="view.id"
                :value="view.id">
              </el-option>
            </el-select>
            <div v-if="selectViewID !== ''">{{ description }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div v-if="selectViewID === ''"></div>
          <h3 v-else-if="!isSchema">{{ $t("view.message.schemaNotFound") }}</h3>
          <div v-else>
            <el-collapse-transition>
              <div v-show="showQueryField">
                <el-form-item :label="$t('view.limit') + '：'">
                  <el-slider
                    v-model="limit"
                    show-input
                    :min="1"
                    :max="120000"
                  ></el-slider>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="handleAddField" icon="el-icon-plus">
                    {{$t("share.add")}}
                  </el-button>
                  <el-button type="danger" @click="handleRemoveField" icon="el-icon-delete">
                    {{ $t("share.clear") }}
                  </el-button>
                </el-form-item>
                <h3 v-if="!bHasQueryFields">
                  {{ $t("view.message.conditionNotFound") }}
                </h3>
                <el-table v-else class="elTable" :data="queryFields">
                  <el-table-column prop="name" :label="$t('view.column')">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.name"
                      @change="onChanged && (scope.row.type = getFieldType(scope.row.name))"
                      :disabled="scope.row.isRequired">
                        <el-option
                          v-for="sField in fields"
                          v-show="sField.isCondition"
                          :value="sField.name"
                          :label="sField.description"
                          :key="sField.name">
                        </el-option>
                      </el-select>
                      <el-input v-show="false" v-model="scope.row.name"/>
                    </template>
                  </el-table-column>
                  <el-table-column prop="operator" :label="$t('view.operator')">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.operator" @change="onChanged">
                        <el-option
                          v-for="operator in operators"
                          :value="operator.value"
                          :label="operator.desc"
                          :key="operator.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" :label="$t('view.value')">
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="getFieldType(scope.row.name) === 'integer'"
                        v-model="scope.row.value"
                        @input="excuteAfterTimes(200, onChanged)"/>
                      <el-date-picker
                        v-else-if="getFieldType(scope.row.name) === 'date'"
                        v-model="scope.row.value"
                        type="date"
                        value-format='yyyy/MM/dd'
                        @input="excuteAfterTimes(200, onChanged)"/>
                      <el-date-picker
                        v-else-if="getFieldType(scope.row.name) === 'datetime'"
                        v-model="scope.row.value"
                        type="datetime"
                        value-format='yyyy/MM/dd HH:mm:ss'
                        @input="excuteAfterTimes(200, onChanged)"/>
                      <el-date-picker
                        v-else-if="getFieldType(scope.row.name) === 'nanoseconds'"
                        v-model="scope.row.dateStr"
                        type="datetime"
                        value-format='yyyy/MM/dd HH:mm:ss'
                        @input="(scope.row.value = getNanoTime(scope.row.dateStr)) & excuteAfterTimes(200, onChanged)"/>
                      <el-select
                        v-else-if="getFieldType(scope.row.name) === 'enum'"
                        v-model="scope.row.value"
                        @input="excuteAfterTimes(200, onChanged)">
                        <el-option
                          v-for="value in getFieldEnumValues(scope.row.name)"
                          :value="value"
                          :label="value"
                          :key="value">
                        </el-option>
                      </el-select>
                      <el-input
                        v-else
                        v-model="scope.row.value"
                        @input="excuteAfterTimes(200, onChanged)"/>
                    </template>
                  </el-table-column>
                  <el-table-column prop="optValue" :label="$t('view.value2')">
                    <template slot-scope="scope" v-if="scope.row.operator >= 9">
                      <el-date-picker
                        v-if="getFieldType(scope.row.name) === 'date'"
                        v-model="scope.row.optValue"
                        type="date"
                        value-format='yyyy/MM/dd'
                        @input="excuteAfterTimes(200, onChanged)"/>
                      <el-date-picker
                        v-else-if="getFieldType(scope.row.name) === 'datetime'"
                        v-model="scope.row.optValue"
                        type="datetime"
                        value-format='yyyy/MM/dd HH:mm:ss'
                        @input="excuteAfterTimes(200, onChanged)"/>
                      <el-date-picker
                        v-else-if="getFieldType(scope.row.name) === 'nanoseconds'"
                        v-model="scope.row.optDateStr"
                        type="datetime"
                        value-format='yyyy/MM/dd HH:mm:ss'
                        @input="(scope.row.optValue = getNanoTime(scope.row.optDateStr)) & excuteAfterTimes(200, onChanged)"/>
                      <el-input
                        v-else
                        v-model="scope.row.optValue"
                        @input="excuteAfterTimes(200, onChanged)"/>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        @click="handleRemoveField(scope.$index)"
                        v-show="!scope.row.isRequired"
                        icon="el-icon-delete"/>
                    </template>
                  </el-table-column>
                </el-table>
                <h3 v-show="!isValid">
                  {{ $t("view.message.conditionIsIellegal") }}
                </h3>
                <br />
                <el-button
                  type="primary"
                  @click="handleQuery(true)"
                  icon="el-icon-search"
                  :loading="loading"
                  :disabled="!isValid">
                  {{ $t("share.query") }}
                </el-button>
                <el-button
                  type="primary"
                  @click="handleDownload"
                  icon="el-icon-download"
                  :disabled="viewData.length === 0">
                  {{ $t("share.download") }}
                </el-button>
              </div>
            </el-collapse-transition>
            <el-divider>
              <i v-if="showQueryField" @click="showQueryField = !showQueryField" class="el-icon-arrow-up">{{ ' ' + $t('view.prompt.hideQueryFields') }}</i>
              <i v-else @click="showQueryField = !showQueryField" class="el-icon-arrow-down">{{ ' ' + $t('view.prompt.displayQueryFields') }}</i>
            </el-divider>
            <div id="divFields">
              <el-select
                v-model="columnListOfShow"
                multiple
                filterable
                collapse-tags
                :placeholder="$t('view.hintColumns')">
                <el-option
                  v-for="field in fields"
                  :key="field.name"
                  :label="field.description"
                  :value="field.name">
                </el-option>
              </el-select>
            </div>
            <div id="divData">
              <el-table
                id="vTable"
                border
                v-loading="loading"
                :height="tableMaxHeight"
                :data="viewData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                <el-table-column
                  v-for="{name, type, values, urlTemplate, description} in bindTableColumns"
                  :prop="name"
                  :label="description"
                  :key="name"
                  sortable>
                  <template slot-scope="scope">
                    <span v-if="type==='url'"><a :href="getQueryLink(scope.row, urlTemplate, values )" target='_blank'>link</a></span>
                    <span v-else>{{ scope.row[name] }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
              :page-size="pageSize"
              :total="viewData.length"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script src="./view.ts" lang="ts"></script>
<style src="./view.scss" lang="scss" scoped></style>
