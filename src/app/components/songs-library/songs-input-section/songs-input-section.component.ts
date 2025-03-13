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
  @Input({ required: true }) public sortFields!: { title: string; value: string }[];
  @Output() public apply = new EventEmitter<FilterOptions>();

  public from?: string;
  public until?: string;
  public selectedSortField?: string;
  public isSortingDesc: boolean = false;

  public filterOptions: FilterOptions = {
    from: this.from,
    until: this.until,
    sortby: this.selectedSortField,
    sortingDesc: this.isSortingDesc,
  };

  emitApply() {
    const filterOptions: FilterOptions = {
      from: this.from,
      until: this.until,
      sortby: this.selectedSortField,
      sortingDesc: this.isSortingDesc,
    };
    console.log(filterOptions);
    this.apply.emit(filterOptions);
  }
}
