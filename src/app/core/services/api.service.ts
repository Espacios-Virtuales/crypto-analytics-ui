import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ReadyResponse } from '../models/ready.model';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  /** GET tipado simple */
  get<T, P extends object = QueryParams>(path: string, params?: P): Observable<T> {
    const url = this.url(path);
    const httpParams = this.toParams(params);
    return this.http.get<T>(url, { params: httpParams });
  }

  /** HEAD (útil para health simple) */
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

    for (const [k, v] of Object.entries(params)) {
      if (v === null || v === undefined) continue;
      httpParams = httpParams.set(k, String(v));
    }

    return httpParams;
  }

  ready(): Observable<ReadyResponse> {
    return this.get<ReadyResponse>('/ready');
  }
}