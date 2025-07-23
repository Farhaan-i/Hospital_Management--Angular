import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Slot } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-slot-dialog',
  templateUrl: './slot-dialog.component.html',
  styleUrls: ['./slot-dialog.component.scss']
})
export class SlotDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { slots: Slot[], doctorName: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
