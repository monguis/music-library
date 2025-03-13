import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  public sortFields = [
    { title: 'Title', value: 'title' },
    { title: 'Artist', value: 'Artist' },
    { title: 'Release Date', value: 'Release Date' },
    { title: 'ID', value: 'ID' },
    { title: 'Price', value: 'Price' },
  ];

  public from?: string;
  public until?: string;
  public selectedSortField?: string;
  public isSortingDesc: boolean = false;

  emitApply() {
    const filterOptions: FilterOptions<SongModel> = {
      from: this.from,
      until: this.until,
      sortby: this.selectedSortField as keyof SongModel,
      sortingDesc: this.isSortingDesc,
    };
    this.apply.emit(filterOptions);
  }

  handleClear() {
    this.from = '';
    this.until = '';
    this.selectedSortField = '';
    this.isSortingDesc = false;
    this.apply.emit({});
  }
}
