import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private backendUrl = 'http://localhost:8080/api/cripto/precios'; 

  constructor(private http: HttpClient) {}

  getLatestListings(): Observable<any> {
    return this.http.get(this.backendUrl, {
      params: {
        start: '1',
        limit: '50',
        convert: 'EUR'
      }
    });
  }
}
