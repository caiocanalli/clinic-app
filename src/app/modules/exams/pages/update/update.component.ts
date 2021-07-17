import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EMPTY } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { ManageLabComponent } from '../../components/manage-lab/manage-lab.component';

import { ExamService } from '../../services/exam/exam.service';

import { Lab } from '../../models/lab.model';
import { RecoverById } from '../../services/exam/responses/recover-by-id.model';
import { UpdateRequest } from '../../services/exam/requests/update-request.model';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  registeredLabs: Lab[] = [];
  @ViewChild(ManageLabComponent) manageLab?: ManageLabComponent;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control('', [Validators.required]),
    name: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    type: this.formBuilder.control('', [Validators.required]),
    labs: this.formBuilder.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(5)])
  });

  get labs(): FormArray {
    return this.form.controls['labs'] as FormArray;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe((value: Params) => {
      const id: number = +value['id'];
      if (!id) {
        alert('Exame inválido.');
        this.router.navigate(['/exam/home']);
      }
      this.recoverById(id);
    });
  }

  labsSelectedEmit(labs: Lab[]): void {
    this.labs.clear();
    labs.forEach((lab: Lab) => {
      this.labs.push(new FormControl(lab, Validators.required));
    });
  }

  updateClick(): void {
    const labs: Lab[] = this.form.value.labs;
    const labIds = labs.map(x => x.id);
    const request: UpdateRequest = {
      id: +this.form.value.id,
      name: this.form.value.name,
      type: +this.form.value.type,
      labIds: labIds
    };
    this.examService.update(request).pipe(
      take(1),
      tap(() => {
        alert('Exame atualizado com sucesso.');
        this.router.navigate(['/exam/home']);
      }),
      catchError(() => {
        alert('Não foi possível atualizar o exame.');
        return EMPTY;
      })
    ).subscribe();
  }

  private recoverById(id: number): void {
    this.examService.recoverById(id).pipe(
      take(1),
      tap((response: RecoverById) => {
        this.registeredLabs = response.labs.map(x => {
          const lab: Lab = {
            id: x.id,
            name: x.name,
            address: x.address,
            status: x.status,
            statusLabel: '',
            selected: false
          };
          return lab;
        });
        response.labs.forEach(lab =>
          this.labs.push(new FormControl(lab, Validators.required)))
        this.form.patchValue({
          id: response.id,
          name: response.name,
          type: response.type
        });
      }),
      catchError(() => {
        alert('Exame não encontrado.');
        this.router.navigate(['/lab/home']);
        return EMPTY;
      })
    ).subscribe();
  }
}
