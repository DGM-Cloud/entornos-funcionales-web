import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReclamacionRequest {
  esMenor: boolean;
  nombreApoderado: string;
  nombre: string;
  documento: string;
  telefono: string;
  domicilio: string;
  correo: string;
  tipoBien: 'Servicio' | 'Producto';
  montoReclamado: string;
  descripcionBien: string;
  tipoReclamo: 'Reclamo' | 'Queja';
  detalle: string;
  pedido: string;
  turnstileToken: string;
}

export interface ReclamacionMailStatus {
  empresa: 'pending' | 'sent' | 'failed';
  constancia: 'pending' | 'sent' | 'failed';
  overall: 'pending' | 'sent' | 'mail_pending' | 'partial';
}

export interface ReclamacionApiSuccess {
  ok: true;
  message: string;
  data: {
    codigo: string;
    createdAt: string;
    mail: ReclamacionMailStatus;
    reused?: boolean;
  };
}

export interface ReclamacionApiError {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

@Injectable({ providedIn: 'root' })
export class ReclamacionesApiService {
  private readonly http = inject(HttpClient);

  enviar(payload: ReclamacionRequest, idempotencyKey: string): Observable<ReclamacionApiSuccess> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    });

    return this.http.post<ReclamacionApiSuccess>(
      `${environment.apiBaseUrl}/api/reclamaciones`,
      payload,
      { headers },
    );
  }
}
