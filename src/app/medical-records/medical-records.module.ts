import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordsRoutingModule } from './medical-records-routing.module';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MedicalHistoryComponent
  ],
  imports: [
    CommonModule,
    MedicalRecordsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MedicalRecordsModule { }
