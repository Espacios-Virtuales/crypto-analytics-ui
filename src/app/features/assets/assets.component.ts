import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsService } from '../../core/services/assets.service';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
})
export class AssetsComponent {
  loading = false;
  error: string | null = null;

  assets$: any;

  constructor(private assetsService: AssetsService) {
    this.assets$ = assetsService.list();
  }
}