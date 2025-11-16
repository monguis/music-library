import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsInputSectionComponent } from './songs-input-section.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SongsService } from '../../../services/songs/songs.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';

describe('SongsInputSectionComponent', () => {
  let component: SongsInputSectionComponent;
  let fixture: ComponentFixture<SongsInputSectionComponent>;
  let songsServiceMock: jasmine.SpyObj<SongsService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    notificationServiceMock = jasmine.createSpyObj('NotificationsService', [
      'pushErrorAlert',
      'pushSuccessAlert',
      'pushWarningAlert',
    ]);

    songsServiceMock = jasmine.createSpyObj('SongsService', ['filterLocalList']);
    await TestBed.configureTestingModule({
      imports: [SongsInputSectionComponent],
      providers: [
        { provide: NotificationsService, useValue: notificationServiceMock },
        { provide: SongsService, useValue: songsServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SongsInputSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
