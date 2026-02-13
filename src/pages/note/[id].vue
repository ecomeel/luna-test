<template>
  <div>
    <div class="page-title">
      <h1>{{ pageTitle }}</h1>

      <div class="actions-row">
        <el-button @click="back">К списку</el-button>
      </div>
    </div>

    <div style="margin-top: 14px">
      <EmptyState
        v-if="!model"
        title="Заметка не найдена"
        text="Возможно, она была удалена."
      >
        <template #actions>
          <el-button 
            type="primary" 
            @click="router.push('/')"
          >
            На главную
          </el-button>
        </template>
      </EmptyState>

      <NoteEditor
        v-else
        :model-value="model"
        :make-todo="store.makeTodo"
        @save="onSave"
        @cancel="onCancel"
        @delete="onDelete"
        @hasChanges="(v) => (hasChanges = v)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from "~/entities/note/model/notes.store";
import NoteEditor from "~/widgets/note-editor/ui/NoteEditor.vue";
import EmptyState from "~/shared/ui/empty-state/EmptyState.vue";
import type { Note } from "~/entities/note/model/types";
import { useRemoveNote } from "~/features/note/remove/model/useRemoveNote";
import { useConfirmLeave } from "~/features/note/confirm-leave/model/useConfirmLeave";

const store = useNotesStore();
const route = useRoute();
const router = useRouter();
const removeNote = useRemoveNote();

const id = computed(() => String(route.params.id ?? ""));
const isNew = computed(() => id.value === "new");

const pageTitle = computed(
  () => isNew.value ? "Новая заметка" : "Редактирование")


const hasChanges = ref(false);

const confirmLeave = useConfirmLeave({
  hasChanges: hasChanges,
  title: "Выйти без сохранения?",
  message: "Несохранённые изменения будут потеряны."
})

const model = computed<Note | null>(
  () => isNew.value ? draft.value : store.noteById(id.value));

const draft = ref<Note>(store.createEmptyNote());

watch(isNew, (v) => {
    if (v) {
      draft.value = store.createEmptyNote();
    }
  },
  { immediate: true }
);

const onSave = (note: Note) => {
  if (isNew.value) {
    store.addNote(note);
    router.push("/");
    return;
  }
  store.updateNote(note);
  router.push("/");
};

const back = () => confirmLeave(() => router.push("/"));

const onCancel = () => confirmLeave(() => router.push("/"));

const onDelete = async () => {
  if (isNew.value) return router.push("/");

  await removeNote(id.value)

  router.push("/");
};
</script>