import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { catchError, take, tap } from 'rxjs/operators';

import { LabService } from '../../services/lab/lab.service';

import { Lab } from '../../models/lab.model';
import { FilterRequest } from '../../services/lab/requests/filter-request.model';
import { FilterResponse } from '../../services/lab/responses/filter-response.model';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-search-lab',
  templateUrl: './search-lab.component.html',
  styleUrls: ['./search-lab.component.css']
})
export class SearchLabComponent {

  @Output() labsSelected = new EventEmitter<Lab[]>();

  page = 1;
  pageSize = 10;
  hasMore = false;

  labs: Lab[] = [];
  selected = false;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control(''),
    name: this.formBuilder.control('')
  });

  constructor(
    private labService: LabService,
    private formBuilder: FormBuilder) { }

  completeClick(): void {
    const labs: Lab[] = this.labs.filter(x => x.selected);
    if (labs.length > 5) {
      alert('Selecione no máximo 5 laboratórios');
      return;
    }
    if (labs.length > 0) {
      this.labsSelected.emit(labs);
    }
    this.labs = [];
    this.page = 1;
    this.hasMore = false;
    this.selected = false;
    this.form.reset();
  }

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
      status: 1
    };
    this.recoverLab(request);
  }

  moreClick(): void {
    this.page++;
    const request: FilterRequest = {
      page: this.page,
      pageSize: this.pageSize,
      id: +this.form.value.id,
      name: this.form.value.name,
      status: 1
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

  completeEnabled(): boolean {
    return this.labs.filter(lab => lab.selected)?.length <= 5;
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

  private fromFilterResponse(response: FilterResponse): Lab[] {
    return response.labs.map((x) => {
      const lab = new Lab();
      lab.id = x.id;
      lab.name = x.name;
      lab.address = x.address;
      lab.statusLabel = x.status === 1 ? 'Ativo' : 'Inativo';
      return lab;
    });
  }
}

