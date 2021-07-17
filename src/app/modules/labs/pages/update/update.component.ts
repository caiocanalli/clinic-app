import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EMPTY } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { UpdateRequest } from '../../services/lab/requests/update-request.model';
import { RecoverByIdResponse } from '../../services/lab/responses/recover-by-id-response.model';

import { LabService } from '../../services/lab/lab.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control('', [Validators.required]),
    name: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    address: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)])
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private labService: LabService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe((value: Params) => {
      const id: number = +value['id'];
      if (!id) {
        alert('Laboratório inválido.');
        this.router.navigate(['/lab/home']);
      }
      this.recoverById(id);
    });
  }

  updateClick(): void {
    const request: UpdateRequest = {
      id: this.form.value.id,
      name: this.form.value.name,
      address: this.form.value.address
    };
    this.labService.update(request).pipe(
      take(1),
      tap(() => {
        alert('Laboratório atualizado com sucesso.');
        this.router.navigate(['/lab/home']);
      }),
      catchError(() => {
        alert('Não foi possível atualizar o laboratório.');
        return EMPTY;
      })
    ).subscribe();
  }

  private recoverById(id: number): void {
    this.labService.recoverById(id).pipe(
      take(1),
      tap((response: RecoverByIdResponse) => {
        this.form.setValue({
          id: response.id,
          name: response.name,
          address: response.address
        });
      }),
      catchError(() => {
        alert('Laboratório não encontrado.');
        this.router.navigate(['/lab/home']);
        return EMPTY;
      })
    ).subscribe();
  }
}
