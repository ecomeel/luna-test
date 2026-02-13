export interface Hotkey {
  match: (e: KeyboardEvent) => boolean;
  handler: () => void;
};
