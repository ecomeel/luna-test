import cloneDeepWith from "lodash-es/cloneDeepWith";
import { isProxy, toRaw } from "vue";

export function deepClone<T>(value: T): T {
  return cloneDeepWith(value, (val) => {
    if (isProxy(val)) {
      return cloneDeepWith(toRaw(val));
    }
  }) as T;
}