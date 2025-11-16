import { Injectable } from '@angular/core';
import { SongModel, SongDto, FilterOptions, PaginationInfo } from '../../models';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { filterByDate, sortedere } from '../../helpers';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private songsApiURL = environment.songsApiUrl + '/songs';
  private filteredSortedSongs: SongModel[] = [];
  private songToUpdate?: SongModel | null = null;
  private allSongs: SongModel[] = [];
  private paginationInfo: PaginationInfo = {
    page: 0,
    perPage: 25,
  };

  public loading$ = new BehaviorSubject<boolean>(false);
  public songsList$ = new BehaviorSubject<SongModel[]>(this.allSongs);

  constructor(private http: HttpClient) {
    this.songsList$.subscribe(t => console.log(t));
  }

  get getPaginationInfo() {
    return { ...this.paginationInfo };
  }

  addSongToLocalList(newSong: SongModel) {
    const newList = [...this.allSongs, newSong];
    this.allSongs = newList;
    this.filterLocalList();
  }

  updatePagination(newPagination: PaginationInfo) {
    const constructedPageInfo = {
      ...this.paginationInfo,
      ...newPagination,
    };
    const lastPage = Math.floor(this.filteredSortedSongs.length / constructedPageInfo.perPage!);

    this.paginationInfo = { ...constructedPageInfo, lastPage };

    this.handlePagination();
  }

  goToPage(page: number) {
    if (!this.canGoToPage(page)) return;
    this.updatePagination({ page });
  }

  setPerPageSize(perPage: number) {
    this.updatePagination({ page: 0, perPage });
  }

  canGoToPage(page: number) {
    const { lastPage } = this.paginationInfo;
    return page >= 0 && page <= lastPage!;
  }

  updateLocalList(id: string, newSong: SongModel) {
    const newList = this.allSongs.map(song => (song.id === id ? newSong : song));
    this.allSongs = newList;
    this.filterLocalList();
  }

  filterLocalList(filterOptions?: FilterOptions<SongModel>) {
    let dateFiltered: SongModel[] = [];
    if (!filterOptions) {
      this.filteredSortedSongs = this.allSongs;
      this.updatePagination({ page: 0 });
      return;
    }

    const { from, until, sortby, sortingDesc } = filterOptions;
    if (from || until) {
      dateFiltered = filterByDate(this.allSongs, from, until);
    } else {
      dateFiltered = this.allSongs.slice();
    }

    let sorted;
    if (sortingDesc || sortby) {
      sorted = sortedere(dateFiltered, sortby, sortingDesc);
    } else {
      sorted = dateFiltered;
    }

    this.filteredSortedSongs = sorted;
    this.updatePagination({ page: 0 });
  }

  handlePagination() {
    const pageOffset = this.paginationInfo.perPage! * this.paginationInfo.page!;

    this.songsList$.next(
      this.filteredSortedSongs.slice(pageOffset, pageOffset + this.paginationInfo.perPage!)
    );
  }

  removeSongFromLocalList(id: string) {
    const newList = this.allSongs.filter(song => song.id !== id);
    this.allSongs = newList;
    this.filterLocalList();
  }

  getSongToUpdate() {
    return this.songToUpdate ? new SongModel(SongModel.toDto(this.songToUpdate)) : null;
  }

  getAllSongs(): Observable<SongModel[]> {
    this.loading$.next(true);
    return this.http.get<SongDto[]>(this.songsApiURL).pipe(
      map(songDtos => songDtos.map(dto => new SongModel(dto))),
      tap(songs => {
        this.allSongs = songs;
        this.filteredSortedSongs = songs;
        this.updatePagination({ page: 0 });
        this.filterLocalList();
      }),
      finalize(() => this.loading$.next(false))
    );
  }

  setSongForEdit(song: SongModel | null) {
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

  deleteSong(id: string): Observable<SongModel> {
    this.loading$.next(true);
    return this.http.delete<SongDto>(`${this.songsApiURL}/${id}`).pipe(
      map(songDto => new SongModel(songDto)),
      finalize(() => this.loading$.next(false))
    );
  }
}
