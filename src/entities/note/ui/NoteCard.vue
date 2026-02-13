<template>
  <el-card class="card" shadow="hover">
    <div class="card__top">
      <div class="card__title" :title="note.title || 'Без названия'">
        {{ note.title || "Без названия" }}
      </div>

      <el-dropdown trigger="click">
        <el-button text type="primary">Действия</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="dropdownBtn in dropdownActionBtns"
              :key="dropdownBtn.title"
              @click="dropdownBtn.action(note.id)"
            >
              {{ dropdownBtn.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="card__body">
      <div v-if="!previewTodos.length" class="muted">Нет задач</div>

      <ul v-else class="list">
        <li v-for="t in previewTodos" :key="t.id" class="list__item">
          <el-icon class="list__icon">
             <component :is="t.done ? Check : Minus" />
          </el-icon>
          <span :class="{ done: t.done }">{{ t.text || "…" }}</span>
        </li>
      </ul>

      <p 
        v-if="note.todos.length > previewTodos.length" 
        class="muted more"
      >
        + ещё {{ note.todos.length - previewTodos.length }}
      </p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Check, Minus } from "@element-plus/icons-vue";
import type { Note } from "~/entities/note/model/types";

const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();

const props = defineProps<{ note: Note; previewCount?: number }>();

const previewTodos = computed(() => props.note.todos.slice(0, props.previewCount ?? 3));

const dropdownActionBtns = computed(() => [
  { title: "Редактировать", action: (id: string) => emit("edit", id)},
  { title: "Удалить", action: (id: string) => emit("delete", id) },
])
</script>

<style scoped lang="scss">
.card {
  height: 100%;

  &__top {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-weight: 800;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
  }

  &__body {
    margin-top: 8px;
  }
}

.list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 6px;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.25;
  }

  &__icon {
    font-size: 14px;
    opacity: 0.7;
  }
}

.done {
  text-decoration: line-through;
  opacity: 0.65;
}

.more {
  margin-top: 6px;
}
</style>