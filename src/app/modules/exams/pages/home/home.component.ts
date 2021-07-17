import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EMPTY } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { ExamService } from '../../services/exam/exam.service';

import { Exam } from './models/exam.model';
import { FilterRequest } from '../../services/exam/requests/filter-request.model';
import { FilterResponse } from '../../services/exam/responses/filter-response.model';

import { ExamStatus } from 'src/app/shared/enums/exam-status.enum';
import { ExamType } from 'src/app/shared/enums/exam-type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  page = 1;
  pageSize = 10;
  hasMore = false;

  exams: Exam[] = [];
  selected = false;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control(''),
    name: this.formBuilder.control(''),
    type: this.formBuilder.control('0'),
    status: this.formBuilder.control('1')
  });

  constructor(
    private router: Router,
    private examService: ExamService,
    private formBuilder: FormBuilder) { }

  searchClick(): void {
    this.exams = [];
    this.page = 1;
    this.hasMore = false;
    this.selected = false;
    const request: FilterRequest = {
      page: this.page,
      pageSize: this.pageSize,
      id: +this.form.value.id,
      name: this.form.value.name,
      type: this.form.value.type,
      status: this.form.value.status
    };
    this.recoverExam(request);
  }

  editExamClick(): void {
    const exam: Exam | undefined = this.exams.find(x => x.selected);
    if (exam) {
      this.router.navigate(['/exam/update', exam.id]);
    }
  }

  setStatusClick(): void {
    const exam: Exam | undefined = this.exams.find(x => x.selected);
    if (exam) {
      exam.status === ExamStatus.inactive ?
        this.activate(exam.id) :
        this.inactivate(exam.id);
    }
  }

  moreClick(): void {
    this.page++;
    const request: FilterRequest = {
      page: this.page,
      pageSize: this.pageSize,
      id: +this.form.value.id,
      name: this.form.value.name,
      type: this.form.value.type,
      status: this.form.value.status
    };
    this.recoverExam(request);
  }

  selectExam(index: number): void {
    this.exams[index].selected = !this.exams[index].selected;
    this.selected = this.exams.every(x => x.selected);
  }

  selectExams(event: any): void {
    if (event.target.checked) {
      this.selected = true;
      this.exams.forEach(x => x.selected = true);
    } else {
      this.selected = false;
      this.exams.forEach(x => x.selected = false);
    }
  }

  editEnabled(): boolean {
    return this.exams.filter(x => x.selected).length === 1;
  }

  private recoverExam(request: FilterRequest): void {
    this.examService.filter(request).pipe(
      take(1),
      tap((response: FilterResponse) => {
        this.hasMore = !(response.pageCount === 0 ||
          response.pageCount === response.currentPage);
        if (response.pageCount === 0) {
          alert('Nenhum exame encontrado.');
        } else {
          this.exams = this.exams.concat(this.fromFilterResponse(response));
          this.selected = this.exams.every(x => x.selected);
        }
      }),
      catchError(() => {
        alert('Não foi possível buscar os exames.');
        return EMPTY;
      })
    ).subscribe();
  }

  private activate(id: number): void {
    const index: number = this.exams.findIndex(x => x.id === id);
    if (index > -1) {
      const exam: Exam = this.exams[index];
      this.examService.activate(exam.id).pipe(
        take(1),
        tap(() => {
          this.exams[index].status = ExamStatus.active;
          this.exams[index].statusLabel = 'Ativo';
        }),
        catchError(() => {
          alert('Não foi possível ativar o exame.');
          return EMPTY;
        })
      ).subscribe();
    }
  }

  private inactivate(id: number): void {
    const index: number = this.exams.findIndex(x => x.id === id);
    if (index > -1) {
      const exam: Exam = this.exams[index];
      this.examService.inactivate(exam.id).pipe(
        take(1),
        tap(() => {
          this.exams[index].status = ExamStatus.inactive;
          this.exams[index].statusLabel = 'Inativo';
        }),
        catchError(() => {
          alert('Não foi possível inativar o exame.');
          return EMPTY;
        })
      ).subscribe();
    }
  }

  private fromFilterResponse(response: FilterResponse): Exam[] {
    return response.exams.map((x) => {
      const exam = new Exam();
      exam.id = x.id;
      exam.name = x.name;
      exam.type = x.type;
      exam.typeLabel = x.type === ExamType.clinicalAnalysis ? 'Análises clínicas' : 'Imagem';
      exam.status = x.status;
      exam.statusLabel = x.status === ExamStatus.active ? 'Ativo' : 'Inativo';
      exam.selected = false;
      exam.labs = x.labs?.map(y => {
        const lab = new Exam();
        lab.id = y.id;
        lab.name = y.name;
        return lab;
      });
      return exam;
    });
  }
}
