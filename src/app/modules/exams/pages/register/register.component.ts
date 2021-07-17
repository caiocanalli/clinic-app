import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EMPTY } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { ManageLabComponent } from '../../components/manage-lab/manage-lab.component';

import { ExamService } from '../../services/exam/exam.service';

import { Lab } from '../../models/lab.model';
import { RegisterRequest } from '../../services/exam/requests/register-request.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  @ViewChild(ManageLabComponent) manageLab?: ManageLabComponent;

  form: FormGroup = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
    type: this.formBuilder.control('', [Validators.required]),
    labs: this.formBuilder.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(5)])
  });

  get labs(): FormArray {
    return this.form.controls['labs'] as FormArray;
  }

  constructor(
    private examService: ExamService,
    private formBuilder: FormBuilder) { }

  labsSelectedEmit(labs: Lab[]): void {
    this.labs.clear();
    labs.forEach((lab: Lab) => {
      this.labs.push(new FormControl(lab, Validators.required));
    });
  }

  registerClick(): void {
    const labs: Lab[] = this.form.value.labs;
    const labIds = labs.map(x => x.id);
    const request: RegisterRequest = {
      name: this.form.value.name,
      type: +this.form.value.type,
      labIds: labIds
    };
    this.examService.register(request).pipe(
      take(1),
      tap(() => {
        this.form.reset();
        this.manageLab?.reset();
        alert('Exame cadastrado com sucesso.');
      }),
      catchError(() => {
        alert('Não foi possível cadastrar o exame.');
        return EMPTY;
      })
    ).subscribe();
  }
}
