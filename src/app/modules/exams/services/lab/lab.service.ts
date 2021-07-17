import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { FilterRequest } from './requests/filter-request.model';
import { FilterResponse } from './responses/filter-response.model';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  constructor(private httpClient: HttpClient) { }

  filter(request: FilterRequest): Observable<FilterResponse> {
    const params: any = request;
    return this.httpClient.get<FilterResponse>(`${environment.baseApiUrl}/api/lab/filter`, { params }).pipe(
      retry(1)
    );
  }
}
