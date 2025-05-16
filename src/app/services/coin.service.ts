// coin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private backendUrl = '/api/cripto/precios';
  private availableCryptos: string[] = [];

  constructor(private http: HttpClient) {}

  getLatestListings(): Observable<any> {
    return this.http.get(this.backendUrl).pipe(
      tap((response: any) => {
        // Almacenar los símbolos de las criptomonedas disponibles
        this.availableCryptos = response.data.map((crypto: any) => crypto.symbol);
      })
    );
  }

  getAvailableCryptos(): string[] {
    return this.availableCryptos;
  }

  isCryptoAvailable(symbol: string): boolean {
    return this.availableCryptos.includes(symbol.toUpperCase());
  }
}