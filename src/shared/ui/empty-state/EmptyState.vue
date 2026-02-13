<template>
  <el-card class="empty">
    <div class="empty__title">{{ title }}</div>
    <div class="empty__text muted">{{ text }}</div>
    <div v-if="$slots.actions" class="empty__actions">
      <slot name="actions" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{ title: string; text: string }>();
</script>

<style scoped lang="scss">
.empty {
  text-align: center;
  padding: 10px;

  &__title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  &__actions {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
}
</style>