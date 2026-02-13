import type { PiniaPluginContext } from "pinia";

type PersistOptions = {
  key: string;
};

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions;
  }
}

function persistPlugin({ store, options }: PiniaPluginContext) {
  const key = options.persist?.key;
  if (!key) return;

  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      store.$patch(JSON.parse(raw));
    } catch {
      console.log('fail with storage')
    }
  }

  store.$subscribe((_mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state));
  });
}

export default defineNuxtPlugin(() => {
  const pinia = usePinia();
  pinia.use(persistPlugin);
});