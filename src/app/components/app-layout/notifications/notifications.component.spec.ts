import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MessageStatus, NotificationMessage } from '../../../models/notification';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', [
      'notifications$',
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      providers: [
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    notificationsService = TestBed.inject(
      NotificationsService
    ) as jasmine.SpyObj<NotificationsService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.notificationSub) {
      component.notificationSub.unsubscribe();
    }
  });

  describe('ngOnInit', () => {
    it('should subscribe to notifications service and call toastr on receiving notification', () => {
      const mockNotification: NotificationMessage = {
        status: MessageStatus.SUCCESS,
        message: 'Test Message',
        title: 'Test Title',
      };

      notificationsService.notifications$.next(mockNotification);

      expect(toastr.success).toHaveBeenCalledWith(mockNotification.message, mockNotification.title);
    });

    it('should handle different notification statuses', () => {
      const mockInfoNotification = {
        status: MessageStatus.INFO,
        message: 'Information',
        title: 'Info Title',
      };
      const mockWarningNotification = {
        status: MessageStatus.WARNING,
        message: 'Warning',
        title: 'Warning Title',
      };
      const mockErrorNotification = {
        status: MessageStatus.ERROR,
        message: 'Error occurred',
        title: 'Error Title',
      };

      notificationsService.notifications$.next(mockWarningNotification);
      expect(toastr.warning).toHaveBeenCalledWith(
        mockWarningNotification.message,
        mockWarningNotification.title
      );

      notificationsService.notifications$.next(mockErrorNotification);
      expect(toastr.error).toHaveBeenCalledWith(
        mockErrorNotification.message,
        mockErrorNotification.title
      );

      notificationsService.notifications$.next(mockInfoNotification);
      expect(toastr.info).toHaveBeenCalledWith(
        mockErrorNotification.message,
        mockErrorNotification.title
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from the notifications service', () => {
      const unsubscribeSpy = spyOn(component.notificationSub!, 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
