import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MessageStatus, NotificationMessage } from '../../../models/notification';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let notificationsSubject: Subject<NotificationMessage>;

  beforeEach(async () => {
    notificationsSubject = new Subject<NotificationMessage>();

    const notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', [], {
      notifications$: notificationsSubject.asObservable(),
    });

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'warning',
      'info',
    ]);

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
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
    component.notificationSub?.unsubscribe();
  });

  describe('ngOnInit', () => {
    it('should subscribe to notifications$ and invoke toastr with correct method', () => {
      const mockNotification: NotificationMessage = {
        status: MessageStatus.SUCCESS, // Should match the toastr method name
        message: 'Test notification message',
        title: 'Test Notification Title',
      };

      notificationsSubject.next(mockNotification); // Simulate a new notification

      expect(toastr.success).toHaveBeenCalledWith(mockNotification.message, mockNotification.title);
    });

    it('should correctly handle different notification statuses', () => {
      const testCases: NotificationMessage[] = [
        { status: MessageStatus.SUCCESS, message: 'Success Message', title: 'Success' },
        { status: MessageStatus.ERROR, message: 'Error Message', title: 'Error' },
        { status: MessageStatus.WARNING, message: 'Warning Message', title: 'Warning' },
        { status: MessageStatus.INFO, message: 'Info Message', title: 'Info' },
      ];

      testCases.forEach(mockNotification => {
        notificationsSubject.next(mockNotification);
        expect(toastr[mockNotification.status]).toHaveBeenCalledWith(
          mockNotification.message,
          mockNotification.title
        );
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from notifications$ when destroyed', () => {
      spyOn(component.notificationSub!, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.notificationSub!.unsubscribe).toHaveBeenCalled();
    });
  });
});
