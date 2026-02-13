<template>
  <el-card>
    <div class="top">
      <div class="title">
        <el-input
          :model-value="draft.title"
          placeholder="Название заметки"
          size="large"
          @update:modelValue="onTitleInput"
        />
      </div>

      <div class="actions">
        <el-button :disabled="!canUndo" @click="undo">Отменить</el-button>
        <el-button :disabled="!canRedo" @click="redo">Повторить</el-button>
      </div>
    </div>

    <div class="toolbar">
      <el-button type="primary" @click="addTodo">Добавить задачу</el-button>
      <div class="muted hint">
        Ctrl/Cmd+Z — undo • Ctrl/Cmd+Shift+Z — redo
      </div>
    </div>

    <div class="list">
      <TodoItemRow
        v-for="t in draft.todos"
        :key="t.id"
        :model="t"
        @update="updateTodo"
        @remove="removeTodo"
      />
      <div v-if="!draft.todos.length" class="muted">
        Пока нет задач — добавь первую.
      </div>
    </div>

    <div class="footer">
      <el-button @click="$emit('cancel')">Отмена</el-button>
      <el-button type="danger" plain @click="$emit('delete')">Удалить</el-button>
      <el-button type="primary" @click="emitSave">Сохранить</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Note, Todo } from "~/entities/note/model/types";
import TodoItemRow from "~/entities/note/ui/TodoItemRow.vue";
import { useUndoRedo } from "~/shared/lib/undo/useUndoRedo";
import { useHotkeys } from "~/shared/lib/keyboard/useHotkeys";
import { deepClone } from "~/shared/lib/clone/clone";
import { deepEqual } from "~/shared/lib/equal/equal";

const props = defineProps<{ modelValue: Note; makeTodo: (text?: string) => Todo }>();

const emit = defineEmits<{
  (e: "save", note: Note): void;
  (e: "cancel"): void;
  (e: "delete"): void;
  (e: "hasChanges", v: boolean): void;
}>();

const { 
  present, 
  canUndo, 
  canRedo, 
  push, 
  undo, 
  redo, 
  reset,
  set,
  commit,
} = useUndoRedo<Note>(props.modelValue);

const draft = computed(() => present.value);

const initial = ref(deepClone(props.modelValue));

watch(present,
  (v) => emit("hasChanges", !deepEqual(v, initial.value)),
  { deep: true, immediate: true }
);

watch(
  () => props.modelValue,
  (v) => {
    reset(v);
    initial.value = deepClone(v);
  }
);

let tmr: number | null = null;
let base: Note | null = null;
let last: Note | null = null;

const commitDebounced = (prev: Note, next: Note) => {
  if (!base) base = prev;
  last = next;

  if (tmr) window.clearTimeout(tmr);
  tmr = window.setTimeout(() => {
    if (base && last) commit(base, last);
    base = null;
    last = null;
    tmr = null;
  }, 200);
};

const onTitleInput = (v: unknown) => {
  const title = typeof v === "string" ? v : String(v ?? "");

  const prev = present.value;
  const next = { ...prev, title };

  set(next);
  commitDebounced(prev, next);
};

const addTodo = () => {
  const next: Note = {
    ...present.value,
    todos: [...present.value.todos, props.makeTodo("")]
  };
  push(next);
};

const updateTodo = (todo: Todo) => {
  const prev = present.value;

  const nextTodos = prev.todos.map((t) => (t.id === todo.id ? todo : t));
  const next = { ...prev, todos: nextTodos };

  set(next); 
  commitDebounced(prev, next);
};

const removeTodo = (id: string) => {
  const nextTodos = present.value.todos.filter((t) => t.id !== id);
  push({ ...present.value, todos: nextTodos });
};

const emitSave = () => {
  emit("save", { ...present.value, updatedAt: Date.now() });
  initial.value = deepClone(present.value);
  emit("hasChanges", false);
};

useHotkeys([
  {
    match: (e) => (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z",
    handler: () => undo()
  },
  {
    match: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z",
    handler: () => redo()
  }
]);

</script>

<style scoped lang="scss">
.top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}

.title {
  flex: 1 1 420px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.hint {
  font-size: 12px;
}

.list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.footer {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>