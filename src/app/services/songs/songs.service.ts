import { Injectable } from '@angular/core';
import { SongModel, SongDto } from '../../models/song';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageStatus, NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private songsApiURL = environment.songsApiUrl + '/songs';
  private songList: SongModel[] = [];
  public songsList$ = new BehaviorSubject<SongModel[]>(this.songList);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {}

  private httpErrorHandler = (error: any) => {
    let message = 'Unknown server error';
    switch (error.status) {
      case 404:
        message = 'Content not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }
    this.notificationService.pushNotification({
      message,
      status: MessageStatus.ERROR,
    });
    return throwError(() => error);
  };

  getAllSongs(): Observable<void> {
    return this.http.get<SongDto[]>(this.songsApiURL).pipe(
      map(songDtos => {
        const newSongList = songDtos.map(dto => new SongModel(dto));
        this.songsList$.next(newSongList);
        this.songList = newSongList;
      }),
      catchError(this.httpErrorHandler)
    );
  }

  addSong(song: SongDto): Observable<SongModel> {
    return this.http.post<SongDto>(this.songsApiURL, song).pipe(
      map(songDto => new SongModel(songDto)),
      catchError(this.httpErrorHandler),
      tap(newSong => {
        this.songList = [...this.songList, newSong];
        this.songsList$.next(this.songList);
      })
    );
  }

  updateSong(id: string, song: SongDto): Observable<SongModel> {
    return this.http.put<SongDto>(`${this.songsApiURL}/${id}`, song).pipe(
      map(songDto => new SongModel(songDto)),
      catchError(this.httpErrorHandler),
      tap(newSong => {
        this.songList = this.songList.map(song => (song.id === id ? newSong : song));
        this.songsList$.next(this.songList);
      })
    );
  }

  deleteSong(id: string): Observable<void> {
    return this.http.delete<void>(`${this.songsApiURL}/${id}`).pipe(
      catchError(this.httpErrorHandler),
      tap(() => {
        this.songList = this.songList.filter(song => song.id !== id);
        this.songsList$.next(this.songList);
      })
    );
  }
}
