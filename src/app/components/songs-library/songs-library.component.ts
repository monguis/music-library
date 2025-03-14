import { Component, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { SongModel } from '../../models/song';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { SongsListComponent } from './songs-list/songs-list.component';
import { AsyncPipe } from '@angular/common';
import { SongsInputSectionComponent } from './songs-input-section/songs-input-section.component';
import { FilterOptions } from '../../models/sorting-options';

@Component({
  selector: 'app-songs-library',
  imports: [RouterModule, SongsListComponent, AsyncPipe, SongsInputSectionComponent],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit {
  public songList$?: BehaviorSubject<SongModel[]>;
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

  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'You are about to delete a Song.',
        message: 'Do you want to continue?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.handleModalDeleteConfirm(id);
      }
    });
  }

  handleModalDeleteConfirm(id: string) {
    this.songsService.deleteSong(id).subscribe({
      next: () => {
        this.songsService.removeSongFromLocalList(id);
        this.notificationService.pushSuccessAlert(`Song ID: ${id} has been deleted successfully`);
      },
      error: err => {
        this.notificationService.pushErrorAlert(
          `Song ID: ${id} could not be deleted: ${err?.message ?? 'Unknown error'}`
        );
      },
    });
  }

  onUpdate(id: string) {
    this.songsService.getSong(id).subscribe({
      next: song => {
        this.songsService.setSongForEdit(song);
        this.router.navigate(['update', id]);
      },
      error: err => {
        this.notificationService.pushErrorAlert(
          `Song ID: ${id} could not be found in server: ${err?.message ?? 'Unknown error'}`
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
