<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      {{ $t('user.id') }}： {{ id }}
    </div>
    <div class="dashboard-text">
      {{ $t('user.departments') }}： {{ departments }}
    </div>
    <div class="dashboard-text">
      {{ $t('user.roles') }}： {{ roles }}
    </div>
    <div class="dashboard-text">
      {{ $t('user.area') }}： {{ area }}
    </div>
  </div>
</template>

<script src="./dashboard.ts" lang="ts"></script>
<style src="./dashboard.scss" lang="scss" scoped></style>
