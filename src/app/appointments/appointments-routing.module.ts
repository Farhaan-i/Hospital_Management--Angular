import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';

const routes: Routes = [
  { path: '', component: AppointmentListComponent },
  { path: 'book', component: AppointmentBookingComponent },
  {
    path: ':id',
    children: [
      { path: 'edit', component: AppointmentBookingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }