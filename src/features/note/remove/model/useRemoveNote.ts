import { useNotesStore } from "~/entities/note/model/notes.store";
import { useConfirm } from "~/features/confirm/model/useConfirm";

export function useRemoveNote() {
  const store = useNotesStore();
  const confirm = useConfirm();

  return async (id: string) => {
    const ok = await confirm({
      title: "Удалить заметку?",
      message: "Заметка будет удалена без возможности восстановления.",
      confirmText: "Удалить",
      cancelText: "Отмена",
      danger: true
    });

    if (!ok) return false;

    store.removeNote(id);
    return true;
  };
}