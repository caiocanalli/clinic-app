import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'exam' },
  { path: 'exam', loadChildren: () => import('./modules/exams/exam.module').then(m => m.ExamModule) },
  { path: 'lab', loadChildren: () => import('./modules/labs/lab.module').then(m => m.LabModule) },
  { path: '**', pathMatch: 'full', redirectTo: 'exam' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
