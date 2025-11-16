import { TestBed } from '@angular/core/testing';
import { SongsService } from './songs.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SongModel } from '../../models';
import { provideHttpClient } from '@angular/common/http';

describe('SongsService', () => {
  let songService: SongsService;
  let httpMock: HttpTestingController;
  const MOCK_LIST = [
    new SongModel({
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      release_date: '2019-11-29',
      price: 12,
    }),
    new SongModel({
      id: '2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      release_date: '2017-01-06',
      price: 15,
    }),
    new SongModel({
      id: '3',
      title: 'Levitating',
      artist: 'Dua Lipa',
      release_date: '2020-03-27',
      price: 13,
    }),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SongsService, provideHttpClient(), provideHttpClientTesting()],
    });

    songService = TestBed.inject(SongsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('create an instance', () => {
    expect(songService).toBeTruthy();
  });

  describe('internal state', () => {
    it('should add a new song to the list', () => {
      const newSong = MOCK_LIST[0];

      const spy = spyOn(songService.songsList$, 'next').and.callThrough();

      songService.addSongToLocalList(newSong);

      expect(spy).toHaveBeenCalledWith([newSong]);
      expect(songService.songsList$.getValue()).toEqual([newSong]);
    });

    it('should update an existing song in the list', () => {
      const initialSong = MOCK_LIST[0];
      songService.addSongToLocalList(initialSong);

      const updatedSong = new SongModel({
        id: '1',
        title: 'Updated Song',
        artist: 'Artist 1',
        release_date: '2024-02-01',
        price: 12,
      });

      const spy = spyOn(songService.songsList$, 'next').and.callThrough();

      songService.updateLocalList('1', updatedSong);

      expect(songService.songsList$.getValue()).toEqual([updatedSong]);
      expect(spy).toHaveBeenCalledWith([updatedSong]);
    });

    it('should remove a song from the list', () => {
      const initialSong = new SongModel({
        id: '1',
        title: 'Song 1',
        artist: 'Artist 1',
        release_date: '2024-01-01',
        price: 10,
      });
      songService.addSongToLocalList(initialSong);

      const spy = spyOn(songService.songsList$, 'next').and.callThrough();

      songService.removeSongFromLocalList('1');

      expect(songService.songsList$.getValue()).toEqual([]);
      expect(spy).toHaveBeenCalledWith([]);
    });
  });

  it('fetches songs from the API and converts the dtos to models', () => {
    songService.getAllSongs().subscribe(songs => {
      expect(songs.length).toBe(3);
      expect(songs[0].title).toBe('Blinding Lights');
      expect(songs[1].title).toBe('Shape of You');
      expect(songs[2].title).toBe('Levitating');
      expect(songs[0] instanceof SongModel).toBeTrue();
      expect(songs[1] instanceof SongModel).toBeTrue();
      expect(songs[2] instanceof SongModel).toBeTrue();
    });

    const req = httpMock.expectOne(songService['songsApiURL']);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_LIST);
  });
});
