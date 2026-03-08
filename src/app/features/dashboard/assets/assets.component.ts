import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AssetsService } from '../../../core/services/assets.service';
import { AssetInfo } from '../../../core/models/assets.model';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
})
export class AssetsComponent {
  private assetsService = inject(AssetsService);
  assets$: Observable<AssetInfo[]> = this.assetsService.list();
}