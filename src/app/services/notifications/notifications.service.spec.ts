import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { MessageStatus, NotificationMessage } from '../../models';
import { Subject } from 'rxjs';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationsSubject: Subject<NotificationMessage>;

  beforeEach(() => {
    notificationsSubject = new Subject<NotificationMessage>();

    TestBed.configureTestingModule({
      providers: [NotificationsService, { provide: Subject, useValue: notificationsSubject }],
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pushes error alert with correct message and title', done => {
    const message = 'An error occurred';
    const expectedNotification: NotificationMessage = {
      status: MessageStatus.ERROR,
      message,
      title: 'Something went wrong',
    };

    service.notifications$.subscribe(notification => {
      expect(notification).toEqual(expectedNotification);
      done();
    });

    service.pushErrorAlert(message);
  });

  it('pushes warning alert with correct message and title', done => {
    const message = 'This is a warning';
    const expectedNotification: NotificationMessage = {
      status: MessageStatus.WARNING,
      message,
      title: 'Warning',
    };

    service.notifications$.subscribe(notification => {
      expect(notification).toEqual(expectedNotification);
      done();
    });

    service.pushWarningAlert(message);
  });

  it('pushes success alert with correct message and title', done => {
    const message = 'Operation was successful';
    const expectedNotification: NotificationMessage = {
      status: MessageStatus.SUCCESS,
      message,
      title: 'Success',
    };

    service.notifications$.subscribe(notification => {
      expect(notification).toEqual(expectedNotification);
      done();
    });

    service.pushSuccessAlert(message);
  });
});
