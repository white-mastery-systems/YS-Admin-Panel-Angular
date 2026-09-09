declare module 'codex-notifier' {
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

  const Notifier: any;
  export default Notifier;
}

declare module 'codex-tooltip' {
  export type TooltipContent = string | HTMLElement;

  export interface TooltipOptions {
    placement?: string;
    offset?: number;
    hidingDelay?: number;
  }

  const Tooltip: any;
  export default Tooltip;
}
