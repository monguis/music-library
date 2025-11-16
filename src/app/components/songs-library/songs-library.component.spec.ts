import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongsLibraryComponent } from './songs-library.component';
import { SongsService } from '../../services/songs/songs.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SongModel, FilterOptions } from '../../models';

describe('SongsLibraryComponent', () => {
  let component: SongsLibraryComponent;
  let fixture: ComponentFixture<SongsLibraryComponent>;
  let songsServiceMock: jasmine.SpyObj<SongsService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationsService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let routerMock: jasmine.SpyObj<Router>;

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
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SongsLibraryComponent],
      providers: [
        { provide: SongsService, useValue: songsServiceMock },
        { provide: NotificationsService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SongsLibraryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On init behavior', () => {
    it('should call load songs when successfull on ngOnInit', () => {
      songsServiceMock.getAllSongs.and.returnValue(of([]));

      const testSong = new SongModel({
        id: '1',
        title: 'Test Song',
        release_date: '01-01-2020',
        price: 5,
        artist: 'Test artist',
      });

      component.songList$ = songsServiceMock.songsList$;
      component.loadSongs();

      expect(songsServiceMock.getAllSongs).toHaveBeenCalled();
      expect(component.songList$).toBe(songsServiceMock.songsList$);
    });

    it('should handle errors when fetching songs', () => {
      const errorResponse = { message: 'Error fetching songs' };
      songsServiceMock.getAllSongs.and.returnValue(throwError(errorResponse));

      component.songList$ = songsServiceMock.songsList$;
      component.loadSongs();

      expect(notificationServiceMock.pushErrorAlert).toHaveBeenCalledWith(
        `Songs list could not be fetched: ${errorResponse.message}`
      );
    });

    it('should open confirmation dialog on delete', () => {
      songsServiceMock.deleteSong.and.returnValue(of());
      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefMock.afterClosed.and.returnValue(of('confirm'));
      dialogMock.open.and.returnValue(dialogRefMock);
      component.onDelete('1');

      const dialogArgs = dialogMock.open.calls.mostRecent().args;
      expect(dialogArgs[0]).toBe(ConfirmationDialogComponent);
      expect(dialogArgs[1]).toEqual({
        data: {
          title: 'You are about to delete a Song.',
          message: 'Do you want to continue?',
        },
      });
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
      component.onDelete('1');

      dialogRefMock.afterClosed().subscribe(() => {
        expect(handleDeleteSpy).toHaveBeenCalledWith('1');
      });
    });

    it('should call deleteSong and removeSongFromLocalList on successful deletion', () => {
      const testId = '1';
      const testSong = new SongModel({
        id: testId,
        title: 'Test Song',
        release_date: '01-01-2020',
        price: 5,
        artist: 'Test artist',
      });

      songsServiceMock.deleteSong.and.returnValue(of(testSong));
      component.handleModalDeleteConfirm(testId);
      expect(songsServiceMock.deleteSong).toHaveBeenCalledWith(testId);
      expect(songsServiceMock.removeSongFromLocalList).toHaveBeenCalledWith(testId);
    });

    it('should call pushErrorAlert if deleteSong fails', () => {
      const songId = '1';
      const errorMessage = 'Error occurred';

      songsServiceMock.deleteSong.and.returnValue(throwError({ message: errorMessage }));
      component.handleModalDeleteConfirm(songId);
      expect(songsServiceMock.deleteSong).toHaveBeenCalledWith(songId);
      expect(notificationServiceMock.pushErrorAlert).toHaveBeenCalledWith(
        `Song ID: ${songId} could not be deleted: ${errorMessage}`
      );
    });
  });

  describe('on update behavior', () => {
    it('navigates to song update page on onUpdate', () => {
      const testId = '1';
      const testSong = new SongModel({
        id: testId,
        title: 'Test Song',
        release_date: '01-01-2020',
        price: 5,
        artist: 'Test artist',
      });

      songsServiceMock.getSong.and.returnValue(of(testSong));

      component.onUpdate('1');

      expect(songsServiceMock.getSong).toHaveBeenCalledWith(testId);
      expect(songsServiceMock.setSongForEdit).toHaveBeenCalledWith(testSong);
      expect(routerMock.navigate).toHaveBeenCalledWith(['update', testId]);
    });

    it('handles error in onUpdate', () => {
      const errorResponse = { message: 'Error fetching song' };
      songsServiceMock.getSong.and.returnValue(throwError(errorResponse));
      component.onUpdate('1');
      expect(notificationServiceMock.pushErrorAlert).toHaveBeenCalledWith(
        `Song ID: 1 could not be found in server: ${errorResponse.message}`
      );
    });
  });

  // describe('on list option updates behavior', () => {
  //   it('applies filters and show success message', () => {
  //     const filterOptions = { sortBy: 'name', order: 'asc' } as FilterOptions<SongModel>;
  //     component.onApplyFilters(filterOptions);

  //     expect(component.filterOptions).toEqual(filterOptions);
  //     expect(notificationServiceMock.pushSuccessAlert).toHaveBeenCalledWith(
  //       'List options have been applied'
  //     );
  //   });
  // });
});
