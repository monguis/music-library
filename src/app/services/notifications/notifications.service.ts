import { Injectable } from '@angular/core';

export const enum MessageStatus {
  ERROR,
  WARNING,
  SUCCESS,
}

export interface NotificationMessage {
  status: MessageStatus;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() {}

  pushNotification(notification: NotificationMessage) {
    console.log(`status: ${notification.status} message: ${notification.message}`);
  }
}
