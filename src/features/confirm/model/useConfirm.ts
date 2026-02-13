import { ElMessageBox } from "element-plus";
import { type ConfirmPayload } from "./types";

export function useConfirm() {
  return async (p: ConfirmPayload): Promise<boolean> => {
    try {
      await ElMessageBox.confirm(p.message, p.title, {
        confirmButtonText: p.confirmText ?? "OK",
        cancelButtonText: p.cancelText ?? "Отмена",
        type: p.danger ? "warning" : "info",
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: true
      });
      return true;
    } catch {
      return false;
    }
  };
}