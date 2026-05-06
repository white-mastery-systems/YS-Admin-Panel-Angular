export interface NotifierOptions {
  message?: string;
  style?: string;
  time?: number;
}

export interface ConfirmNotifierOptions extends NotifierOptions {
  title?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export interface PromptNotifierOptions extends NotifierOptions {
  title?: string;
  placeholder?: string;
  onAccept?: (value?: string) => void;
  onReject?: () => void;
}

declare const Notifier: any;

export default Notifier;
