import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EMPTY } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { LabService } from '../../services/lab/lab.service';

import { Lab } from './models/lab.model';
import { FilterRequest } from '../../services/lab/requests/filter-request.model';
import { FilterResponse } from '../../services/lab/responses/filter-response.model';

import { LabStatus } from 'src/app/shared/enums/lab-status.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  page = 1;
  pageSize = 10;
  hasMore = false;

  labs: Lab[] = [];
  selected = false;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control(''),
    name: this.formBuilder.control(''),
    status: this.formBuilder.control('0')
  });

  constructor(
    private router: Router,
    private labService: LabService,
    private formBuilder: FormBuilder) { }

  searchClick(): void {
    this.labs = [];
    this.page = 1;
    this.hasMore = false;
    this.selected = false;
    const request: FilterRequest = {
      page: this.page,
      pageSize: this.pageSize,
      id: +this.form.value.id,
      name: this.form.value.name,
      status: this.form.value.status
    };
    this.recoverLab(request);
  }

  editLabClick(): void {
    const lab: Lab | undefined = this.labs.find(x => x.selected);
    if (lab) {
      this.router.navigate(['/lab/update', lab.id]);
    }
  }

  setStatusClick(): void {
    const lab: Lab | undefined = this.labs.find(x => x.selected);
    if (lab) {
      lab.status === LabStatus.inactive ?
        this.activate(lab.id) :
        this.inactivate(lab.id);
    }
  }

  moreClick(): void {
    this.page++;
    const request: FilterRequest = {
      page: this.page,
      pageSize: this.pageSize,
      id: +this.form.value.id,
      name: this.form.value.name,
      status: this.form.value.status
    };
    this.recoverLab(request);
  }

  selectLab(index: number): void {
    this.labs[index].selected = !this.labs[index].selected;
    this.selected = this.labs.every(x => x.selected);
  }

  selectLabs(event: any): void {
    if (event.target.checked) {
      this.selected = true;
      this.labs.forEach(x => x.selected = true);
    } else {
      this.selected = false;
      this.labs.forEach(x => x.selected = false);
    }
  }

  editEnabled(): boolean {
    return this.labs.filter(x => x.selected).length === 1;
  }

  private recoverLab(request: FilterRequest): void {
    this.labService.filter(request).pipe(
      take(1),
      tap((response: FilterResponse) => {
        this.hasMore = !(response.pageCount === 0 ||
          response.pageCount === response.currentPage);
        if (response.pageCount === 0) {
          alert('Nenhum laboratório encontrado.');
        } else {
          this.labs = this.labs.concat(this.fromFilterResponse(response));
          this.selected = this.labs.every(x => x.selected);
        }
      }),
      catchError(() => {
        alert('Não foi possível buscar os laboratórios.');
        return EMPTY;
      })
    ).subscribe();
  }

  private activate(id: number): void {
    const index: number = this.labs.findIndex(x => x.id === id);
    if (index > -1) {
      const lab: Lab = this.labs[index];
      this.labService.activate(lab.id).pipe(
        take(1),
        tap(() => {
          this.labs[index].status = LabStatus.active;
          this.labs[index].statusLabel = 'Ativo';
        }),
        catchError(() => {
          alert('Não foi possível ativar o laboratório.');
          return EMPTY;
        })
      ).subscribe();
    }
  }

  private inactivate(id: number): void {
    const index: number = this.labs.findIndex(x => x.id === id);
    if (index > -1) {
      const lab: Lab = this.labs[index];
      this.labService.inactivate(lab.id).pipe(
        take(1),
        tap(() => {
          this.labs[index].status = LabStatus.inactive;
          this.labs[index].statusLabel = 'Inativo';
        }),
        catchError(() => {
          alert('Não foi possível inativar o laboratório.');
          return EMPTY;
        })
      ).subscribe();
    }
  }

  private fromFilterResponse(response: FilterResponse): Lab[] {
    return response.labs.map((x) => {
      const lab = new Lab();
      lab.id = x.id;
      lab.name = x.name;
      lab.address = x.address;
      lab.statusLabel = x.status === LabStatus.active ? 'Ativo' : 'Inativo';
      return lab;
    });
  }
}
