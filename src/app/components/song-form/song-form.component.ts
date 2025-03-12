import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { SongModel } from '../../models/song';

type songFormMode = 'create' | 'update';
export function validDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null; // Ignore empty values (handled by 'required')

  // Ensure the value is a valid Date instance or a valid date string
  const date = new Date(control.value);

  // Check if it's an invalid date
  if (isNaN(date.getTime())) {
    return { invalidDate: true };
  }

  return null; // No errors
}
@Component({
  selector: 'app-song-form',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './song-form.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent implements OnInit {
  public songForm!: FormGroup;
  public mode: songFormMode = 'create';
  public currentSong?: SongModel;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.url[0].path === 'update') {
      this.mode = 'update';
    }

    this.songForm = this.fb.group({
      title: [this.mode === 'update' ? this.currentSong?.title : '', [Validators.required, Validators.maxLength(25)]],
      artist: [this.mode === 'update' ? this.currentSong?.artist : '', [Validators.required, Validators.maxLength(25)]],
      releaseDate: [this.mode === 'update' ? this.currentSong?.releaseDate : '', [Validators.required, validDateValidator]],
      price: [this.mode === 'update' ? this.currentSong?.price : 0, [Validators.required, Validators.min(0.01)]],
    });
  }

  isFieldValid(fieldName: string) {
    const control = this.songForm.get(fieldName);
    return !control?.dirty && !control?.invalid && control?.touched;
  }

  getTextFieldErrorMessage(fieldName: string) {
    const control = this.songForm.get(fieldName);
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('maxlength')) return `Maximum length is ${control.errors?.['maxlength'].requiredLength}.`;
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
    if (control?.errors?.['matDatepickerParse']) return `${control?.errors?.['matDatepickerParse']?.text} is not a valid date.`;
    if (control?.hasError('required')) return 'This field is required.';
    return '';
  }

  submitForm() {
    console.log(this.songForm.value);
  }
}
