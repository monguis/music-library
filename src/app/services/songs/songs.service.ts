import { Injectable } from '@angular/core';
import { SongModel, SongDto } from '../../models/song';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageStatus, NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private songsApiURL = environment.songsApiUrl + '/songs';
  private shouldForceReloadAllSongs = true;
  private songList: SongModel[] = [];

  get getforceReloadAllSongs() {
    return this.shouldForceReloadAllSongs;
  }

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {}

  public songList$ = new BehaviorSubject<SongModel[]>([]);

  public setForceReloadAllSongs(val: boolean) {
    this.shouldForceReloadAllSongs = val;
  }

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

  getAllSongs(): Observable<SongModel[]> {
    if (!this.getforceReloadAllSongs) {
      return of(this.songList);
    } else {
      return this.http.get<SongDto[]>(this.songsApiURL).pipe(
        map(songDtos => {
          return songDtos.map(dto => new SongModel(dto));
        }),
        catchError(this.httpErrorHandler)
      );
    }
  }

  createSong(song: SongDto): Observable<SongModel> {
    return this.http.post<SongDto>(this.songsApiURL, song).pipe(
      map(songDto => new SongModel(songDto)),
      catchError(this.httpErrorHandler)
    );
  }

  updateSong(id: string, song: SongDto): Observable<SongModel> {
    return this.http.put<SongDto>(`${this.songsApiURL}/${id}`, song).pipe(
      map(songDto => new SongModel(songDto)),
      catchError(this.httpErrorHandler)
    );
  }

  getSong(id: string): Observable<SongModel> {
    return this.http.get<SongDto>(`${this.songsApiURL}/${id}`).pipe(
      map(songDto => new SongModel(songDto)),
      catchError(this.httpErrorHandler)
    );
  }

  deleteSong(id: string): Observable<void> {
    return this.http.delete<void>(`${this.songsApiURL}/${id}`).pipe(catchError(this.httpErrorHandler));
  }
}
