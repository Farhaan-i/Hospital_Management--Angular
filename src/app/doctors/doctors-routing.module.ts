import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { SlotManagementComponent } from './slot-management/slot-management.component';

const routes: Routes = [
  { path: '', component: DoctorListComponent },
  { path: 'new', component: DoctorFormComponent },
  { path: 'edit/:id', component: DoctorFormComponent },
  { path: ':id', component: DoctorDetailsComponent },
  { path: ':id/slots', component: SlotManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }