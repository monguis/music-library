import { TestBed } from '@angular/core/testing';
import { SongsService } from './songs.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageStatus, NotificationsService } from '../notifications/notifications.service';
import { SongModel } from '../../models/song';
import { provideHttpClient } from '@angular/common/http';

describe('SongsService', () => {
  let songService: SongsService;
  let httpMock: HttpTestingController;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  const MOCK_LIST = [
    new SongModel({ id: '1', title: 'Blinding Lights', artist: 'The Weeknd', release_date: '2019-11-29', price: 12 }),
    new SongModel({ id: '2', title: 'Shape of You', artist: 'Ed Sheeran', release_date: '2017-01-06', price: 15 }),
    new SongModel({ id: '3', title: 'Levitating', artist: 'Dua Lipa', release_date: '2020-03-27', price: 13 }),
  ];

  beforeEach(() => {
    const notificationsSpy = jasmine.createSpyObj('NotificationsService', ['pushNotification']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [SongsService, { provide: NotificationsService, useValue: notificationsSpy }, provideHttpClient(), provideHttpClientTesting()],
    });

    songService = TestBed.inject(SongsService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationsService = TestBed.inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('create an instance', () => {
    expect(songService).toBeTruthy();
  });

  it('fetches songs from the API if force reload is required', () => {
    songService.getAllSongs().subscribe(songs => {
      expect(songService['songList'].length).toBe(3);
      expect(songService['songList'][0].title).toBe('Blinding Lights');
      expect(songService['songList'][1].title).toBe('Shape of You');
      expect(songService['songList'][2].title).toBe('Levitating');
      expect(songService['songList'][0] instanceof SongModel).toBeTrue();
    });

    const req = httpMock.expectOne(songService['songsApiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_LIST);
  });

  it('creates a new song', () => {
    const songDto = { ...SongModel.toDto(MOCK_LIST[0]), id: undefined };

    songService.addSong(songDto).subscribe(() =>
      songService.songsList$.subscribe(list => {
        expect(list.length).toBe(1);
        expect(list[0].title).toBe(songDto.title);
      })
    );

    const req = httpMock.expectOne(songService['songsApiURL']);
    expect(req.request.method).toBe('POST');
    req.flush(songDto);
  });

  it('updates an existing song', () => {
    const songDto = SongModel.toDto(MOCK_LIST[0]);
    const newTitle = 'la cucaracha';
    const updatedSong = { ...songDto, title: newTitle };

    songService['songList'] = [MOCK_LIST[0]];

    songService.updateSong('1', updatedSong).subscribe(() =>
      songService.songsList$.subscribe(list => {
        expect(list.length).toBe(1);
        expect(list[0].title).toBe(newTitle);
      })
    );

    const req = httpMock.expectOne(`${songService['songsApiURL']}/${songDto.id!}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSong);
  });

  it('deletes a song by id', () => {
    const idToDelete = '1';
    const songToDelete = MOCK_LIST[0];

    songService['songList'] = [songToDelete];

    songService.deleteSong(idToDelete).subscribe(() =>
      songService.songsList$.subscribe(list => {
        expect(list.length).toBe(0);
        expect(songService['songList'].length).toBe(0);
      })
    );

    const req = httpMock.expectOne(`${songService['songsApiURL']}/${idToDelete}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(songToDelete);
  });

  it('handles 404s errors and pushes the correct notification', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const errorMessage = 'Content not found';

    songService.getAllSongs().subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(notificationsService.pushNotification).toHaveBeenCalledWith({
          message: errorMessage,
          status: MessageStatus.ERROR,
        });
      },
    });

    const req = httpMock.expectOne(songService['songsApiURL']);
    req.flush('Not Found', errorResponse);
  });

  it('handles 500 errors and pushes the correct notification', () => {
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };
    const errorMessage = 'Internal server error';

    // Simulate a failed HTTP request
    songService.getAllSongs().subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(notificationsService.pushNotification).toHaveBeenCalledWith({
          message: errorMessage,
          status: MessageStatus.ERROR,
        });
      },
    });

    const req = httpMock.expectOne(songService['songsApiURL']);
    req.flush('Internal Server Error', errorResponse);
  });

  it('handles unknown errors and pushes the correct notification', () => {
    const errorResponse = { status: 400, statusText: 'Bad Request' };
    const errorMessage = 'Unknown server error';

    // Simulate a failed HTTP request
    songService.getAllSongs().subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(notificationsService.pushNotification).toHaveBeenCalledWith({
          message: errorMessage,
          status: MessageStatus.ERROR,
        });
      },
    });

    const req = httpMock.expectOne(songService['songsApiURL']);
    expect(req.request.method).toBe('GET');
    req.flush('Bad Request', errorResponse);
  });
});
