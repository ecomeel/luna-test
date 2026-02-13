<template>
  <div>
    <header class="page-title">
      <h1>Заметки</h1>

      <div v-show="notes.length" class="actions-row">
        <el-button type="primary" @click="createNote">
          Создать
        </el-button>
      </div>
    </header>

    <div class="content-body">
      <EmptyState
        v-if="!notes.length"
        title="Пока нет заметок"
        text="Создай первую заметку и добавь задачи."
      >
        <template #actions>
          <el-button type="primary" @click="createNote">
            Создать заметку
          </el-button>
        </template>
      </EmptyState>

      <NoteList
        v-else
        :notes="notes"
        @edit="goEdit"
        @delete="tryDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from "~/entities/note/model/notes.store";
import NoteList from "~/widgets/note-list/ui/NoteList.vue";
import EmptyState from "~/shared/ui/empty-state/EmptyState.vue";
import { useRemoveNote } from "~/features/note/remove/model/useRemoveNote";

const store = useNotesStore();
const router = useRouter();
const removeNote = useRemoveNote();

const notes = computed(() => store.sorted);

const createNote = () => router.push("/note/new");
const goEdit = (id: string) => router.push(`/note/${id}`);

const tryDelete = async (id: string) => {
  await removeNote(id);
};
</script>

<style scoped lang="scss">
.content-body {
  margin-top: 14px;
}
</style>