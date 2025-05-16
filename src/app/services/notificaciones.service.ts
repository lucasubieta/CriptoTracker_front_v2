import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://145.239.196.138:8080/api/notificaciones';

  constructor(private http: HttpClient) { }

  getConfig(nombreUsuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nombreUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  saveConfig(config: any): Observable<any> {
    return this.http.post(this.apiUrl, config).pipe(
      catchError(this.handleError)
    );
  }

  enviarNotificacionPrueba(nombreUsuario: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/enviar-prueba/${nombreUsuario}`,
      {},
      { responseType: 'text' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Error del lado del cliente (navegador)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = error.error?.message || error.message || 'Error en la comunicación con el servidor';
    }
    
    console.error('Error en NotificationService:', error);
    return throwError(() => new Error(errorMessage));
  }
}