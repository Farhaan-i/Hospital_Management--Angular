import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { StaffRoutingModule } from './staff-routing.module';

@NgModule({
  declarations: [
    StaffListComponent,
    StaffFormComponent,
    StaffDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    StaffRoutingModule
  ]
})
export class StaffModule { }
