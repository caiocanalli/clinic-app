import { NgModule } from '@angular/core';

import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { UpdateComponent } from './pages/update/update.component';

import { SharedModule } from '../../shared/shared.module';
import { LabRoutingModule } from './lab-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    RegisterComponent,
    UpdateComponent
  ],
  imports: [
    SharedModule,
    LabRoutingModule
  ]
})
export class LabModule { }
