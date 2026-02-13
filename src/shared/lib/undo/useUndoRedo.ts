import { computed, ref, toRaw, type Ref } from "vue";

function cloneJson<T>(v: T): T {
  const raw = toRaw(v) as T;
  return JSON.parse(JSON.stringify(raw)) as T;
}

export function useUndoRedo<T>(initial: T) {
  const present: Ref<T> = ref(cloneJson(initial)) as Ref<T>;
  const past: Ref<T[]> = ref([]);
  const future: Ref<T[]> = ref([]);

  const canUndo = computed(() => past.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  function set(next: T) {
    present.value = cloneJson(next);
  }

  function push(next: T) {
    past.value.push(cloneJson(present.value));
    present.value = cloneJson(next);
    future.value = [];
  }

  function commit(prev: T, next: T) {
    past.value.push(cloneJson(prev));
    present.value = cloneJson(next);
    future.value = [];
  }

  function undo() {
    if (!canUndo.value) return;
    const prev = past.value.pop() as T;
    future.value.unshift(cloneJson(present.value));
    present.value = cloneJson(prev);
  }

  function redo() {
    if (!canRedo.value) return;
    const next = future.value.shift() as T;
    past.value.push(cloneJson(present.value));
    present.value = cloneJson(next);
  }

  function reset(next: T) {
    past.value = [];
    future.value = [];
    present.value = cloneJson(next);
  }

  return { present, canUndo, canRedo, set, push, commit, undo, redo, reset };
}