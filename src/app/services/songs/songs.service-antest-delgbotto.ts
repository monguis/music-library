import { Injectable } from '@angular/core';
import { SongModel, SongDto, FilterOptions, PaginationInfo } from '../../models';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FilterSongPipe, SortSongsPipe } from '../../pipes';
import { SearchHandler } from '../search-handler';

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
    perPage: 5,
  };

  public loading$ = new BehaviorSubject<boolean>(false);
  public songsList$ = new BehaviorSubject<SongModel[]>(this.allSongs);

  constructor(private http: HttpClient) {}

  get getPaginationInfo() {
    return { ...this.paginationInfo, totalItems: this.filteredSortedSongs.length };
  }

  addSongToLocalList(newSong: SongModel) {
    const newList = [...this.allSongs, newSong];
    this.allSongs = newList;
    this.filterLocalList();
  }

  syncPaginationWithFilteredList() {
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

  // Pagination Logic

  updatePagination(newPagination: PaginationInfo) {
    const constructedPageInfo = {
      ...this.paginationInfo,
      ...newPagination,
    };

    const total = this.filteredSortedSongs.length;
    const perPage = constructedPageInfo.perPage!;

    const lastPage = total <= perPage ? 0 : Math.ceil(total / perPage) - 1;

    this.paginationInfo = { ...constructedPageInfo, lastPage };

    this.syncPaginationWithFilteredList();
  }

  goToPage(page: number) {
    if (!this.canGoToPage(page)) return;
    this.updatePagination({ page });
  }

  setPerPageSize(perPage: number) {
    this.updatePagination({ page: 0, perPage });
  }

  canGoToPage(newPage: number) {
    const { lastPage, page } = this.paginationInfo;
    return newPage !== page && newPage >= 0 && newPage <= lastPage!;
  }

  updateLocalList(id: string, newSong: SongModel) {
    const newList = this.allSongs.map(song => (song.id === id ? newSong : song));
    this.allSongs = newList;
    this.filterLocalList();
  }

  filterLocalList(filterOptions?: FilterOptions<SongModel>) {
    let queryFiltered: SongModel[] = [];
    let dateFiltered: SongModel[] = [];
    let sorted: SongModel[] = [];
    if (!filterOptions) {
      this.filteredSortedSongs = this.allSongs;
      this.updatePagination({ page: 0 });
      return;
    }

    const { searchQuery, searchBy, from, until, sortby, sortingDesc } = filterOptions;

    if (searchQuery && searchBy) {
      const search = new SearchHandler<SongModel>();
      queryFiltered = search.runSearch(this.allSongs, searchQuery, searchBy);
    } else {
      queryFiltered = this.allSongs;
    }

    if (from || until) {
      const filterPipe = new FilterSongPipe();
      dateFiltered = filterPipe.transform(queryFiltered, from, until);
    } else {
      dateFiltered = queryFiltered;
    }

    if (sortingDesc || sortby) {
      const sortPipe = new SortSongsPipe();
      sorted = sortPipe.transform(dateFiltered, sortby, sortingDesc);
    } else {
      sorted = dateFiltered;
    }

    this.filteredSortedSongs = sorted;
    this.updatePagination({ page: 0 });
  }
}
