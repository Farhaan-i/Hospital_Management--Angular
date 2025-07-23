import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';

const routes: Routes = [
  { path: '', component: StaffListComponent },
  { path: 'new', component: StaffFormComponent },
  { path: 'edit/:id', component: StaffFormComponent },
  { path: ':id', component: StaffDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }