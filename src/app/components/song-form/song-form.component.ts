import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-song-form',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './song-form.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent {}
