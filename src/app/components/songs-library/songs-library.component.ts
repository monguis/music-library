import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { Song } from '../../models/model';
import { SongCardComponent } from './song-card/song-card.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FilterSongPipe } from '../../pipes/filtersong.pipe';

interface FilterOptions {
  from?: string;
  until?: string;
}

@Component({
  selector: 'app-songs-library',
  imports: [SongCardComponent, RouterModule, FilterSongPipe],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit, OnDestroy {
  public songList: Song[] = [];
  public sortTiles: string[] = [];
  public filterOptions: FilterOptions = {};
  private songsSubscription?: Subscription;
  private paramsSubcription?: Subscription;

  constructor(
    private songsService: SongsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.songsSubscription = this.songsService.songList$.subscribe(newList => {
      if (newList?.length > 0) {
        this.songList = newList;
        this.sortTiles = Object.keys(this.songList[0]);
      }
    });
    this.songsService.getAllSongs();

    this.paramsSubcription = this.route.queryParams.subscribe(params => {
      this.filterOptions = {
        from: params['filter-from'],
        until: params['filter-until'],
      };
    });
  }

  ngOnDestroy(): void {
    this.songsSubscription?.unsubscribe();
    this.paramsSubcription?.unsubscribe();
  }
}
