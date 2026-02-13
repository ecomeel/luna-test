<template>
  <div class="card-grid">
    <NoteCard
      v-for="n in notes"
      :key="n.id"
      :note="n"
      :preview-count="3"
      @edit="(id) => $emit('edit', id)"
      @delete="(id) => $emit('delete', id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Note } from "~/entities/note/model/types";
import NoteCard from "~/entities/note/ui/NoteCard.vue";

defineProps<{ notes: Note[] }>();
defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();
</script>

<style scoped lang="scss">
.card-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
</style>