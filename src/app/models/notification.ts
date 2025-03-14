export interface NotificationMessage {
  status: MessageStatus;
  message: string;
  title: string;
}

export const enum MessageStatus {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
}
