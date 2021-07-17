import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ExamRoutingModule } from './exam-routing.module';

import { ManageLabComponent } from './components/manage-lab/manage-lab.component';
import { SearchLabComponent } from './components/search-lab/search-lab.component';

import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { UpdateComponent } from './pages/update/update.component';

@NgModule({
  declarations: [
    HomeComponent,
    RegisterComponent,
    UpdateComponent,
    ManageLabComponent,
    SearchLabComponent
  ],
  imports: [
    SharedModule,
    ExamRoutingModule
  ]
})
export class ExamModule { }
