import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notificaciones';

  constructor(private http: HttpClient) {}

  getConfig(nombreUsuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nombreUsuario}`);
  }

  saveConfig(config: any): Observable<any> {
    return this.http.post(this.apiUrl, config);
  }

  sendTestNotification(nombreUsuario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar-prueba/${nombreUsuario}`, {});
  }
}