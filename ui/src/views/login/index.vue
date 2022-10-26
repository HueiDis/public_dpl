<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12">
        <img src="@/assets/login/gopher.gif" class="gopher">
        <img src="@/assets/login/logo.png" class="logo">
      </el-col>
      <el-col :span="12">
        <lang-select class="set-language" />
        <el-card shadow="hover">
          <el-radio-group class="mode_radio" v-model="loginForm.mode">
            <el-radio-button :label="loginMode.AD">{{ $t('login.mode.AD') }}</el-radio-button>
            <el-tooltip effect="dark" content="coming soon!" placement="right-end">
              <el-radio-button :label="loginMode.EmployeeID" disabled>{{ $t('login.mode.employee') }}</el-radio-button>
            </el-tooltip>
          </el-radio-group>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="factory">
              <span class="svg-container">
                <svg-icon name="international" />
              </span>
              <el-select
                ref="factory"
                v-model="loginForm.factory"
                name="factory">
                <el-option
                  v-for="factory in factoryList"
                  :key="factory.value"
                  :label="factory.desc"
                  :value="factory.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="id">
              <span class="svg-container">
                <svg-icon name="user" />
              </span>
              <el-input
                ref="id"
                v-model="loginForm.id"
                name="id"
                type="text"
                autocomplete="on"
                :placeholder="$t('login.account')"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon name="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                autocomplete="on"
                @keyup.enter.native="handleLogin"
              />
              <span
                class="show-pwd"
                @click="showPwd"
              >
                <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
              </span>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%; margin-bottom:30px;"
              @click.native.prevent="handleLogin"
              plain
            >
              {{$t('login.SignIn')}}
            </el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script src="./login.ts" lang="ts"></script>
<style src="./login.scss" lang="scss"></style>
