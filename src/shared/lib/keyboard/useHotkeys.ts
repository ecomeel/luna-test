import { onBeforeUnmount, onMounted } from "vue";
import { type Hotkey } from "./types";

export function useHotkeys(hotkeys: Hotkey[]) {
  const onKeydown = (e: KeyboardEvent) => {
    for (const hk of hotkeys) {
      if (hk.match(e)) {
        e.preventDefault();
        hk.handler();
        return;
      }
    }
  };

  onMounted(() => window.addEventListener("keydown", onKeydown));
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
}