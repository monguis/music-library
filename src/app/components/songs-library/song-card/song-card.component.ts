import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SongModel } from '../../../models/song';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SongsService } from '../../../services/songs/songs.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'article[songCard]',
  imports: [DatePipe, CurrencyPipe, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
})
export class SongCardComponent {
  @Input({ required: true }) public song!: SongModel;

  constructor(
    private songsService: SongsService,
    private notificationsService: NotificationsService,
    private readonly dialog: MatDialog,
    private router: Router
  ) {}

  handleDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `You are about to delete a Song.`,
        message: `Do you want to delete ${this.song.title}?`,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.handleModalDeleteConfirm();
      }
    });
  }

  handleModalDeleteConfirm() {
    const idToDelete = this.song.id!;
    this.songsService.deleteSong(idToDelete).subscribe({
      next: () => {
        this.songsService.removeSongFromLocalList(idToDelete);
        this.notificationsService.pushSuccessAlert(
          `Song ID: ${idToDelete} has been deleted successfully`
        );
      },
      error: err => {
        this.notificationsService.pushErrorAlert(
          `Song ID: ${idToDelete} could not be deleted: ${err?.message ?? 'Unknown error'}`
        );
      },
    });
  }

  handleUpdate() {
    const idToDelete = this.song.id!;
    this.songsService.getSong(idToDelete!).subscribe({
      next: song => {
        this.songsService.setSongForEdit(song);
        this.router.navigate(['update', idToDelete!]);
      },
      error: err => {
        this.notificationsService.pushErrorAlert(
          `Song ID: ${idToDelete!} could not be found in server: ${err?.message ?? 'Unknown error'}`
        );
      },
    });
  }
}
