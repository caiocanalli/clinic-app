import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { FilterRequest } from './requests/filter-request.model';
import { RegisterRequest } from './requests/register-request.model';
import { UpdateRequest } from './requests/update-request.model';
import { FilterResponse } from './responses/filter-response.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private httpClient: HttpClient) { }

  register(request: RegisterRequest): Observable<any> {
    return this.httpClient.post(`${environment.baseApiUrl}/api/exam/register`, request).pipe(
      retry(1)
    );
  }

  filter(request: FilterRequest | null): Observable<FilterResponse> {
    const params: any = request;
    return this.httpClient.get<FilterResponse>(`${environment.baseApiUrl}/api/exam/filter`, { params: params }).pipe(
      retry(1)
    );
  }

  recoverById(id: number): Observable<any> {
    return this.httpClient.get(`${environment.baseApiUrl}/api/exam/${id}`).pipe(
      retry(1)
    );
  }

  activate(id: number): Observable<any> {
    return this.httpClient.put(`${environment.baseApiUrl}/api/exam/activate/${id}`, null).pipe(
      retry(1)
    );
  }

  inactivate(id: number): Observable<any> {
    return this.httpClient.put(`${environment.baseApiUrl}/api/exam/inactivate/${id}`, null).pipe(
      retry(1)
    );
  }

  update(request: UpdateRequest): Observable<any> {
    return this.httpClient.put(`${environment.baseApiUrl}/api/exam/update`, request).pipe(
      retry(1)
    );
  }
}
