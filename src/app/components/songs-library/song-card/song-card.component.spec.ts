import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongCardComponent } from './song-card.component';
import { SongModel } from '../../../models/song';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { SongsService } from '../../../services/songs/songs.service';

describe('SongCardComponent', () => {
  let component: SongCardComponent;
  let fixture: ComponentFixture<SongCardComponent>;
  let songsServiceMock: jasmine.SpyObj<SongsService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationsService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let routerMock: jasmine.SpyObj<Router>;
  let deleteSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;

  const mockSong: SongModel = {
    id: '123',
    title: 'Test Song',
    artist: 'Test Artist',
    releaseDate: new Date('01-01-2015'),
    price: 5,
  } as SongModel;

  beforeEach(() => {
    songsServiceMock = jasmine.createSpyObj('SongsService', [
      'getAllSongs',
      'assingSongsToList',
      'deleteSong',
      'removeSongFromLocalList',
      'getSong',
      'setSongForEdit',
      'songsList$',
    ]);
    notificationServiceMock = jasmine.createSpyObj('NotificationsService', [
      'pushErrorAlert',
      'pushSuccessAlert',
      'pushWarningAlert',
    ]);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogMock.open.and.returnValue({
      afterClosed: () => of('confirm'),
    } as any as MatDialogRef<any>);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SongCardComponent],
      providers: [
        DatePipe,
        CurrencyPipe,
        { provide: SongsService, useValue: songsServiceMock },
        { provide: NotificationsService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SongCardComponent);
    component = fixture.componentInstance;
    component.song = mockSong;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  describe('UI', () => {
    beforeEach(() => {
      deleteSpy = spyOn(component, 'handleDelete');
      updateSpy = spyOn(component, 'handleUpdate');
    });
    it('emits delete event with song id when handleDelete is clicked', () => {
      component.handleDelete();
      expect(deleteSpy).toHaveBeenCalledWith();
    });

    it('emits update event with song id when handleUpdate is called', () => {
      component.handleUpdate();
      expect(updateSpy).toHaveBeenCalledWith();
    });

    it('binds song properties to the component', () => {
      expect(component.song).toEqual(mockSong);
    });

    it('renders the values correcty', () => {
      const titleField = fixture.nativeElement.querySelector(`[data-test-id="title"]`);
      const artistField = fixture.nativeElement.querySelector(`[data-test-id="artist"]`);
      const releaseDateField = fixture.nativeElement.querySelector(`[data-test-id="releaseDate"]`);
      const idField = fixture.nativeElement.querySelector(`[data-test-id="id"]`);
      const priceField = fixture.nativeElement.querySelector(`[data-test-id="price"]`);

      expect(titleField?.textContent?.trim()).toBe(`Title: ${mockSong.title}`);
      expect(artistField?.textContent?.trim()).toBe(`Artist: ${mockSong.artist}`);
      expect(releaseDateField?.textContent?.trim()).toBe(`Released in: Jan 1, 2015`);
      expect(idField?.textContent?.trim()).toBe(`ID: ${mockSong.id}`);
      expect(priceField?.textContent?.trim()).toBe('Price: $5.00');
    });

    it('calls handleDelete when delete button is clicked', () => {
      const deleteButton = fixture.nativeElement.querySelector('[data-test-id="delete-button"]');
      deleteButton.click();
      expect(deleteSpy).toHaveBeenCalledWith();
    });

    it('calls handleUpdate when update button is clicked', () => {
      const updateButton = fixture.nativeElement.querySelector('[data-test-id="update-button"]');
      updateButton.click();
      expect(updateSpy).toHaveBeenCalledWith();
    });
  });

  describe('on delete behavior', () => {
    it('calls handleModalDeleteConfirm on delete modal confirmation', () => {
      const errorResponse = { message: 'Error deleting song' };
      const handleDeleteSpy = spyOn(component, 'handleModalDeleteConfirm').and.callThrough();
      songsServiceMock.deleteSong.and.returnValue(throwError(errorResponse));
      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefMock.afterClosed.and.returnValue(of('confirm'));
      dialogMock.open.and.returnValue(dialogRefMock);
      component.handleDelete();
      dialogRefMock.afterClosed().subscribe(() => {
        expect(handleDeleteSpy).toHaveBeenCalledWith();
      });
    });
    it('should call deleteSong and removeSongFromLocalList on successful deletion', () => {
      songsServiceMock.deleteSong.and.returnValue(of(mockSong));
      component.handleModalDeleteConfirm();
      expect(songsServiceMock.deleteSong).toHaveBeenCalledWith(mockSong.id!);
      expect(songsServiceMock.removeSongFromLocalList).toHaveBeenCalledWith(mockSong.id!);
    });
    it('should call pushErrorAlert if deleteSong fails', () => {
      const errorMessage = 'Error occurred';
      songsServiceMock.deleteSong.and.returnValue(throwError({ message: errorMessage }));
      component.handleModalDeleteConfirm();
      expect(songsServiceMock.deleteSong).toHaveBeenCalledWith(mockSong.id!);
      expect(notificationServiceMock.pushErrorAlert).toHaveBeenCalledWith(
        `Song ID: ${mockSong.id} could not be deleted: ${errorMessage}`
      );
    });
    it('should open confirmation dialog on delete', () => {
      songsServiceMock.deleteSong.and.returnValue(of());
      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefMock.afterClosed.and.returnValue(of('confirm'));
      dialogMock.open.and.returnValue(dialogRefMock);
      component.handleDelete();
      const dialogArgs = dialogMock.open.calls.mostRecent().args;
      expect(dialogArgs[0]).toBe(ConfirmationDialogComponent);
      expect(dialogArgs[1]).toEqual({
        data: {
          title: 'You are about to delete a Song.',
          message: `Do you want to delete ${mockSong.title}?`,
        },
      });
    });
  });

  describe('on update behavior', () => {
    it('navigates to song update page on handleUpdate', () => {
      const testId = mockSong.id!;
      songsServiceMock.getSong.and.returnValue(of(mockSong));
      component.handleUpdate();
      expect(songsServiceMock.getSong).toHaveBeenCalledWith(testId);
      expect(songsServiceMock.setSongForEdit).toHaveBeenCalledWith(mockSong);
      expect(routerMock.navigate).toHaveBeenCalledWith(['update', testId]);
    });
    it('handles error in onUpdate', () => {
      const errorResponse = { message: 'Error fetching song' };
      songsServiceMock.getSong.and.returnValue(throwError(errorResponse));
      component.handleUpdate();
      expect(notificationServiceMock.pushErrorAlert).toHaveBeenCalledWith(
        `Song ID: 123 could not be found in server: ${errorResponse.message}`
      );
    });
  });
});
