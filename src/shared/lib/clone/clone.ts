import { toRaw } from "vue";

export function deepClone<T>(value: T): T {
  const raw = toRaw(value) as T;

  return structuredClone(raw);
}