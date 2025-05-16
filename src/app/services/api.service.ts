import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iCripto } from '../interfaces/iCripto';
import { iUsuario } from '../interfaces/iUsuario';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private base = 'http://145.239.196.138:8080/api';

  constructor(private http: HttpClient) {}

  login(identificador: string, contraseña: string): Observable<iUsuario> {
    return this.http.post<iUsuario>(`${this.base}/login`, { identificador, contraseña });
  }
  

  obtenerBilletera(usuario: string): Observable<iCripto[]> {
    return this.http.get<iCripto[]>(`${this.base}/billetera/${usuario}`);
  }

  agregarCripto(usuario: string, cripto: iCripto): Observable<string> {
    return this.http.post(`${this.base}/billetera/${usuario}/agregar`, cripto, { responseType: 'text' });
  }

  modificarCripto(usuario: string, cripto: iCripto): Observable<string> {
    return this.http.put(`${this.base}/billetera/${usuario}/modificar`, cripto, { responseType: 'text' });
  }

  eliminarCripto(usuario: string, nombre: string): Observable<string> {
    return this.http.delete(`${this.base}/billetera/${usuario}/eliminar/${nombre}`, { responseType: 'text' });
  }

  registrarUsuario(datos: { nombre: string; contraseña: string; correo: string}): Observable<string> {
    return this.http.post<string>(`${this.base}/usuarios/registrar`, datos, { responseType: 'text' as 'json' });
  }

  getTopCryptos(): Observable<any> {
    return this.http.get('http://145.239.196.138:8081/api/cripto/precios');
  }
  
}
