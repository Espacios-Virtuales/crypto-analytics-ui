import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { Asset } from '../models/assets.model';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  constructor(private api: ApiService) {}

  list(): Observable<Asset[]> {
    return this.api.get<any>('/assets').pipe(
      map((res) => {
        // tolerante: array simple o {assets:[...]}
        if (Array.isArray(res)) return res.map((s: any) => ({ symbol: String(s) }));
        if (Array.isArray(res?.assets)) return res.assets;
        return [];
      })
    );
  }
}
