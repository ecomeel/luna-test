import isEqual from "lodash-es/isEqual";
import { toRaw } from "vue";

export function deepEqual(a: unknown, b: unknown): boolean {
  return isEqual(toRaw(a), toRaw(b));
}