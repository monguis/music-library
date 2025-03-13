import { Injectable } from '@angular/core';
import { MessageStatus, NotificationMessage } from '../../models/notification';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public notifications$ = new Subject<NotificationMessage>();

  pushErrorAlert(message: string) {
    this.notifications$.next({
      status: MessageStatus.ERROR,
      message,
      title: 'Something went wrong',
    });
  }

  pushWarningAlert(message: string) {
    this.notifications$.next({
      status: MessageStatus.WARNING,
      message,
      title: 'Warning',
    });
  }

  pushSuccessAlert(message: string) {
    this.notifications$.next({
      status: MessageStatus.SUCCESS,
      message,
      title: 'Success',
    });
  }
}
