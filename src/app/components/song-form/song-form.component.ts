import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { SongDto, SongModel } from '../../models/song';
import { SongsService } from '../../services/songs/songs.service';
import {
  MessageStatus,
  NotificationsService,
} from '../../services/notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

type songFormMode = 'create' | 'update';

@Component({
  selector: 'app-song-form',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './song-form.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent implements OnInit, OnDestroy {
  public songForm!: FormGroup;
  public mode: songFormMode = 'create';
  public songSnapshot: SongModel | null = null;
  private currentSongId = '';

  constructor(
    private songsService: SongsService,
    private fb: FormBuilder,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.url[0].path === 'update') {
      this.mode = 'update';
      this.songSnapshot = this.songsService.getSongToUpdate();
      this.currentSongId = this.route.snapshot.url[1].path;

      if (!this.songSnapshot && !this.currentSongId) {
        this.notificationService.pushNotification({
          message: `Song could not be found`,
          status: MessageStatus.WARNING,
        });
        this.router.navigate(['/']);
      }
    }

    this.songForm = this.fb.group({
      title: [
        this.mode === 'update' ? this.songSnapshot?.title : '',
        [Validators.required, Validators.maxLength(25)],
      ],
      artist: [
        this.mode === 'update' ? this.songSnapshot?.artist : '',
        [Validators.required, Validators.maxLength(25)],
      ],
      releaseDate: [
        this.mode === 'update' ? this.songSnapshot?.releaseDate : '',
        [Validators.required],
      ],
      price: [
        this.mode === 'update' ? this.songSnapshot?.price : 0,
        [Validators.required, Validators.min(0.01)],
      ],
    });
  }

  ngOnDestroy() {
    this.songsService.setSongForEdit(null);
  }

  isFieldValid(fieldName: string) {
    const control = this.songForm.get(fieldName);
    return !control?.dirty && !control?.invalid && control?.touched;
  }

  getTextFieldErrorMessage(fieldName: string) {
    const control = this.songForm.get(fieldName);
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('maxlength'))
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength}.`;
    return '';
  }

  getPriceFieldErrorMessage() {
    const control = this.songForm.get('price');
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('min')) return `Value must be at least $${control.errors?.['min'].min}.`;
    return '';
  }

  getReleaseDateErrorMessage() {
    const control = this.songForm.get('releaseDate');
    if (control?.errors?.['matDatepickerParse'])
      return `${control?.errors?.['matDatepickerParse']?.text} is not a valid date.`;
    if (control?.hasError('required')) return 'This field is required.';
    return '';
  }

  getFormIsEqualToSnapshot() {
    const currentValues = {
      id: this.currentSongId,
      ...this.songForm.value,
    } as SongModel;

    return this.songSnapshot?.equals(currentValues);
  }

  isFormSubmitDisabled() {
    return !this.songForm.valid || this.getFormIsEqualToSnapshot();
  }

  onCancel() {
    if (this.mode !== 'update' || !this.songForm.valid) {
      this.router.navigate(['/']);
      return;
    }

    if (this.mode === 'update' && this.songForm.valid) {
      const isFormEqualToSnapshot = this.getFormIsEqualToSnapshot();

      if (isFormEqualToSnapshot) {
        this.router.navigate(['/']);
        return;
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Discarding changes',
          message: 'Do you want to continue?',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this.router.navigate(['/']);
        }
      });
    }
  }

  submitForm() {
    if (!this.songForm.valid) return;

    const songDtoToSend = {
      ...this.songForm.value,
      release_date: this.songForm.value.releaseDate.toISOString(),
    } as SongDto;

    if (this.mode === 'update') {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Udpate Song.',
          message: 'Do you want to continue?',
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this.songsService.updateSong(this.currentSongId, songDtoToSend).subscribe(newSong => {
            this.songsService.updateLocalList(this.currentSongId, newSong);
            this.notificationService.pushNotification({
              message: `Song ID: ${this.currentSongId} has been updated successfully`,
              status: MessageStatus.SUCCESS,
            });
            this.router.navigate(['/']);
          });
        }
      });

      return;
    }

    this.songsService.addSong(songDtoToSend).subscribe(newSong => {
      this.songsService.addSongToLocalList(newSong);
      this.notificationService.pushNotification({
        message: 'Song was added successfully',
        status: MessageStatus.SUCCESS,
      });
      this.router.navigate(['/']);
    });
  }
}
