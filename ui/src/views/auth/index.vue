<template>
  <div id="divContainer">
    <el-form ref="form" label-width="110px" label-position="center" >
      <div>
        <el-form-item :label="$t('share.systemType') + '：'">
          <el-select v-model="selectType" @change="setGroupOptions">
            <el-option value="VIEW" label="VIEW"></el-option>
            <el-option value="CONFIG" label="CONFIG"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('share.role') + '：'">
          <el-select v-model="selectRole" @change="query(true)">
            <el-option
              v-for="role in roles"
              :key="role"
              :label="role"
              :value="role">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('share.group') + '：'">
          <el-select v-model="selectGroup" @change="query(true)">
            <el-option
              v-for="list in groupList"
              :key="list.group"
              :label="list.group"
              :value="list.group">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query(true)" v-show="isPermission" icon="el-icon-refresh">
            {{ $t('share.refresh') }}
          </el-button>
        </el-form-item>
        <el-form-item :label="selectType + ' ' + $t('share.id') + '：'" v-show="bQuery">
          <el-select v-model="selectProgramID">
            <el-option
              v-for="id in programs.id"
              :key="id"
              :label="id"
              :value="id">
            </el-option>
          </el-select>
          <el-button type="success" @click="addProgram(selectProgramID)" icon="el-icon-plus" :disabled="selectProgramID === ''">
            {{ $t('share.add') }}
          </el-button>
        </el-form-item>
      </div>
      <hr>
      <el-table
        v-show="bQuery"
        :data="permissions">
        <el-table-column prop="id" :label="$t('share.id')">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="actions" :label="$t('share.actions')">
          <template slot-scope="scope">
            <el-checkbox-group v-model="scope.row.actions">
              <el-checkbox label="QUERY">{{ $t('share.query') }}</el-checkbox>
              <el-checkbox label="UPDATE">{{ $t('share.update') }}</el-checkbox>
              <el-checkbox label="INSERT">{{ $t('share.insert') }}</el-checkbox>
              <el-checkbox label="DELETE">{{ $t('share.delete') }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="primary" @click="save" icon="el-icon-check" :disabled="!isPermission" />
            <el-button type="danger" @click="removefield(scope.$index)" icon="el-icon-delete" />
          </template>
        </el-table-column>
      </el-table>
      <div v-show="showUpdateInfo">
        <hr>
        <h3>{{ $t('share.lastUpdatedBy') }}： {{ lastUpdatedBy }}</h3>
        <h3>{{ $t('share.lastUpdatedAt') }}： {{ lastUpdatedAt }}</h3>
      </div>
    </el-form>
  </div>
</template>

<script src="./auth.ts" lang="ts"></script>
<style src="./auth.scss" lang="scss" scoped></style>
