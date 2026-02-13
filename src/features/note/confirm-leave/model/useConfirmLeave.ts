import { useConfirm } from "~/features/confirm/model/useConfirm";
import type { Options } from "./types";

export function useConfirmLeave(opts: Options) {
  const confirm = useConfirm();

  return async (action: () => unknown | Promise<unknown>) => {
    if (!opts.hasChanges.value) {
      await action();
      return true;
    }

    const ok = await confirm({
      title: opts.title ?? "Выйти без сохранения?",
      message: opts.message ?? "Несохранённые изменения будут потеряны.",
      confirmText: "Выйти",
      cancelText: "Остаться",
      danger: true
    });

    if (!ok) return false;

    await action();
    return true;
  };
}