import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AssetsResponse, AssetInfo } from '../models/assets.model';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  constructor(private api: ApiService) {}

  list(): Observable<AssetInfo[]> {
    return this.api.get<AssetsResponse>('/assets').pipe(
      map((res) => res?.data ?? [])
    );
  }
}