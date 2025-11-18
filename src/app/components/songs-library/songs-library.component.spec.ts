import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongsLibraryComponent } from './songs-library.component';
import { SongsService } from '../../services/songs/songs.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SongModel } from '../../models/song';
import { FilterOptions } from '../../models/sorting-options';

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
  });

  describe('on list option updates behavior', () => {
    it('applies filters and show success message', () => {
      const filterOptions = { sortBy: 'name', order: 'asc' } as FilterOptions<SongModel>;
      component.onApplyFilters(filterOptions);

      expect(component.filterOptions).toEqual(filterOptions);
      expect(notificationServiceMock.pushSuccessAlert).toHaveBeenCalledWith(
        'List options have been applied'
      );
    });

    it('clears filters and show warning message', () => {
      component.onClearFilters();

      expect(component.filterOptions).toEqual({});
      expect(notificationServiceMock.pushWarningAlert).toHaveBeenCalledWith('List has been reset');
    });
  });
});
