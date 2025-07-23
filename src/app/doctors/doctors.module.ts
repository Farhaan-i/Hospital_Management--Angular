import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MaterialModule } from '../shared/material.module';
import { DoctorsRoutingModule } from './doctors-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { SlotManagementComponent } from './slot-management/slot-management.component';
import { SlotDialogComponent } from './doctor-list/slot-dialog/slot-dialog.component';

/**
 * Doctors Module - Contains all doctor-related components and routing
 */
@NgModule({
  declarations: [
    DoctorListComponent,
    DoctorFormComponent,
    SlotManagementComponent,
    SlotDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DoctorsRoutingModule
  ]
})
export class DoctorsModule {}
