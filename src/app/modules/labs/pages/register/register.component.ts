import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, take, tap } from 'rxjs/operators';

import { RegisterRequest } from '../../services/lab/requests/register-request.model';

import { LabService } from '../../services/lab/lab.service';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    address: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)])
  });

  constructor(
    private labService: LabService,
    private formBuilder: FormBuilder) { }

  registerClick(): void {
    const request: RegisterRequest = {
      name: this.form.value.name,
      address: this.form.value.address
    };
    this.labService.register(request).pipe(
      take(1),
      tap(() => {
        this.form.reset();
        alert('Laboratório cadastrado com sucesso.');
      }),
      catchError(() => {
        alert('Não foi possível cadastrar o laboratório.');
        return EMPTY;
      })
    ).subscribe();
  }
}

