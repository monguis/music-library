import { Component, inject, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'baf-confirmation-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }
}
