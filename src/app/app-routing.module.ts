import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderEntryComponent } from './order-entry/order-entry.component';

const routes: Routes = [
  { path: '', redirectTo: '/order-entry', pathMatch: 'full' },
  { path: 'order-entry', component: OrderEntryComponent },
  { path: '**', redirectTo: '/order-entry' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
