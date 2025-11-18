import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { SongsInputSectionComponent, SongsListComponent } from '@app/components/songs-library';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterOptions, SongModel } from '@app/models';
import { SongsService, NotificationsService } from '@app/services';

@Component({
  selector: 'app-songs-library',
  imports: [
    RouterModule,
    SongsListComponent,
    AsyncPipe,
    SongsInputSectionComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit {
  public songList$?: BehaviorSubject<SongModel[]>;
  public loadingList$?: BehaviorSubject<boolean>;
  public sortTiles: string[] = [];
  public filterOptions: any = {};

  constructor(
    private songsService: SongsService,
    private notificationService: NotificationsService,
    private readonly dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.songList$ = this.songsService.songsList$;
    this.loadingList$ = this.songsService.loading$;
    this.loadSongs();
  }

  loadSongs() {
    this.songsService.getAllSongs().subscribe({
      next: songs => {
        this.songsService.assingSongsToList(songs);
      },
      error: err => {
        this.notificationService.pushErrorAlert(
          `Songs list could not be fetched: ${err?.message ?? 'Unknown error'}`
        );
      },
    });
  }

  onApplyFilters(event: FilterOptions<SongModel>) {
    this.filterOptions = event;
    this.notificationService.pushSuccessAlert('List options have been applied');
  }

  onClearFilters() {
    this.filterOptions = {};
    this.notificationService.pushWarningAlert('List has been reset');
  }
}
