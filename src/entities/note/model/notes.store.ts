import { defineStore } from "pinia";
import type { Note, Todo } from "./types";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return Date.now();
}

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [] as Note[]
  }),

  persist: { key: "notes-spa::state" },

  getters: {
    noteById: (s) => (id: string) => s.notes.find((n) => n.id === id) ?? null,
    sorted: (s) => [...s.notes].sort((a, b) => b.updatedAt - a.updatedAt)
  },

  actions: {
    createEmptyNote(): Note {
      const t = now();
      return { 
        id: uid(),
        title: "",
        todos: [],
        createdAt: t,
        updatedAt: t
      };
    },

    makeTodo(text = ""): Todo {
      return { id: uid(), text, done: false };
    },

    addNote(note: Note) {
      this.notes.unshift({ ...note, updatedAt: now() });
    },

    updateNote(note: Note) {
      const idx = this.notes.findIndex((n) => n.id === note.id);
      if (idx === -1) return;
      this.notes[idx] = { ...note, updatedAt: now() };
    },

    removeNote(id: string) {
      this.notes = this.notes.filter((n) => n.id !== id);
    }
  }
});