<template>
  <div class="row">
    <el-checkbox :model-value="model.done" @change="toggleDone" />

    <el-input
      class="row__input"
      :model-value="model.text"
      placeholder="Текст задачи"
      @input="updateText"
      size="default"
    />

    <el-button type="danger" plain @click="onRemove">
      Удалить
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from "~/entities/note/model/types";

const props = defineProps<{ model: Todo }>();

const emit = defineEmits<{
  (e: "update", next: Todo): void;
  (e: "remove", id: string): void;
}>();

const updateText = (v: string) => {
  if (props.model.text !== v) emit("update", { ...props.model, text: v });
};

const toggleDone = (v: boolean) => {
  emit("update", { ...props.model, done: v });
};

const onRemove = () => {
  emit("remove", props.model.id);
};
</script>

<style scoped lang="scss">
.row {
  display: grid;
  grid-template-columns: 24px 1fr 120px;
  gap: 10px;
  align-items: center;

  @media (max-width: 560px) {
    grid-template-columns: 24px 1fr;
    grid-template-rows: auto auto;

    :deep(.el-button) {
      grid-column: 1 / -1;
      justify-self: stretch;
    }
  }
}

.row__input {
  width: 100%;
}
</style>