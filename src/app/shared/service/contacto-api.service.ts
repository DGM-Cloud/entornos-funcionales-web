import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactoRequest {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  partida: string;
  ubicacion: string;
  descripcion: string;
  aceptaPrivacidad: boolean;
  turnstileToken: string;
}

export interface ContactoApiSuccess {
  ok: true;
  message: string;
}

export interface ContactoApiError {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

@Injectable({ providedIn: 'root' })
export class ContactoApiService {
  private readonly http = inject(HttpClient);

  enviar(payload: ContactoRequest, idempotencyKey: string): Observable<ContactoApiSuccess> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    });

    return this.http.post<ContactoApiSuccess>(
      `${environment.apiBaseUrl}/api/contacto`,
      payload,
      { headers },
    );
  }
}
