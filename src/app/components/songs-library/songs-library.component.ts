import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { SongModel } from '../../models/song';
import { SongCardComponent } from './song-card/song-card.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FilterSongPipe } from '../../pipes/filter-songs.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MessageStatus, NotificationsService } from '../../services/notifications/notifications.service';
import { SortGenericPipe } from '../../pipes/sort-songs.pipe';

interface FilterOptions {
  from?: string;
  until?: string;
}

@Component({
  selector: 'app-songs-library',
  imports: [SongCardComponent, RouterModule, FilterSongPipe, SortGenericPipe],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit, OnDestroy {
  public songList: SongModel[] = [];
  public sortTiles: string[] = [];
  public filterOptions: FilterOptions = {};
  private paramsSubcription?: Subscription;
  private songsSubcription?: Subscription;

  constructor(
    private songsService: SongsService,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.songsSubcription = this.songsService.songsList$.subscribe(newList => {
      if (newList?.length > 0) {
        this.songList = newList;
        this.sortTiles = Object.keys(this.songList[0]);
      }
    });

    this.paramsSubcription = this.route.queryParams.subscribe(params => {
      this.filterOptions = {
        from: params['filter-from'],
        until: params['filter-until'],
      };
    });

    this.songsService.getAllSongs().subscribe(songs => {
      this.songsService.assingSongsToList(songs);
    });
  }

  ngOnDestroy(): void {
    this.paramsSubcription?.unsubscribe();
    this.songsSubcription?.unsubscribe();
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'You are bout to delete a Song.',
        message: 'Do you want to continue?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.songsService.deleteSong(id).subscribe(() => {
          this.songsService.removeSongFromLocalList(id);
          this.notificationService.pushNotification({
            status: MessageStatus.SUCCESS,
            message: `Song ID: ${id} has been deleted successfully`,
          });
        });
      }
    });
  }

  onUpdate(id: string) {
    this.songsService.getSong(id).subscribe(song => {
      this.songsService.setSongForEdit(song);

      this.router.navigate(['update', id]);
    });
  }
}
