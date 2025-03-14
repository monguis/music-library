import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterOptions } from '../../../models/sorting-options';
import { TitleCasePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SongModel } from '../../../models/song';
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
  @Output() public apply = new EventEmitter<FilterOptions<SongModel>>();
  @Output() public clear = new EventEmitter<null>();
  @ViewChild('inputForm') form!: NgForm;

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
    this.apply.emit(filterOptions);
  }

  handleClear() {
    if (this.isFormEmpty(this.form)) return;
    this.form.reset();
    this.clear.emit();
  }

  isFormEmpty(form: NgForm): boolean {
    return Object.values(form.value).every(value => value === '' || value == null);
  }
}
