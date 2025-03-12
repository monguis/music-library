import { Injectable } from '@angular/core';
import { SongModel, SongDto } from '../../models/song';
import { BehaviorSubject, catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageStatus, NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private songsApiURL = environment.songsApiUrl + '/songs';
  private songList: SongModel[] = [];
  private songToUpdate?: SongModel;
  public loading$ = new BehaviorSubject<boolean>(false);
  public songsList$ = new BehaviorSubject<SongModel[]>(this.songList);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {}

  assingSongsToList(newSongs: SongModel[]) {
    this.songList = newSongs;
    this.songsList$.next(newSongs);
  }

  addSongToLocalList(newSong: SongModel) {
    const newList = [...this.songList, newSong];
    this.songList = newList;
    this.songsList$.next(newList);
  }

  updateLocalList(id: string, newSong: SongModel) {
    const newList = this.songList.map(song => (song.id === id ? newSong : song));
    this.songList = newList;
    this.songsList$.next(newList);
  }

  removeSongFromLocalList(id: string) {
    const newList = this.songList.filter(song => song.id !== id);
    this.songList = newList;
    this.songsList$.next(newList);
  }

  getSongToUpdate() {
    return this.songToUpdate ? new SongModel(SongModel.toDto(this.songToUpdate)) : null;
  }

  getAllSongs(): Observable<SongModel[]> {
    this.loading$.next(true);
    return this.http.get<SongDto[]>(this.songsApiURL).pipe(
      map(songDtos => songDtos.map(dto => new SongModel(dto))),
      finalize(() => this.loading$.next(false))
    );
  }

  setSongForEdit(song: SongModel) {
    this.songToUpdate = song;
  }

  getSong(id: string): Observable<SongModel> {
    this.loading$.next(true);
    return this.http.get<SongDto>(`${this.songsApiURL}/${id}`).pipe(
      map(songDto => new SongModel(songDto)),
      finalize(() => this.loading$.next(false))
    );
  }

  addSong(song: SongDto): Observable<SongModel> {
    this.loading$.next(true);
    return this.http.post<SongDto>(this.songsApiURL, song).pipe(
      map(songDto => new SongModel(songDto)),
      finalize(() => this.loading$.next(false))
    );
  }

  updateSong(id: string, song: SongDto): Observable<SongModel> {
    this.loading$.next(true);
    return this.http.put<SongDto>(`${this.songsApiURL}/${id}`, song).pipe(
      map(songDto => new SongModel(songDto)),
      finalize(() => this.loading$.next(false))
    );
  }

  deleteSong(id: string): Observable<void> {
    this.loading$.next(true);
    return this.http.delete<void>(`${this.songsApiURL}/${id}`).pipe(finalize(() => this.loading$.next(false)));
  }
}
