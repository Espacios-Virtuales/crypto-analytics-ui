import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']

})
export class HealthComponent {
  loading = false;
  status: 'idle' | 'ok' | 'fail' = 'idle';
  message = '';
  details: unknown = null;

  constructor(private api: ApiService) { }

  check(): void {
    this.loading = true;
    this.status = 'idle';
    this.message = '';
    this.details = null;

    this.api.ready()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.details = data;

          if (data.status === 'READY') {
            this.status = 'ok';
            this.message = 'API READY ✅';
          } else {
            // sigue siendo conexión OK, pero sistema no listo
            this.status = 'fail';
            this.message = `API NOT READY ⚠️ — ${data.reason ?? 'sin razón'}`;
          }
        },
        error: (err: any) => {
          const payload = err?.error; // puede ser objeto JSON
          this.details = payload ?? { status: err?.status, message: err?.message };
        
          if (err?.status === 503 && payload?.status) {
            this.status = 'fail'; // o 'warn' si agregas estado intermedio
            this.message = `API ${payload.status} (503) — ${payload.reason ?? 'sin razón'}`;
            return;
          }
        
          this.status = 'fail';
          this.message = 'Conexión fallida';
        }
      });
  }
}
