import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ReadyResponse } from '../models/ready.model';

type QueryValue = string | number | boolean | null | undefined;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: object): Observable<T> {
    const url = this.url(path);
    const httpParams = this.toParams(params);
    return this.http.get<T>(url, { params: httpParams });
  }

  head(path: string): Observable<HttpResponse<unknown>> {
    const url = this.url(path);
    return this.http.head(url, { observe: 'response' });
  }

  private url(path: string): string {
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${clean}`;
  }

  private toParams(params?: object): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    for (const [k, v] of Object.entries(params as Record<string, QueryValue>)) {
      if (v === null || v === undefined || v === '') continue;
      httpParams = httpParams.set(k, String(v));
    }

    return httpParams;
  }

  ready(): Observable<ReadyResponse> {
    return this.get<ReadyResponse>('/ready');
  }
}
