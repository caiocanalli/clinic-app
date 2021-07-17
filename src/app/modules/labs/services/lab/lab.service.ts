import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { FilterRequest } from './requests/filter-request.model';
import { UpdateRequest } from './requests/update-request.model';
import { FilterResponse } from './responses/filter-response.model';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  constructor(private httpClient: HttpClient) { }

  register(request: any): Observable<any> {
    return this.httpClient.post(`${environment.baseApiUrl}/api/lab/register`, request).pipe(
      retry(1)
    );
  }

  filter(request: FilterRequest): Observable<FilterResponse> {
    const params: any = request;
    return this.httpClient.get<FilterResponse>(`${environment.baseApiUrl}/api/lab/filter`, { params }).pipe(
      retry(1)
    );
  }

  recoverById(id: number): Observable<any> {
    return this.httpClient.get(`${environment.baseApiUrl}/api/lab/${id}`).pipe(
      retry(1)
    );
  }

  activate(id: number): Observable<any> {
    return this.httpClient.put(`${environment.baseApiUrl}/api/lab/activate/${id}`, null).pipe(
      retry(1)
    );
  }

  inactivate(id: number): Observable<any> {
    return this.httpClient.put(`${environment.baseApiUrl}/api/lab/inactivate/${id}`, null).pipe(
      retry(1)
    );
  }

  update(request: UpdateRequest): Observable<any> {
    return this.httpClient.put(`${environment.baseApiUrl}/api/lab/update`, request).pipe(
      retry(1)
    );
  }
}
