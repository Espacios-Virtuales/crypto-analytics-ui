import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development'; 
import { Observable } from 'rxjs';
import { ReadyResponse } from '../models/ready.model';


@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  /** GET tipado simple */
  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
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

  private toParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    for (const [k, v] of Object.entries(params)) {
      httpParams = httpParams.set(k, String(v));
    }
    return httpParams;
  }

  ready() {
    return this.get<ReadyResponse>('/ready');
  }
}
