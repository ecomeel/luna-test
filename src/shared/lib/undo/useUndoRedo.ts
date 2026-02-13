import { computed, ref, type Ref } from "vue";
import { deepClone } from "~/shared/lib/clone/clone";
import { deepEqual } from "~/shared/lib/equal/equal";

export function useUndoRedo<T>(initial: T) {
  const present: Ref<T> = ref(deepClone(initial)) as Ref<T>;
  const past: Ref<T[]> = ref([]);
  const future: Ref<T[]> = ref([]);

  const canUndo = computed(() => past.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  function set(next: T) {
    present.value = deepClone(next);
  }

  function push(next: T) {
    if (deepEqual(next, present.value)) return;

    past.value.push(deepClone(present.value));
    present.value = deepClone(next);
    future.value = [];
  }

  function commit(prev: T, next: T) {
    if (deepEqual(prev, next)) return;

    past.value.push(deepClone(prev));
    present.value = deepClone(next);
    future.value = [];
  }

  function undo() {
    if (!canUndo.value) return;
    const prev = past.value.pop() as T;
    future.value.unshift(deepClone(present.value));
    present.value = deepClone(prev);
  }

  function redo() {
    if (!canRedo.value) return;
    const next = future.value.shift() as T;
    past.value.push(deepClone(present.value));
    present.value = deepClone(next);
  }

  function reset(next: T) {
    past.value = [];
    future.value = [];
    present.value = deepClone(next);
  }

  return { present, canUndo, canRedo, set, push, commit, undo, redo, reset };
}
