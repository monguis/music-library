import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterOptions, SongModel } from '../../../models';
import { TitleCasePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SongsService } from '../../../services/songs/songs.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
@Component({
  selector: 'app-songs-input-section',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    TitleCasePipe,
    MatDatepickerModule,
  ],
  templateUrl: './songs-input-section.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './songs-input-section.component.scss',
})
export class SongsInputSectionComponent {
  @Output() public clear = new EventEmitter<null>();
  @ViewChild('inputForm') form!: NgForm;

  constructor(
    private songsService: SongsService,
    private notificationService: NotificationsService
  ) {}

  public sortFields: { title: string; value: keyof SongModel }[] = [
    { title: 'Title', value: 'title' },
    { title: 'Artist', value: 'artist' },
    { title: 'Release Date', value: 'releaseDate' },
    { title: 'ID', value: 'id' },
    { title: 'Price', value: 'price' },
  ];

  emitApply() {
    if (!this.form.valid) return;

    const { from, until, sortField, isSortingDesc } = this.form.value;

    const filterOptions: FilterOptions<SongModel> = {
      from: from,
      until: until,
      sortby: sortField as keyof SongModel,
      sortingDesc: isSortingDesc,
    };

    this.songsService.filterLocalList(filterOptions);
    this.notificationService.pushSuccessAlert('List options have been applied');
  }

  handleClear() {
    if (this.isFormEmpty(this.form)) return;
    this.form.reset();
    this.songsService.filterLocalList();
    this.notificationService.pushWarningAlert('List has been reset');
  }

  isFormEmpty(form: NgForm): boolean {
    return Object.values(form.value).every(value => value === '' || value == null);
  }
}
